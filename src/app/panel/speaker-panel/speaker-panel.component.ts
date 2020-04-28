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
  nameRequired: Message[] = [];
  lastNameRequired: Message[] = [];
  facultyRequired: Message[] = [];
  organizationRequired: Message[] = [];
  emailValidation: Message[] = [];

  constructor(private speakerService: SpeakerService, private fb: FormBuilder) { }

  ngOnInit() {
    this.cleanForm();
    this.setMessages();
  }

  cleanForm() {
    this.speakerForm = this.fb.group({
      speakerName: new FormControl('', Validators.required),
      speakerLastName: new FormControl('', Validators.required),
      speakerFaculty: new FormControl('', Validators.required),
      speakerOrganization: new FormControl('', Validators.required),
      speakerEmail: new FormControl('', Validators.email)
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
      email: this.speakerForm.get('speakerEmail').value
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

  setMessages() {
    this.nameRequired.push({severity: 'error', summary: 'First name is required.'});
    this.lastNameRequired.push({severity: 'error', summary: 'Last name is required.'});
    this.facultyRequired.push({severity: 'error', summary: 'Faculty is required.'});
    this.organizationRequired.push({severity: 'error', summary: 'Organization is required.'});
    this.emailValidation.push({severity: 'error', summary: 'Not valid email.'});
  }
}
