import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyEvent} from '../../model/my-event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<MyEvent[]>('http://localhost:8080/event/all');
  }

  findById(id) {
    return this.httpClient.get<MyEvent>('http://localhost:8080/event/get/' + id);
  }

  saveEvent(event) {
    return this.httpClient.post('http://localhost:8080/event/save', event);
  }

  findAllBySpeaker(speakerID) {
    return this.httpClient.get<MyEvent[]>('http://localhost:8080/event/allBySpeaker/' + speakerID);
  }

}
