import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {UserService} from '../shared/user-service/user.service';
import {SessionStorageService} from 'ngx-webstorage';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {SpeakerService} from '../shared/speaker-service/speaker.service';
import {EventService} from '../shared/event-service/event.service';
import {AgendaSessionSpeaker} from '../model/agenda-session-speaker';

export interface EventSession {
  eventID: number;
  agendaID: number;
  sessionID: number;
  eventName: string;
  name: string;
  timeFrom: Date;
  timeTo: Date;
}

@Component({
  selector: 'app-my-sessions',
  templateUrl: './my-sessions.component.html',
  styleUrls: ['./my-sessions.component.css']
})
export class MySessionsComponent implements OnInit {
  userSessions;
  userSessionsPast;
  userSessionsFuture;
  mySessions: EventSession[] = [];
  mySessionsPast: EventSession[] = [];
  mySessionsFuture: EventSession[] = [];
  displayedColumns: string[] = ['icon', 'eventName', 'name', 'timeFrom', 'timeTo', 'open-session'];
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  constructor(private userService: UserService, private sessionStorage: SessionStorageService,
              private router: Router, private speakerService: SpeakerService,
              private eventService: EventService) { }

  ngOnInit() {
    if (this.sessionStorage.retrieve('currentUser').speakerID != null) {
      this.getSpeakerSessions();
    } else {
      this.getUserSessions();
    }
  }

  getUserSessions() {
    this.userService.findSessionsByUser(this.sessionStorage.retrieve('currentUser').userID)
      .subscribe(
        (mySessions) => {
          console.log('Provera', mySessions);
          mySessions.forEach(s => {
            const eventSession: EventSession = {
              eventID: s.eventID,
              agendaID: s.agendaID,
              sessionID: s.sessionID,
              eventName: s.presence.event.name,
              name: s.agendaSession.name,
              timeFrom: new Date(s.agendaSession.timeFrom),
              timeTo: new Date(s.agendaSession.timeTo)
            };
            this.mySessions.push(eventSession);
          });
          this.userSessions = new MatTableDataSource(this.mySessions);
          this.setUserSessionsPast(this.mySessions);
          this.setUserSessionsFuture(this.mySessions);
          this.userSessions.sort = this.sort.toArray()[0];
          this.userSessions.paginator = this.paginator.toArray()[0];
        }, error => {
          console.log('Greska!!!', error);
        }
      );
  }

  getSpeakerSessions() {
    this.speakerService.findAllBySpeaker(this.sessionStorage.retrieve('currentUser').speakerID)
      .subscribe(
        (speakerSessions) => {
          console.log('Provera', speakerSessions);
          this.findSessionEvents(speakerSessions);
        }
      );
  }

  findSessionEvents(sessionSpeakers: AgendaSessionSpeaker[]) {
    this.eventService.findAllBySpeaker(this.sessionStorage.retrieve('currentUser').speakerID)
      .subscribe(
        (events) => {
          console.log('Provera spekaer events:', events);
          sessionSpeakers.forEach(ss => {
            events.forEach(e => {
              if (ss.agendaID === e.agenda.agendaID) {
                const eventSession: EventSession = {
                  eventID: e.eventID,
                  agendaID: ss.agendaID,
                  sessionID: ss.sessionID,
                  eventName: e.name,
                  name: ss.agendaSessionName,
                  timeFrom: new Date(ss.agendaSessionTimeFrom),
                  timeTo: new Date(ss.agendaSessionTimeTo)
                };
                this.mySessions.push(eventSession);
              }
            });
          });
          this.userSessions = new MatTableDataSource(this.mySessions);
          console.log('Provera lokalna:', this.mySessions);
          this.setUserSessionsPast(this.mySessions);
          this.setUserSessionsFuture(this.mySessions);
          this.userSessions.sort = this.sort.toArray()[0];
          this.userSessions.paginator = this.paginator.toArray()[0];
        }
      );
  }

  setUserSessionsPast(userSessionPast: EventSession[]) {
    for (const s of userSessionPast) {
      if (s.timeTo < new Date()) {
        this.mySessionsPast.push(s);
      }
    }
    this.userSessionsPast = new MatTableDataSource(this.mySessionsPast);
    this.userSessionsPast.sort = this.sort.toArray()[1];
    this.userSessionsPast.paginator = this.paginator.toArray()[1];
  }

  setUserSessionsFuture(userSessionPast: EventSession[]) {
    for (const s of userSessionPast) {
      if (s.timeTo > new Date()) {
        this.mySessionsFuture.push(s);
      }
    }
    this.userSessionsFuture = new MatTableDataSource(this.mySessionsFuture);
    this.userSessionsFuture.sort = this.sort.toArray()[2];
    this.userSessionsFuture.paginator = this.paginator.toArray()[2];
  }

  openSession(session: EventSession) {
    this.router.navigate(['/session', session.eventID, session.agendaID, session.sessionID],
      {state: {mode: 'MS'}});
  }
}
