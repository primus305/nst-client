import { Component, OnInit } from '@angular/core';
import {Speaker} from '../../model/speaker';
import {SpeakerService} from '../../shared/speaker-service/speaker.service';
import {Message} from 'primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-speaker-panel',
  templateUrl: './speaker-panel.component.html',
  styleUrls: ['./speaker-panel.component.css']
})
export class SpeakerPanelComponent implements OnInit {
  displaySpeaker = false;
  msgs: Message[] = [];
  speakerForm: FormGroup;

  constructor(private speakerService: SpeakerService, private fb: FormBuilder) { }

  ngOnInit() {
    this.cleanForm();
  }

  cleanForm() {
    this.speakerForm = this.fb.group({
      speakerName: new FormControl('', Validators.required),
      speakerLastName: new FormControl('', Validators.required),
      speakerFaculty: new FormControl('', Validators.required),
      speakerOrganization: new FormControl('', Validators.required),
      speakerEmail: new FormControl('', Validators.email),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  showSuccessMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Success Message', detail: 'Sistem je zapamtio predavača.'});
  }

  showErrorMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Sistem nije zapamtio predavača.'});
  }

  saveSpeaker() {
    const speaker: Speaker = {
      speakerID: null,
      firstName: this.speakerForm.get('speakerName').value,
      lastName: this.speakerForm.get('speakerLastName').value,
      faculty: this.speakerForm.get('speakerFaculty').value,
      organization: this.speakerForm.get('speakerOrganization').value,
      username: this.speakerForm.get('username').value,
      password: this.speakerForm.get('password').value,
      email: this.speakerForm.get('speakerEmail').value,
      role: null
    };
    this.speakerService.saveSpeaker(speaker).subscribe(
      (data) => {
        console.log('Data:', data.speakerID);
        this.displaySpeaker = false;
        this.speakerService.onSpeakerAdded(data);
        this.cleanForm();
        this.showSuccessMessage();
      },
      (error) => {
        console.log('GRESKAAA!', error);
        this.showErrorMessage();
      }
    );
  }

  showSpeakerModal() {
    this.displaySpeaker = true;
  }

  onRefreshMessages() {
    this.msgs = [];
  }
}
