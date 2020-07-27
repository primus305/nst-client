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

  getNextID() {
    return this.httpClient.get<number>('http://localhost:8080/agenda/id');
  }

  findById(id) {
    return this.httpClient.get<Agenda>('http://localhost:8080/agenda/get/' + id);
  }

  findSessionById(agendaID, sessionID) {
    return this.httpClient.get<AgendaSession>('http://localhost:8080/agendaSession/get/' + agendaID + '-' + sessionID);
  }

  updateSession(agendaSession: AgendaSession) {
    return this.httpClient.put('http://localhost:8080/agendaSession/update', agendaSession);
  }
}
