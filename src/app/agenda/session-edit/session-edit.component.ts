import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AgendaService} from '../../shared/agenda-service/agenda.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AgendaSession} from '../../model/agenda-session';
import {Message} from 'primeng';
import {Hall} from '../../model/hall';
import {AgendaSessionSpeaker} from '../../model/agenda-session-speaker';
import {AgendaSessionTrack} from '../../model/agenda-session-track';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SessionStorageService} from 'ngx-webstorage';
import {ValidatorService} from '../../shared/validator/validator.service';
import {File} from '../../model/file';
import {FileService} from '../../shared/file-service/file.service';

@Component({
  selector: 'app-session-edit',
  templateUrl: './session-edit.component.html',
  styleUrls: ['./session-edit.component.css']
})
export class SessionEditComponent implements OnInit {
  agendaSession: AgendaSession;
  msgs: Message[] = [];
  dateValidation: Message[] = [];
  selectedHall: Hall;
  selectedTracksForSave: AgendaSessionTrack[] = [];
  selectedTracksForDelete: AgendaSessionTrack[] = [];
  selectedSpeakersForSave: AgendaSessionSpeaker[] = [];
  selectedSpeakersForDelete: AgendaSessionSpeaker[] = [];
  sessions: AgendaSession[] = [];
  sessionID: number;
  agendaID: number;
  eventID: number;
  @Output() sessionsUpdated = new EventEmitter<AgendaSession[]>();
  sessionForm: FormGroup;
  fileUploadApi = 'http://localhost:8080/file/save';
  file: string = null;

  constructor(private agendaService: AgendaService, private route: ActivatedRoute, private fb: FormBuilder,
              private router: Router, private sessionStorage: SessionStorageService, private validatorService: ValidatorService,
              private fileService: FileService) { }

  ngOnInit() {
    this.listenValidator();
    this.cleanForm();
    this.agendaID = +this.route.snapshot.params.agenda;
    this.sessionID = +this.route.snapshot.params.id;
    this.eventID = +this.route.snapshot.params.eventID;
    this.agendaService.findSessionById(this.agendaID, this.sessionID)
      .subscribe(
        (s) => {
          console.log('Provera', s);
          this.agendaSession = s;
          this.validatorService.superSession = s.superSession;
          this.setForm(s);
          // this.getTracks(s.agendaID, s.sessionID);
          // this.getSpeakers(s.agendaID, s.sessionID);
        }
      );
  }

  setForm(s: AgendaSession) {
    this.sessionForm = this.fb.group({
      sessionName: new FormControl(s.name, Validators.required),
      sessionOverview: new FormControl(s.sessionOverview, Validators.required),
      sessionDateFrom: new FormControl(new Date(s.timeFrom)),
      sessionTimeFrom: new FormControl(new Date(s.timeFrom)),
      sessionDateTo: new FormControl(new Date(s.timeTo)),
      sessionTimeTo: new FormControl(new Date(s.timeTo))
    }, {
      validators: [
        this.validatorService.dateLessThan('sessionTimeFrom', 'sessionTimeTo', 'sessionDateFrom', 'sessionDateTo'),
        this.validatorService.dateIntervalSubSessionEdit('sessionTimeFrom', 'sessionTimeTo',
          'sessionDateFrom', 'sessionDateTo')
      ]});
    this.selectedHall = s.hall;
    if (s.file != null) {
      this.file = s.file.name;
    }
  }

  getAttachment() {
    if (this.sessionStorage.retrieve('attachment-edit') === null) {
      // this.myEvent.image = null;
      this.updateSession(null);
    } else {
      this.fileService.getFile(this.sessionStorage.retrieve('attachment-edit'))
        .subscribe(
          (res) => {
            const file: File = {
              id: res.id,
              name: res.name,
              type: res.type,
              fileByte: res.fileByte
            };
            this.updateSession(file);
          }
        );
    }
  }

