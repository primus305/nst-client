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
  sessions: AgendaSession[] = [];
  agenda: Agenda;
  displayDialog = false;
  msgs: Message[] = [];
  agendaForm: FormGroup;

  constructor(private agendaService: AgendaService,
              private fb: FormBuilder,
              private sessionStorage: SessionStorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.agendaService.getNextID().subscribe(
      (data) => {
        this.agendaID = data;
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
    this.cleanForm();
  }

  onSubmit() {
    this.makeAgenda();
    this.agendaService.saveAgenda(this.agenda).subscribe(
      (data) => {
        this.displayDialog = false;
        this.showSuccessMessage();
        this.router.navigate(['/event-create']);
      },
      (error) => {
        console.log('GRESKAAA!', error);
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
      sessions: this.sessions
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
