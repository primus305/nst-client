import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from 'primeng';
import {Hall} from '../../model/hall';
import {AgendaSession} from '../../model/agenda-session';
import {Track} from '../../model/track';
import {SpeakerService} from '../../shared/speaker-service/speaker.service';
import {TrackService} from '../../shared/track-service/track.service';
import {HallService} from '../../shared/hall-service/hall.service';
import {AgendaSessionSpeaker} from '../../model/agenda-session-speaker';
import {AgendaSessionTrack} from '../../model/agenda-session-track';
import {Speaker} from '../../model/speaker';
import {AgendaService} from '../../shared/agenda-service/agenda.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ValidatorService} from '../../shared/validator/validator.service';
import {SessionStorageService} from 'ngx-webstorage';
import {File} from '../../model/file';
import {FileService} from '../../shared/file-service/file.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
  providers: [DatePipe]
})
export class SessionComponent implements OnInit {
  msgs: Message[] = [];
  nameRequired: Message[] = [];
  overviewRequired: Message[] = [];
  dateValidation: Message[] = [];
  selectedHall: Hall;
  selectedTracks: Track[] = [];
  sessions: AgendaSession[] = [];
  sessionMode = true;
  @Input() agendaID: number;
  speakers: AgendaSessionSpeaker[] = [];
  tracksAgr: AgendaSessionTrack[] = [];
  selectedSpeakers: Speaker[] = [];
  @Output() sessionsUpdated = new EventEmitter<AgendaSession[]>();
  addDisabled = true;
  saveDisabled = false;
  sessionForm: FormGroup;
  fileUploadApi = 'http://localhost:8080/file/save';

  constructor(private speakerService: SpeakerService, private trackService: TrackService,
              private hallService: HallService, private agendaService: AgendaService, private fb: FormBuilder,
              private datePipe: DatePipe, private validatorService: ValidatorService, private sessionStorage: SessionStorageService,
              private fileService: FileService) { }