  updateSession(file: File) {
    this.getFormValues();
    this.agendaSession.file = file;
    console.log('Ovo je agenda session provera ', this.agendaSession);
    this.agendaService.updateSession(this.agendaSession)
      .subscribe(
        (data) => {
          console.log('Provera sve je u redu.', data);
          this.updateSessionTracks();
          this.updateSessionSpeakers();
          this.showSuccessMessage();
          this.router.navigate(['/session', this.eventID, this.agendaID, this.sessionID],
            {state: {mode: 'SE'}});
        }, error => {
          console.log('Greska!', error);
        }
      );
  }

  showSuccessMessage() {
    this.sessionStorage.store('message-success-session-edit', 'Uspešno ste izmenili sekciju.');
  }

  getFormValues() {
    const timeFrom = this.sessionForm.get('sessionTimeFrom').value;
    const timeTo = this.sessionForm.get('sessionTimeTo').value;
    this.withRegularDates(timeFrom, timeTo);
  }

  withRegularDates(timeFrom: Date, timeTo: Date) {
    this.agendaSession.name = this.sessionForm.get('sessionName').value;
    this.agendaSession.timeFrom = timeFrom.toString();
    this.agendaSession.timeTo = timeTo.toString();
    this.agendaSession.sessionOverview = this.sessionForm.get('sessionOverview').value;
    this.agendaSession.hall = this.selectedHall;
  }

  onTrackSelected(selectedTracks: AgendaSessionTrack[]) {
    this.selectedTracksForSave = selectedTracks;
  }

  onTrackSelectedForDelete(selectedTracks: AgendaSessionTrack[]) {
    this.selectedTracksForDelete = selectedTracks;
  }

  onHallSelected(selectedHall: Hall) {
    this.selectedHall = selectedHall;
  }

  cleanForm() {
    this.sessionForm = this.fb.group({
      sessionName: new FormControl('', Validators.required),
      sessionOverview: new FormControl('', Validators.required),
      sessionDateFrom: new FormControl(new Date()),
      sessionTimeFrom: new FormControl(new Date()),
      sessionDateTo: new FormControl(new Date()),
      sessionTimeTo: new FormControl(new Date())
    }, {
      validators: [
        this.validatorService.dateLessThan('sessionTimeFrom', 'sessionTimeTo', 'sessionDateFrom', 'sessionDateTo'),
        this.validatorService.dateIntervalSubSessionEdit('sessionTimeFrom', 'sessionTimeTo',
          'sessionDateFrom', 'sessionDateTo')
      ]});
    this.selectedHall = null;
  }

  updateSessionTracks() {
    this.agendaService.saveAgendaSessionTracks(this.selectedTracksForSave).subscribe(
      (data3) => {
        console.log('Data:', data3);
        this.deleteTracks();
      }
    );
  }

  deleteTracks() {
    this.agendaService.removeAgendaSessionTracks(this.selectedTracksForDelete).subscribe(
      (data3) => {
        console.log('Data:', data3);
      }, error => {
        console.log('Provera brisanje greska', error);
      }
    );
  }

  onSpeakerForSave(speakers: AgendaSessionSpeaker[]) {
    this.selectedSpeakersForSave = speakers;
  }

  onSpeakerForDelete(speakers: AgendaSessionSpeaker[]) {
    this.selectedSpeakersForDelete = speakers;
  }

  updateSessionSpeakers() {
    this.agendaService.saveAgendaSessionSpeakers(this.selectedSpeakersForSave).subscribe(
      (data3) => {
        console.log('Data:', data3);
        this.deleteSpeakers();
      }
    );
  }

  deleteSpeakers() {
    this.agendaService.removeAgendaSessionSpeakers(this.selectedSpeakersForDelete).subscribe(
      (data3) => {
        console.log('Data:', data3);
      }, error => {
        console.log('Provera brisanje greska', error);
      }
    );
  }
  cancel() {
    this.router.navigate(['/session', this.eventID, this.agendaID, this.sessionID],
      {state: {mode: 'SE'}});
  }

  listenValidator() {
    this.validatorService.sendMessage
      .subscribe(
        (poruka) => {
          this.dateValidation = [];
          this.dateValidation.push({severity: 'error', summary: poruka});
        }
      );
  }

  onUpload(event) {
    for (const file of event.files) {
      this.sessionStorage.store('attachment-edit', file.name);
    }
  }
  deleteCurrentAttachment() {
    this.file = null;
  }

}
