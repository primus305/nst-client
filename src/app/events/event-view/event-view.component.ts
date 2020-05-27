import { Component, OnInit } from '@angular/core';
import {MyEvent} from '../../model/my-event';
import {EventService} from '../../shared/event-service/event.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FileService} from '../../shared/file-service/file.service';
import {Presence} from '../../model/presence';
import {UserService} from '../../shared/user-service/user.service';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  myEvent: MyEvent = {
    eventID: null,
    name: null,
    description: null,
    location: null,
    image: null,
    agenda: null
  };
  retrievedImage: any;
  eventAttendees: Presence[] = [];
  responsiveOptions;
  eventID: number;

  constructor(private eventService: EventService, private route: ActivatedRoute, private router: Router,
              private fileService: FileService, private userService: UserService) {
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
    this.eventID = +this.route.snapshot.params.id;
    this.eventService.findById(this.eventID)
      .subscribe(
        (e) => {
          this.myEvent = e;
          this.getImage();
        }
      );
    this.getEventsUsers(this.eventID);
  }

  openAgenda() {
    this.router.navigate(['/agenda-view', +this.route.snapshot.params.id, this.myEvent.agenda.agendaID]);
  }

  getImage() {
    this.fileService.getFile(this.myEvent.image.name)
      .subscribe(
        res => {
          this.retrievedImage = 'data:image/png;base64,' + res.fileByte;
        }
      );
  }

  getEventsUsers(id) {
    this.userService.findByEvent(id).subscribe(
      (data) => {
        this.eventAttendees = data;
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
  }

  isAdmin() {
    return this.userService.admin;
  }

  editEvent() {
    this.router.navigate(['/event-edit', this.eventID]);
  }
}
