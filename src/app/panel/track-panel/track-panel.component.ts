import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Track} from '../../model/track';
import {TrackService} from '../../shared/track-service/track.service';
import {Message} from 'primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-track-panel',
  templateUrl: './track-panel.component.html',
  styleUrls: ['./track-panel.component.css']
})
export class TrackPanelComponent implements OnInit {
  @Output() trackSelected = new EventEmitter<Track[]>();
  trackName: string;
  trackDescription: string;
  displayTrack = false;
  tracks: Track[] = [];
  selectedTracks: Track[] = [];
  msgs: Message[] = [];
  trackForm: FormGroup;
  nameRequired: Message[] = [];
  descriptionRequired: Message[] = [];

  constructor(private trackService: TrackService, private fb: FormBuilder) {}

  ngOnInit() {
    this.getTracks();
    this.listenRefreshPanel();
    this.cleanForm();
    this.setMessages();
  }

  getTracks() {
    this.trackService.getTracks().subscribe(
      (data) => {
        this.tracks = data;
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
  }

  listenRefreshPanel() {
    this.trackService.refreshTrackPanel
      .subscribe(
        () => {
          this.refreshPanel();
        }
      );
  }

  refreshPanel() {
    this.selectedTracks = [];
    this.msgs = [];
  }

  cleanForm() {
    this.trackForm = this.fb.group({
      trackName: new FormControl('', Validators.required),
      trackDescription: new FormControl('', Validators.required)
    });
  }

  showSuccessMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Success Message', detail: 'Sistem je zapamtio tip sesije.'});
  }

  showErrorMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Sistem nije zapamtio tip sesije.'});
  }

  saveTrack() {
    const track: Track = {
      trackID: this.tracks.length + 1,
      name: this.trackForm.get('trackName').value,
      description: this.trackForm.get('trackDescription').value
    };
    this.trackService.saveTrack(track).subscribe(
      (data) => {
        console.log('Data:', data);
        this.getTracks();
        this.displayTrack = false;
        this.cleanForm();
        this.showSuccessMessage();
      },
      (error) => {
        console.log('GRESKAAA!', error);
        this.showErrorMessage();
      }
    );
  }

  showTrackModal() {
    this.displayTrack = true;
  }

  onSelectTrack() {
    this.trackSelected.emit(this.selectedTracks);
  }

  setMessages() {
    this.nameRequired.push({severity: 'error', summary: 'Name is required.'});
    this.descriptionRequired.push({severity: 'error', summary: 'Description is required.'});
  }
}
