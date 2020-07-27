import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserSession} from '../../../model/user-session';
import {User} from '../../../model/user';
import {SessionStorageService} from 'ngx-webstorage';
import {UserService} from '../../../shared/user-service/user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.css']
})
export class FavoriteButtonComponent implements OnInit {

  @Input() selected: boolean;
  @Output() selectedChange = new EventEmitter<boolean>();
  @Output() msg = new EventEmitter<string>();
  @Input() agendaID: number;
  @Input() sessionID: number;

  constructor(private sessionStorage: SessionStorageService,
              private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

  public toggleSelected() {
    const user: User = this.sessionStorage.retrieve('currentUser');
    const eID = +this.route.snapshot.params.eventID;
    const userSession: UserSession = {
      agendaID: this.agendaID,
      sessionID: this.sessionID,
      userID: user.userID,
      eventID: eID,
      agendaSession: null,
      presence: null
    };
    !this.selected ? this.saveUserSession(userSession) : this.deleteUserSession(userSession, user);
    this.selected = !this.selected;
  }

  saveUserSession(userSession: UserSession) {
    this.userService.saveUserSession(userSession)
      .subscribe(
        (data) => {
          this.msg.emit('Uspesno ste se prijavili na sekciju. Poslacemo Vam mejl kao podsetnik dan pre pocetka date sekcije');
        },
        error => {
          console.log('GRESKAAA', error);
        }
      );
  }

  deleteUserSession(userSession: UserSession, user: User) {
    this.userService.deleteUserSession(userSession.agendaID, userSession.sessionID, user.userID, userSession.eventID)
      .subscribe(
        (data) => {
          this.msg.emit('Uklonjeno iz liste zeljenih sekcija.');
        },
        error => {
          console.log('GRESKAAA', error);
        }
      );
  }
}
