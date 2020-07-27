import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Message} from 'primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SpeakerService} from '../../../shared/speaker-service/speaker.service';
import {Speaker} from '../../../model/speaker';
import {MatSort, MatTableDataSource} from '@angular/material';
import {AgendaSessionSpeaker} from '../../../model/agenda-session-speaker';
import {ActivatedRoute} from '@angular/router';
import {AgendaSession} from '../../../model/agenda-session';

@Component({
  selector: 'app-speaker-edit',
  templateUrl: './speaker-edit.component.html',
  styleUrls: ['./speaker-edit.component.css']
})
export class SpeakerEditComponent implements OnInit, OnChanges {
  sourceSpeakers;
  displaySpeaker = false;
  msgs: Message[] = [];
  speakerForm: FormGroup;
  displaySpeakerSearch = false;
  selectedSpeakers: Speaker[] = [];
  targetSpeakers: Speaker[] = [];
  displayedColumns: string[] = ['icon', 'firstName', 'lastName', 'faculty', 'organization', 'email', 'remove-icon'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Output() changeSpeakersTable = new EventEmitter<AgendaSessionSpeaker[]>();
  @Input() sessionSpeakers: AgendaSessionSpeaker[];
  @Input() session: AgendaSession;

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
    this.displaySpeakerSearch = true;
  }

  atLeastOneTrack() {
    return this.targetSpeakers.length > 0;
  }

  addNewSpeakers() {
    this.targetSpeakers.forEach(speaker => this.selectedSpeakers.push(speaker));
    this.emitSessionSpeakersForSave();
    this.speakerService.refreshSpeakerPanel.emit();
    this.sourceSpeakers = new MatTableDataSource(this.selectedSpeakers);
    this.sourceSpeakers.sort = this.sort;
    this.displaySpeakerSearch = false;
  }

  deleteSessionSpeaker(speaker: Speaker) {
    this.selectedSpeakers = this.selectedSpeakers.filter(item => item !== speaker);
    this.sessionSpeakers = this.sessionSpeakers.filter(item => item.speakerID !== speaker.speakerID);
    this.changeSpeakersTable.emit(this.sessionSpeakers);
  }

  emitSessionSpeakersForSave() {
    this.targetSpeakers.forEach(speaker => {
      this.sessionSpeakers.push({
        sessionID: +this.route.snapshot.params.id,
        agendaID: +this.route.snapshot.params.agenda,
        speakerID: speaker.speakerID,
        speaker
      });
    });
    this.changeSpeakersTable.emit(this.sessionSpeakers);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sessionSpeakers) {
      this.selectedSpeakers = [];
      this.sessionSpeakers.forEach(s => this.selectedSpeakers.push(s.speaker));
      this.sourceSpeakers = new MatTableDataSource(this.selectedSpeakers);
      this.sourceSpeakers.sort = this.sort;
    }
  }
}
