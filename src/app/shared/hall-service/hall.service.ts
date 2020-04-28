import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Hall} from '../../model/hall';

@Injectable({
  providedIn: 'root'
})
export class HallService {
  refreshHallPanel = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  saveHall(hall: Hall) {
    return this.httpClient.post('http://localhost:8080/hall/save', hall);
  }

  getHalls() {
    return this.httpClient.get<Hall[]>('http://localhost:8080/hall/all');
  }
}
