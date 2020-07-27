import { Component, OnInit } from '@angular/core';
import {MyEvent} from '../model/my-event';
import {Router} from '@angular/router';
import {EventService} from '../shared/event-service/event.service';
import {FileService} from '../shared/file-service/file.service';
import {Message} from 'primeng';
import {SessionStorageService} from 'ngx-webstorage';
import {UserService} from '../shared/user-service/user.service';
import {Presence} from '../model/presence';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: MyEvent[] = [];
  msgs: Message[] = [];
  attendeesEvents: Presence[] = [];
  speakerEvents: MyEvent[] = [];
  constructor(private eventService: EventService, private router: Router, private fileService: FileService,
              private  sessionStorage: SessionStorageService, private userService: UserService) {
  }

  ngOnInit() {
    this.showMessage();
    this.setEvents();
  }

  setEvents() {
    switch (this.sessionStorage.retrieve('currentUser').role) {
      case 'ADMINISTRATOR':
        this.getAll();
        break;
      case 'ATTENDEE':
        this.getAllByUser();
        break;
      default:
        this.getAllBySpeaker();
        break;
    }
  }

  getAll() {
    this.eventService.getAll()
      .subscribe(
        (events) => {
          this.events = events;
          this.events.forEach((e, i) => {
            // this.events[i].image.name = 'data:image/png;base64,' + e.image.fileByte;
            this.getImage2(e.image.name, i);
          });
        },
        (error) => {
          console.log('GRESKAAA!', error);
        }
      );
  }

  getAllByUser() {
    this.userService.findByUser(this.sessionStorage.retrieve('currentUser').userID)
      .subscribe(
        (presences) => {
          this.attendeesEvents = presences;
          this.attendeesEvents.forEach((e, i) => {
            // this.attendeesEvents[i].event.image.name = 'data:image/png;base64,' + e.event.image.fileByte;
            this.getImage(e.event.image.name, i);
          });
        }
      );
  }

  getAllBySpeaker() {
    this.eventService.findAllBySpeaker(this.sessionStorage.retrieve('currentUser').speakerID)
      .subscribe(
        (events) => {
          this.speakerEvents = events;
          this.speakerEvents.forEach((e, i) => {
            // this.speakerEvents[i].image.name = 'data:image/png;base64,' + e.image.fileByte;
            this.getImage3(e.image.name, i);
          });
        }
      );
  }

  selectEvent(event: Event, e: MyEvent) {
    this.router.navigate(['/events', e.eventID]);
    event.preventDefault();
  }

  getImage(name, rb) {
    this.fileService.getFile(name)
      .subscribe(
        res => {
          this.attendeesEvents[rb].event.image.name = 'data:image/png;base64,' + res.fileByte;
        }
      );
  }

  getImage2(name, rb) {
    this.fileService.getFile(name)
      .subscribe(
        res => {
          this.events[rb].image.name = 'data:image/png;base64,' + res.fileByte;
        }
      );
  }

  getImage3(name, rb) {
    this.fileService.getFile(name)
      .subscribe(
        res => {
          this.speakerEvents[rb].image.name = 'data:image/png;base64,' + res.fileByte;
        }
      );
  }

  showMessage() {
    if (this.sessionStorage.retrieve('message-success-event') !== null) {
      this.msgs = [];
      this.msgs.push({severity: 'success', summary: 'Success Message',
        detail: this.sessionStorage.retrieve('message-success-event')});
      this.sessionStorage.store('message-success-event', null);
    }
  }

  addAttendees(e: MyEvent) {
    this.router.navigate(['/add-attendees', e.eventID]);
  }

  isAdmin() {
    return this.userService.admin;
  }

  isSpeaker() {
    return this.sessionStorage.retrieve('currentUser').speakerID != null;
  }
}
