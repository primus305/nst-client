import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Message} from 'primeng';
import {MyEvent} from '../../model/my-event';
import {EventService} from '../../shared/event-service/event.service';
import {Router} from '@angular/router';
import {File} from '../../model/file';
import {FileService} from '../../shared/file-service/file.service';
import {SessionStorageService} from 'ngx-webstorage';
import {Agenda} from '../../model/agenda';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  eventForm: FormGroup;
  msgs: Message[] = [];
  logo: string;
  fileUploadApi = 'http://localhost:8080/file/save';
  id: number;
  agenda: Agenda;

  constructor(private fb: FormBuilder,
              private eventService: EventService,
              private router: Router,
              private fileService: FileService,
              private sessionStorage: SessionStorageService) { }

  ngOnInit() {
    this.cleanForm();
    this.showMessage();
  }

  cleanForm() {
    if (this.sessionStorage.retrieve('event-name') !== null) {
      this.setForm();
      this.resetSession();
    } else {
      this.eventForm = this.fb.group({
        eventName: new FormControl('', Validators.required),
        eventDescription: new FormControl('', Validators.required),
        eventLocation: new FormControl('', Validators.required)
      });
    }
  }

  showErrorMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Sistem nije zapamtio događaj.'});
  }

  resetSession() {
    this.sessionStorage.store('event-name', null);
    this.sessionStorage.store('event-desc', null);
    this.sessionStorage.store('event-location', null);
  }

  setSession() {
    this.sessionStorage.store('event-name', this.eventForm.get('eventName').value);
    this.sessionStorage.store('event-desc', this.eventForm.get('eventDescription').value);
    this.sessionStorage.store('event-location', this.eventForm.get('eventLocation').value);
  }

  createAgenda() {
    this.setSession();
    this.router.navigate(['/agenda']);
  }

  createEvent() {
    this.fileService.getFile(this.sessionStorage.retrieve('logo'))
      .subscribe(
        (res) => {
          const img: File = {
            id: res.id,
            name: res.name,
            type: res.type,
            fileByte: res.fileByte
          };
          this.id = this.sessionStorage.retrieve('agenda');
          this.sessionStorage.clear('agenda');
          const myEvent: MyEvent = {
            eventID: null,
            name: this.eventForm.get('eventName').value,
            description: this.eventForm.get('eventDescription').value,
            location: this.eventForm.get('eventLocation').value,
            image: img,
            agenda: {agendaID: this.id + 1}
          };
          this.saveEvent(myEvent);
        }
      );
  }

  saveEvent(myEvent) {
    this.eventService.saveEvent(myEvent)
      .subscribe(
        (data) => {
          console.log('My event', data);
          this.cleanForm();
          this.sessionStorage.store('message-success-event', 'Uspesno ste uneli dogadjaj.');
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
      this.sessionStorage.store('logo', file.name);
    }
  }

  showMessage() {
    if (this.sessionStorage.retrieve('message-success-agenda') === 'Uspešno sačuvana agenda.') {
      this.msgs = [];
      this.msgs.push({severity: 'success', summary: 'Success Message',
        detail: this.sessionStorage.retrieve('message-success-agenda')});
      this.sessionStorage.store('message-success-agenda', '');
    }
  }

  setForm() {
    this.eventForm = this.fb.group({
      eventName: new FormControl(this.sessionStorage.retrieve('event-name'), Validators.required),
      eventDescription: new FormControl(this.sessionStorage.retrieve('event-desc'), Validators.required),
      eventLocation: new FormControl(this.sessionStorage.retrieve('event-location'), Validators.required)
    });
  }
}