  ngOnInit() {
    this.listenSelectSpeaker();
    this.listenRefreshPanel();
    this.listenValidator();
    this.cleanForm();
    this.nameRequired.push({severity: 'error', summary: 'Name is required.'});
    this.overviewRequired.push({severity: 'error', summary: 'Overview is required.'});
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

  listenRefreshPanel() {
    this.agendaService.refreshSessionPanel
      .subscribe(
        () => {
          this.msgs = [];
          this.emptySessionForm();
        }
      );
  }

  listenSelectSpeaker() {
    this.speakerService.speakerSelected
      .subscribe(
        (selectedSpeakers: Speaker[]) => {
          this.selectedSpeakers = selectedSpeakers;
        }
      );
  }

  emptySessionForm() {
    this.cleanForm();
    this.hallService.refreshHallPanel.emit();
    this.speakerService.refreshSpeakerPanel.emit();
    this.trackService.refreshTrackPanel.emit();
    this.addDisabled = true;
    this.saveDisabled = false;
  }

  showSuccessSavedMessage() {
    this.msgs = [];
    let message: string;
    if (this.sessionMode === false) {
      message = 'Podsesija je sačuvana.';
    } else {
      message = 'Sesija je sačuvana.';
    }
    this.msgs.push({severity: 'success', summary: 'Success Message',
      detail: message});
  }

  addNewSubSession(form) {
    this.sessionMode = false;
    this.emptySessionForm();
    form.clear();
    this.showSuccessMessageSubSession();
  }

  onTrackSelected(selectedTracks: Track[]) {
    this.selectedTracks = selectedTracks;
  }

  onHallSelected(selectedHall: Hall) {
    this.selectedHall = selectedHall;
  }

  addNewSession(form) {
    this.sessionMode = true;
    this.validatorService.superSessionTimeFrom = null;
    this.validatorService.superSessionTimeTo = null;
    this.emptySessionForm();
    form.clear();
    this.showSuccessMessageSession();
  }

  showSuccessMessageSubSession() {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Success Message',
      detail: 'Podsesija je kreirana.'});
  }

  showSuccessMessageSession() {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Success Message',
      detail: 'Sesija je kreirana.'});
  }

  pushFullSession(superS: AgendaSession, sessionTimeFrom: Date, sessionTimeTo: Date, attachment: File) {
    this.aggregationSpeaker();
    this.aggregationTrack();
    console.log('Poziv iz pushFullSession() :', this.tracksAgr);
    const session: AgendaSession = {
      sessionID: this.sessions.length + 1,
      agendaID: this.agendaID + 1,
      superSession: superS,
      name: this.sessionForm.get('sessionName').value,
      timeFrom: sessionTimeFrom.toString(),
      timeTo: sessionTimeTo.toString(),
      hall: this.selectedHall,
      sessionOverview: this.sessionForm.get('sessionOverview').value,
      tracks: this.tracksAgr,
      speakers: this.speakers,
      file: attachment
    };
    this.sessions.push(session);
    this.sessionsUpdated.emit(this.sessions);
    this.postAddingSession();
  }

  makeAndPush(superS: AgendaSession, sessionTimeFrom: Date, sessionTimeTo: Date) {
    if (this.sessionStorage.retrieve('attachment') === null) {
      // this.myEvent.image = null;
      this.pushFullSession(superS, sessionTimeFrom, sessionTimeTo, null);
    } else {
      this.fileService.getFile(this.sessionStorage.retrieve('attachment'))
        .subscribe(
          (res) => {
            const file: File = {
              id: res.id,
              name: res.name,
              type: res.type,
              fileByte: res.fileByte
            };
            this.pushFullSession(superS, sessionTimeFrom, sessionTimeTo, file);
            this.sessionStorage.clear('attachment');
          }
        );
    }
  }

  newSessionGen() {
    const sessionTimeFrom = this.sessionForm.get('sessionTimeFrom').value;
    const sessionTimeTo = this.sessionForm.get('sessionTimeTo').value;
    const sessionDateFrom = this.sessionForm.get('sessionDateFrom').value;
    const sessionDateTo = this.sessionForm.get('sessionDateTo').value;
    sessionTimeFrom.setFullYear(sessionDateFrom.getFullYear(), sessionDateFrom.getMonth(), sessionDateFrom.getDate());
    sessionTimeTo.setFullYear(sessionDateTo.getFullYear(), sessionDateTo.getMonth(), sessionDateTo.getDate());
    let superS = null;
    if (this.sessionMode === false) {
      for (let i = this.sessions.length - 1; i >= 0; i--) {
        if (this.sessions[i].superSession == null) {
          superS = this.sessions[i];
          break;
        }
      }
    }
    if (superS == null) {
      this.validatorService.superSessionTimeFrom = sessionTimeFrom;
      this.validatorService.superSessionTimeTo = sessionTimeTo;
    }
/*    this.aggregationSpeaker();
    this.aggregationTrack();*/
    this.makeAndPush(superS, sessionTimeFrom, sessionTimeTo);
    console.log('Provera liste sesija: ', this.sessions);
/*    this.sessionsUpdated.emit(this.sessions);
    this.postAddingSession();*/
  }

  postAddingSession() {
    this.showSuccessSavedMessage();
    this.saveDisabled = true;
    this.addDisabled = false;
    this.speakers = [];
    this.tracksAgr = [];
  }

  aggregationTrack() {
    for (const track of this.selectedTracks) {
      this.tracksAgr.push({
        sessionID: this.sessions.length + 1,
        agendaID: this.agendaID + 1,
        trackID: track.trackID,
        agendaSession: null,
        track: null
      });
    }
  }

  aggregationSpeaker() {
    for (const s of this.selectedSpeakers) {
      this.speakers.push({
        sessionID: this.sessions.length + 1,
        agendaID: this.agendaID + 1,
        speakerID: s.speakerID,
        agendaSession: null,
        speaker: null
      });
    }
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
        this.validatorService.dateIntervalSubSession('sessionTimeFrom', 'sessionTimeTo', 'sessionDateFrom', 'sessionDateTo')
      ]});
    this.selectedHall = null;
  }

  onUpload(event) {
    for (const file of event.files) {
      this.sessionStorage.store('attachment', file.name);
    }
  }
}
