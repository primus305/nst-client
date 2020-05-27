import {Component, OnInit} from '@angular/core';
import {AgendaService} from '../shared/agenda-service/agenda.service';
import {Agenda} from '../model/agenda';
import {AgendaSession} from '../model/agenda-session';
import {Message} from 'primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  agendaID: number;
  agendaName: string;
  sessions: AgendaSession[] = [];
  agenda: Agenda;

  displayDialog = false;
  msgs: Message[] = [];
  nameRequired: Message[] = [];
  agendaForm: FormGroup;
  constructor(private agendaService: AgendaService, private fb: FormBuilder, private sessionStorage: SessionStorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.agendaService.getNextID().subscribe(
      (data) => {
        console.log('Data:', data);
        this.agendaID = data;
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
    this.cleanForm();
    this.nameRequired.push({severity: 'error', summary: 'Name is required.'});
  }

  onSubmit() {
    this.makeAgenda();
    this.agendaService.saveAgenda(this.agenda).subscribe(
      (data) => {
        console.log('Data:', data);
        this.saveAgendaSessions();
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
  }

  saveAgendaSessions() {
    this.agendaService.saveAgendaSessions(this.sessions).subscribe(
      (data2) => {
        console.log('Data:', data2);
        for (const s of this.sessions) {
          this.saveAgendaSessionTracks(s);
          this.saveAgendaSessionSpeakers(s);
        }
        this.displayDialog = false;
        this.showSuccessMessage();
        this.router.navigate(['/event-create']);
        // this.cleanForm();
        // this.agendaService.refreshSessionPanel.emit();
      },
      (error) => {
        console.log('GRESKAAA sessions!', error);
      }
    );
  }

  saveAgendaSessionTracks(session: AgendaSession) {
    this.agendaService.saveAgendaSessionTracks(session.tracks).subscribe(
      (data3) => {
        console.log('Data:', data3);
      }
    );
  }

  saveAgendaSessionSpeakers(session: AgendaSession) {
    this.agendaService.saveAgendaSessionSpeakers(session.speakers).subscribe(
      (data4) => {
        console.log('Data:', data4);
      }
    );
  }

  makeAgenda() {
    const timeFrom = this.agendaForm.get('timeFrom').value;
    const timeTo = this.agendaForm.get('timeTo').value;
    const dateFrom = this.agendaForm.get('dateFrom').value;
    const dateTo = this.agendaForm.get('dateTo').value;
    timeFrom.setFullYear(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
    timeTo.setFullYear(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());
    this.agenda = {
      agendaID: null,
      name: this.agendaForm.get('agendaName').value,
      dateFrom: timeFrom.toString(),
      dateTo: timeTo.toString(),
      sessions: null
    };
  }

  showSuccessMessage() {
    this.sessionStorage.store('message-success-agenda', 'Uspešno sačuvana agenda.');
    this.sessionStorage.store('agenda', this.agendaID);
  }

  cleanForm() {
    this.agendaForm = this.fb.group({
      agendaName: new FormControl('', Validators.required),
      dateFrom: new FormControl(new Date()),
      timeFrom: new FormControl(new Date()),
      dateTo: new FormControl(new Date()),
      timeTo: new FormControl(new Date())
    });
  }

  onSessionsUpdated(updatedSessions: AgendaSession[]) {
    this.sessions = updatedSessions;
  }

}
