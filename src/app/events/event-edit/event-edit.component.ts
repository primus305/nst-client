import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Message} from 'primeng';
import {Agenda} from '../../model/agenda';
import {EventService} from '../../shared/event-service/event.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FileService} from '../../shared/file-service/file.service';
import {SessionStorageService} from 'ngx-webstorage';
import {File} from '../../model/file';
import {MyEvent} from '../../model/my-event';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

  eventForm: FormGroup;
  msgs: Message[] = [];
  fileUploadApi = 'http://localhost:8080/file/save';
  id: number;
  agenda: Agenda;
  myEvent: MyEvent;
  haveAgenda = false;
  image: string;
  eventID: number;

  constructor(private fb: FormBuilder, private eventService: EventService, private router: Router,
              private fileService: FileService, private sessionStorage: SessionStorageService,
              private route: ActivatedRoute) { }

  ngOnInit() {
/*    this.cleanForm();
    this.showMessage();
    this.setMessages();*/
    this.cleanForm();
    this.eventID = +this.route.snapshot.params.id;
    this.eventService.findById(this.eventID)
      .subscribe(
        (myEvent) => {
          this.myEvent = myEvent;
          this.setForm(myEvent);
        },
        error => {
          console.log('Greska', error);
        }
      );
  }

  cleanForm() {
      this.eventForm = this.fb.group({
        eventName: new FormControl('', Validators.required),
        eventDescription: new FormControl('', Validators.required),
        eventLocation: new FormControl('', Validators.required)
      });
  }

  showErrorMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Sistem nije zapamtio događaj.'});
  }

  setSession() {
    this.sessionStorage.store('event-name', this.eventForm.get('eventName').value);
    this.sessionStorage.store('event-desc', this.eventForm.get('eventDescription').value);
    this.sessionStorage.store('event-location', this.eventForm.get('eventLocation').value);
  }

  editAgenda() {
    this.setSession();
    this.router.navigate(['/agenda-view', this.myEvent.eventID, this.myEvent.agenda.agendaID]);
  }

  createAgenda() {
    this.setSession();
    this.router.navigate(['/agenda']);
  }

  updateEvent(myEvent) {
    this.eventService.saveEvent(myEvent)
      .subscribe(
        (data) => {
          console.log('My event', data);
          this.cleanForm();
          this.sessionStorage.clear('logo-edit');
          console.log('Proba sesija logo edit', this.sessionStorage.retrieve('logo-edit'));
          this.sessionStorage.store('message-success-event', 'Uspesno ste promenili dogadjaj.');
          this.router.navigate(['/events']);
        },
        error => {
          console.log('GRESka!!!', error);
          this.showErrorMessage();
        }
      );
  }

  onUpload(event) {
    for (const file of event.files) {
      this.sessionStorage.store('logo-edit', file.name);
    }
  }

  deleteCurrentLogo() {
    this.image = null;
  }

  setForm(myEvent: MyEvent) {
    if (myEvent.agenda) {
      this.haveAgenda = true;
    }
    this.getImage(myEvent.image.name);
    this.eventForm = this.fb.group({
      eventName: new FormControl(myEvent.name, Validators.required),
      eventDescription: new FormControl(myEvent.description, Validators.required),
      eventLocation: new FormControl(myEvent.location, Validators.required)
    });
  }

  getImage(image: string) {
    this.fileService.getFile(image)
      .subscribe(
        res => {
          this.image = 'data:image/png;base64,' + res.fileByte;
        }
      );
  }

  getAgenda() {
    console.log('Provera agenda sesija', this.sessionStorage.retrieve('agenda'));
    if (this.sessionStorage.retrieve('agenda') !== null) {
      this.id = this.sessionStorage.retrieve('agenda');
      const a: Agenda = {
        agendaID: this.id + 1,
        name: null,
        dateFrom: null,
        dateTo: null,
        sessions: null
      };
      this.sessionStorage.clear('agenda');
      this.myEvent.agenda = a;
    }
  }

  getEvent() {
    this.getAgenda();
    this.myEvent.name = this.eventForm.get('eventName').value;
    this.myEvent.description = this.eventForm.get('eventDescription').value;
    this.myEvent.location = this.eventForm.get('eventLocation').value;
    if (this.sessionStorage.retrieve('logo-edit') === null) {
      // this.myEvent.image = null;
      this.updateEvent(this.myEvent);
    } else {
      this.fileService.getFile(this.sessionStorage.retrieve('logo-edit'))
        .subscribe(
          (res) => {
            const img: File = {
              id: res.id,
              name: res.name,
              type: res.type,
              fileByte: res.fileByte
            };
            this.myEvent.image = img;
            this.updateEvent(this.myEvent);
          }
        );
    }

  }

  cancel() {
    this.router.navigate(['/events', this.eventID]);
  }
}
