import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Track} from '../../../model/track';
import {Message} from 'primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TrackService} from '../../../shared/track-service/track.service';
import {AgendaSessionTrack} from '../../../model/agenda-session-track';
import {ActivatedRoute} from '@angular/router';
import {AgendaSession} from '../../../model/agenda-session';

@Component({
  selector: 'app-track-edit',
  templateUrl: './track-edit.component.html',
  styleUrls: ['./track-edit.component.css']
})
export class TrackEditComponent implements OnInit, OnChanges {
  displayTrack = false;
  tracks: Track[] = [];
  selectedTracks: Track[] = [];
  msgs: Message[] = [];
  trackForm: FormGroup;
  sessionID: number;
  agendaID: number;
  trackID: number;
  displayTrackSearch = false;
  targetTracks: Track[] = [];
  @Output() changeTracks = new EventEmitter<AgendaSessionTrack[]>();
  @Input() sessionTracks: AgendaSessionTrack[];

  constructor(private trackService: TrackService, private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit() {
    this.agendaID = +this.route.snapshot.params.agenda;
    this.sessionID = +this.route.snapshot.params.id;
    this.listenRefreshPanel();
    this.cleanForm();
    this.getTracks();
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
      trackID: this.trackID,
      name: this.trackForm.get('trackName').value,
      description: this.trackForm.get('trackDescription').value
    };
    this.trackService.saveTrack(track).subscribe(
      (data) => {
        console.log('Data:', data);
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

  deleteSessionTrack(track: Track) {
    this.selectedTracks = this.selectedTracks.filter(item => item !== track);
    this.sessionTracks = this.sessionTracks.filter(item => item.track !== track);
    this.changeTracks.emit(this.sessionTracks);
  }

  getTracks() {
    this.trackService.getTracks().subscribe(
      (data) => {
        this.tracks = data;
        this.trackID = this.tracks.length + 1;
        this.selectedTracks.forEach(st => {
          this.tracks.forEach(track => {
            if (st.trackID === track.trackID) {
              this.tracks = this.tracks.filter(item => item !== track);
            }
          });
        });
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
  }

  getTracksForSelect() {
    this.getTracks();
    this.targetTracks = [];
    this.displayTrackSearch = true;
  }

  atLeastOneTrack() {
    return this.targetTracks.length > 0;
  }

  emitSessionTracksForSave() {
    this.targetTracks.forEach(track => {
      this.sessionTracks.push({
        sessionID: this.sessionID,
        agendaID: this.agendaID,
        trackID: track.trackID,
        agendaSession: null,
        track
      });
    });
    this.changeTracks.emit(this.sessionTracks);
  }

  addNewTracks() {
    this.targetTracks.forEach(track => this.selectedTracks.push(track));
    this.emitSessionTracksForSave();
    this.displayTrackSearch = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sessionTracks) {
      this.selectedTracks = [];
      this.sessionTracks.forEach(t => this.selectedTracks.push(t.track));
    }
  }
}
