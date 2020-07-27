import {EventEmitter, Injectable} from '@angular/core';
import {Speaker} from '../../model/speaker';
import {HttpClient} from '@angular/common/http';
import {AgendaSessionSpeaker} from '../../model/agenda-session-speaker';
import {AgendaSession} from '../../model/agenda-session';

@Injectable({
  providedIn: 'root'
})
export class SpeakerService {
  speakerAdded = new EventEmitter<Speaker>();
  speakerSelected = new EventEmitter<Speaker[]>();
  refreshSpeakerPanel = new EventEmitter();
  refreshSourceSpeakers = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  saveSpeaker(speaker: Speaker) {
    return this.httpClient.post<Speaker>('http://localhost:8080/speaker/save', speaker);
  }

  getSpeakers() {
    return this.httpClient.get<Speaker[]>('http://localhost:8080/speaker/all');
  }

  findAllBySpeaker(speakerID) {
    return this.httpClient.get<AgendaSessionSpeaker[]>('http://localhost:8080/agendaSessionSpeaker/allBySpeaker/' + speakerID);
  }

  findById(agendaID, sessionID, speakerID) {
    return this.httpClient.get<AgendaSessionSpeaker>('http://localhost:8080/agendaSessionSpeaker/get/' + agendaID + '-' +
      sessionID + '-' + speakerID);
  }

  onSpeakerAdded(speaker: Speaker) {
    this.speakerAdded.emit(speaker);
  }

  onSpeakerSelected(selectedSpeakers: Speaker[]) {
    this.speakerSelected.emit(selectedSpeakers);
  }

  getNonSelectedSpeakers(session: AgendaSession) {
    return this.httpClient.get<Speaker[]>('http://localhost:8080/speaker/notOnSession/' + session.sessionID + '-' + session.agendaID);
  }
}
