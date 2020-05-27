import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from '../../../model/track';
import {Message} from 'primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TrackService} from '../../../shared/track-service/track.service';
import {AgendaSessionTrack} from '../../../model/agenda-session-track';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-track-edit',
  templateUrl: './track-edit.component.html',
  styleUrls: ['./track-edit.component.css']
})
export class TrackEditComponent implements OnInit {
  @Output() trackSelectedForSave = new EventEmitter<AgendaSessionTrack[]>();
  @Output() trackSelectedForDelete = new EventEmitter<AgendaSessionTrack[]>();
  trackName: string;
  trackDescription: string;
  displayTrack = false;
  tracks: Track[] = [];
  selectedTracks: Track[] = [];
  msgs: Message[] = [];
  trackForm: FormGroup;
  forDelete: AgendaSessionTrack[] = [];
  sessionID: number;
  agendaID: number;
  displayTrackSearch = false;
  forSave: Track[] = [];
  sessionTracksForSave: AgendaSessionTrack[] = [];

  constructor(private trackService: TrackService, private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit() {
    this.agendaID = +this.route.snapshot.params.agenda;
    this.sessionID = +this.route.snapshot.params.id;
    this.getSessionTracks(this.agendaID, this.sessionID);
    this.listenRefreshPanel();
    this.cleanForm();
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

/*  onSelectTrack() {
    this.trackSelected.emit(this.selectedTracks);
  }*/

  deleteSessionTrack(track: Track) {
    for (let i = 0; i < this.selectedTracks.length; i++) {
      if (this.selectedTracks[i].trackID === track.trackID) {
        this.selectedTracks.splice(i, 1);
        this.forDelete.push({
          sessionID: this.sessionID,
          agendaID: this.agendaID,
          trackID: track.trackID,
          agendaSession: null,
          track: null
        });
      }
    }
    this.trackSelectedForDelete.emit(this.forDelete);
  }

  getTracks() {
    this.trackService.getTracks().subscribe(
      (data) => {
        this.tracks = data;
        for (const s of this.selectedTracks) {
          for (let i = 0; i < this.tracks.length; i++) {
            if (s.trackID === this.tracks[i].trackID) {
              this.tracks.splice(i, 1);
            }
          }
        }
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
  }

  getTracksForSelect() {
    this.getTracks();
    this.forSave = [];
    this.displayTrackSearch = true;
  }

  atLeastOneTrack() {
    return this.forSave.length > 0;
  }

  emitSessionTracksForSave() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.forSave.length; i++) {
      this.sessionTracksForSave.push({
        sessionID: this.sessionID,
        agendaID: this.agendaID,
        trackID: this.forSave[i].trackID,
        agendaSession: null,
        track: null
      });
    }
    this.trackSelectedForSave.emit(this.sessionTracksForSave);
  }

  existInDelete(track: Track) {
    for (let i = 0; i < this.forDelete.length; i++) {
      if (track.trackID === this.forDelete[i].trackID) {
        this.forDelete.splice(i, 1);
      }
    }
  }

  addNewTracks() {
    for (const t of this.forSave) {
      this.existInDelete(t);
      this.selectedTracks.push(t);
    }
    this.emitSessionTracksForSave();
    this.displayTrackSearch = false;
  }

  getSessionTracks(agendaID: number, sessionID: number) {
    this.trackService.findAllBySession(agendaID, sessionID)
      .subscribe(
        (tracks) => {
          console.log('trakovi', tracks);
          for (const t of tracks) {
            this.selectedTracks.push(t.track);
          }
        }
      );
  }
}
