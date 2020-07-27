import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AgendaService} from '../../shared/agenda-service/agenda.service';
import {AgendaSession} from '../../model/agenda-session';
import {TrackService} from '../../shared/track-service/track.service';
import {AgendaSessionTrack} from '../../model/agenda-session-track';
import {AgendaSessionSpeaker} from '../../model/agenda-session-speaker';
import {SpeakerService} from '../../shared/speaker-service/speaker.service';
import {User} from '../../model/user';
import {SessionStorageService} from 'ngx-webstorage';
import {UserService} from '../../shared/user-service/user.service';
import {Message} from 'primeng';
import {UserSession} from '../../model/user-session';
import {Location} from '@angular/common';
import {FileService} from '../../shared/file-service/file.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.css']
})
export class SessionViewComponent implements OnInit {
  agendaID: number;
  sessionID: number;
  eventID: number;
  agendaSession: AgendaSession;
  sessionTracks: AgendaSessionTrack[] = [];
  sessionSpeakers: AgendaSessionSpeaker[] = [];
  subSessions: AgendaSession[] = [];
  responsiveOptions;
  mySession: boolean;
  msgs: Message[] = [];
  displayAttendees = false;
  sessionUsers: UserSession[] = [];
  speakerMode = false;
  currentSession;

  constructor(private route: ActivatedRoute,
              private agendaService: AgendaService,
              private trackService: TrackService,
              private speakerService: SpeakerService,
              private router: Router,
              private sessionStorage: SessionStorageService,
              private userService: UserService,
              private location: Location,
              private fileService: FileService) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit() {
    this.msgs = [];
    this.agendaID = +this.route.snapshot.params.agenda;
    this.sessionID = +this.route.snapshot.params.id;
    this.eventID = +this.route.snapshot.params.eventID;
    this.findSessionById(this.agendaID, this.sessionID);
    this.showUpdateMessage();
  }

  findSessionById(agendaID: number, sessionID: number) {
    this.agendaService.findSessionById(agendaID, sessionID)
      .subscribe(
        (agendaSession) => {
          console.log('Session content', agendaSession);
          this.agendaSession = agendaSession;
          this.subSessions = this.agendaSession.subSessions;
          this.sessionSpeakers = this.agendaSession.speakers;
          this.sessionTracks = this.agendaSession.tracks;
          const user: User = this.sessionStorage.retrieve('currentUser');
          this.userOrSpeakerMode(agendaSession, user);
        }
      );
  }

  userOrSpeakerMode(agendaSession: AgendaSession, user: User) {
    const currentUser: any = this.sessionStorage.retrieve('currentUser');
    if (currentUser.role === 'ATTENDEE') {
      this.getUserSession(agendaSession.agendaID, agendaSession.sessionID, user.userID, this.eventID);
    }
    if (currentUser.speakerID != null) {
      this.getSpeakerSession(agendaSession.agendaID, agendaSession.sessionID, currentUser.speakerID);
    }
  }

  openSubSession(subSession: AgendaSession) {
    this.router.navigate(['/session', this.eventID, subSession.agendaID, subSession.sessionID],
      {state: {mode: 'SS'}})
      .then(
        () => {
          this.ngOnInit();
        }
      );
  }

  goBackSS() {
    this.router.navigate(['/session', this.eventID,
      this.agendaID, this.agendaSession.superSession.sessionID], {state: {mode: 'AW'}})
      .then(
        () => {
          this.speakerMode = false;
          this.ngOnInit();
        }
      );
  }

  goBackEdit() {
    if (this.agendaSession.superSession == null) {
      this.router.navigate(['/agenda-view', this.eventID, this.agendaID]);
    } else {
      this.goBackSS();
    }
  }

  goBack() {
    this.currentSession = this.location.getState();
    switch (this.currentSession.mode) {
      case 'SS': this.goBackSS();
                 break;
      case 'AW': this.router.navigate(['/agenda-view', this.eventID, this.agendaID]);
                 break;
      case 'MS': this.router.navigate(['/my-sessions']);
                 break;
      case 'SE': this.goBackEdit();
                 break;
    }
  }

  getUserSession(agendaID: number, sessionID: number, userID: number, eventID: number) {
    this.userService.getUserSession(agendaID, sessionID, userID, eventID)
      .subscribe(
        (userSession) => {
          if (userSession != null) {
            this.mySession = true;
            this.showInfo('Polaznik');
          } else {
            this.mySession = false;
          }
        },
        error => {
          console.log('GRESKAAA!', error);
        }
      );
  }

  getSpeakerSession(agendaID: number, sessionID: number, speakerID: number) {
    this.speakerService.findById(agendaID, sessionID, speakerID)
      .subscribe(
        (speakerSession) => {
          if (speakerSession != null) {
            this.speakerMode = true;
            this.showInfo('Predavac');
          }
        },
        error => {
          console.log('GRESKAAA!', error);
        }
      );
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Success Message', detail: event});
    this.mySession = !this.mySession;
  }

  displayAtt() {
    this.displayAttendees = true;
    this.userService.findAllUsersBySession(this.agendaID, this.sessionID)
      .subscribe(
        (users) => {
          this.sessionUsers = users;
        }
      );
  }


  showUpdateMessage() {
    if (this.sessionStorage.retrieve('message-success-session-edit') === 'Uspešno ste izmenili sekciju.') {
      this.msgs = [];
      this.msgs.push({severity: 'success', summary: 'Success Message',
        detail: this.sessionStorage.retrieve('message-success-session-edit')});
      this.sessionStorage.clear('message-success-session-edit');
    }
  }

  isAdmin() {
    return this.userService.admin;
  }

  editSession() {
    this.router.navigate(['/session-edit', this.eventID, this.agendaID, this.sessionID]);
  }

  downloadFile() {
    this.fileService.downloadFile(this.agendaSession.file.name)
      .subscribe(
        (response) => {
         /* const blob: any = new Blob([response], { type: 'text/json; charset=utf-8' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
          window.location.href = url;*/
          fileSaver.saveAs(response, this.agendaSession.file.name);
          // console.log(response);
        }
      );
  }

  isSpeaker() {
    return this.sessionStorage.retrieve('currentUser').speakerID != null;
  }

  isSpeakerSession() {
    return this.speakerMode;
  }

  showInfo(msg: string) {
    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'Info Message', detail: 'Uloga na sekciji: ' + msg});
  }

}
