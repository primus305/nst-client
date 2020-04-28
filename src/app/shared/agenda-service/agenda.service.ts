import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Agenda} from '../../model/agenda';
import {AgendaSession} from '../../model/agenda-session';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  refreshSessionPanel = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  saveAgenda(agenda) {
    return this.httpClient.post('http://localhost:8080/agenda/save', agenda);
  }

  saveAgendaSessions(sessions) {
    return this.httpClient.post('http://localhost:8080/agendaSession/saveAll', sessions);
  }

  saveAgendaSessionTracks(sessionTracks) {
    return this.httpClient.post('http://localhost:8080/agendaSessionTrack/saveAll', sessionTracks);
  }

  saveAgendaSessionSpeakers(sessionSpeakers) {
    return this.httpClient.post('http://localhost:8080/agendaSessionSpeaker/saveAll', sessionSpeakers);
  }

  getNextID() {
    return this.httpClient.get<number>('http://localhost:8080/agenda/id');
  }

  getAll() {
    return this.httpClient.get<Agenda[]>('http://localhost:8080/agenda/all');
  }

  getAllSessions(agendaID) {
    return this.httpClient.get<AgendaSession[]>('http://localhost:8080/agendaSession/all/' + agendaID);
  }
}
