import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Track} from '../../model/track';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  refreshTrackPanel = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  getTracks() {
    return this.httpClient.get<Track[]>('http://localhost:8080/track/all');
  }

  saveTrack(track: Track) {
    return this.httpClient.post('http://localhost:8080/track/save', track);
  }
}
