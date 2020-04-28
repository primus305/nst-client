import {EventEmitter, Injectable} from '@angular/core';
import {Speaker} from '../../model/speaker';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpeakerService {
  speakerAdded = new EventEmitter<Speaker>();
  speakerSelected = new EventEmitter<Speaker[]>();
  refreshSpeakerPanel = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  saveSpeaker(speaker: Speaker) {
    return this.httpClient.post<Speaker>('http://localhost:8080/speaker/save', speaker);
  }

  getSpeakers() {
    return this.httpClient.get<Speaker[]>('http://localhost:8080/speaker/all');
  }

  onSpeakerAdded(speaker: Speaker) {
    this.speakerAdded.emit(speaker);
  }

  onSpeakerSelected(selectedSpeakers: Speaker[]) {
    this.speakerSelected.emit(selectedSpeakers);
  }
}
