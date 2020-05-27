import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from 'primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SpeakerService} from '../../../shared/speaker-service/speaker.service';
import {Speaker} from '../../../model/speaker';
import {MatSort, MatTableDataSource} from '@angular/material';
import {AgendaSessionSpeaker} from '../../../model/agenda-session-speaker';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-speaker-edit',
  templateUrl: './speaker-edit.component.html',
  styleUrls: ['./speaker-edit.component.css']
})
export class SpeakerEditComponent implements OnInit {
  sourceSpeakers;
  displaySpeaker = false;
  msgs: Message[] = [];
  speakerForm: FormGroup;
  displaySpeakerSearch = false;
  selectedSpeakers: Speaker[] = [];
  targetSpeakers: Speaker[] = [];
  displayedColumns: string[] = ['icon', 'firstName', 'lastName', 'faculty', 'organization', 'email', 'remove-icon'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Output() speakerSelectedForSave = new EventEmitter<AgendaSessionSpeaker[]>();
  @Output() speakerSelectedForDelete = new EventEmitter<AgendaSessionSpeaker[]>();
  sessionSpeakersForSave: AgendaSessionSpeaker[] = [];
  sessionSpeakersForDelete: AgendaSessionSpeaker[] = [];

  constructor(private speakerService: SpeakerService, private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
    this.cleanForm();
    this.speakerService.speakerSelected
      .subscribe(
        (selectedSpeakers: Speaker[]) => {
          this.targetSpeakers = selectedSpeakers;
        }
      );
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

  getTracksForSelect() {
    this.speakerService.refreshSourceSpeakers.emit();
    // this.sessionSpeakersForSave = [];
    this.displaySpeakerSearch = true;
  }

  atLeastOneTrack() {
    return this.targetSpeakers.length > 0;
  }

  existInDelete(speaker: Speaker) {
    for (let i = 0; i < this.sessionSpeakersForDelete.length; i++) {
      if (speaker.speakerID === this.sessionSpeakersForDelete[i].speakerID) {
        this.sessionSpeakersForDelete.splice(i, 1);
      }
    }
  }

  addNewSpeakers() {
    for (const s of this.targetSpeakers) {
      this.existInDelete(s);
      this.selectedSpeakers.push(s);
    }
    this.emitSessionSpeakersForSave();
    this.speakerService.refreshSpeakerPanel.emit();
    this.sourceSpeakers = new MatTableDataSource(this.selectedSpeakers);
    this.sourceSpeakers.sort = this.sort;
    this.displaySpeakerSearch = false;
  }

  deleteSessionSpeaker(speaker: Speaker) {
    for (let i = 0; i < this.selectedSpeakers.length; i++) {
      if (this.selectedSpeakers[i].speakerID === speaker.speakerID) {
        this.selectedSpeakers.splice(i, 1);
        this.sourceSpeakers = new MatTableDataSource(this.selectedSpeakers);
        this.sourceSpeakers.sort = this.sort;
        this.sessionSpeakersForDelete.push({
          sessionID: +this.route.snapshot.params.id,
          agendaID: +this.route.snapshot.params.agenda,
          speakerID: speaker.speakerID,
          agendaSession: null,
          speaker: null
        });
      }
    }
    this.speakerSelectedForDelete.emit(this.sessionSpeakersForDelete);
  }

  onSpeakerEmitter(speakers: Speaker[]) {
    this.selectedSpeakers = speakers;
    this.sourceSpeakers = new MatTableDataSource(this.selectedSpeakers);
    this.sourceSpeakers.sort = this.sort;
  }

  emitSessionSpeakersForSave() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.targetSpeakers.length; i++) {
      this.sessionSpeakersForSave.push({
        sessionID: +this.route.snapshot.params.id,
        agendaID: +this.route.snapshot.params.agenda,
        speakerID: this.targetSpeakers[i].speakerID,
        agendaSession: null,
        speaker: null
      });
    }
    this.speakerSelectedForSave.emit(this.sessionSpeakersForSave);
  }
}
