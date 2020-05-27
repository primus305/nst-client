import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../../model/user';
import {Presence} from '../../model/presence';
import {map} from 'rxjs/operators';
import {SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {UserSession} from '../../model/user-session';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  curUser = new EventEmitter<User>();
  admin = false;
  loggedIn = false;
  attendee = false;
  constructor(private httpClient: HttpClient, private sessionStorage: SessionStorageService,
              private router: Router) { }

  saveUser(user: User) {
    return this.httpClient.post<User>('http://localhost:8080/user/save', user);
  }

  getUsers() {
    return this.httpClient.get<User[]>('http://localhost:8080/user/all');
  }

  savePresences(presences) {
    return this.httpClient.post('http://localhost:8080/presence/saveAll', presences);
  }

  saveUserSession(userSession) {
    return this.httpClient.post('http://localhost:8080/userSession/save', userSession);
  }

  deleteUserSession(agendaID, sessionID, userID, eventID) {
    return this.httpClient.delete('http://localhost:8080/userSession/delete/' + agendaID + '-' + sessionID + '-' + userID + '-' + eventID);
  }

  getUserSession(agendaID, sessionID, userID, eventID) {
    return this.httpClient.get<UserSession>('http://localhost:8080/userSession/get/' + agendaID + '-' +
      sessionID + '-' + userID + '-' + eventID);
  }

  findAllUsersBySession(agendaID, sessionID) {
    return this.httpClient.get<UserSession[]>('http://localhost:8080/userSession/all/' + agendaID + '-' + sessionID);
  }

  findSessionsByUser(userID) {
    return this.httpClient.get<UserSession[]>('http://localhost:8080/userSession/mySessions/' + userID);
  }

  findByEvent(eventID) {
    return this.httpClient.get<Presence[]>('http://localhost:8080/presence/allByEvent/' + eventID);
  }

  findByUser(userID) {
    return this.httpClient.get<Presence[]>('http://localhost:8080/presence/allByUser/' + userID);
  }

  login(username, password) {
    const base64Credential: string = btoa(username + ':' + password);
    const headers = new HttpHeaders({Authorization: 'Basic ' + base64Credential});
    return this.httpClient.get<any>('http://localhost:8080/user/login', {headers})
      .pipe(
        map((resp) => {
          const user = resp.principal;
          if (user) {
            user.authdata = base64Credential;
            console.log('Provera:', user);
            this.sessionStorage.store('currentUser', user);
            this.sessionStorage.store('loginTime', new Date().toString());
            /*this.loggedIn.next(true);
            this.admin.next(user.role === 'ADMINISTRATOR');*/
            this.attendee = (user.role === 'ATTENDEE');
            this.loggedIn = true;
            this.admin = (user.role === 'ADMINISTRATOR');
            this.curUser.emit(user);
          }
        })
      );
  }

  public logout() {
    this.sessionStorage.clear('currentUser');
    this.sessionStorage.clear('loginTime');
    this.loggedIn = false;
    this.admin = false;
    this.router.navigate(['/']);
  }

  public get currentUserValue(): User {
    return this.sessionStorage.retrieve('currentUser');
  }
}
