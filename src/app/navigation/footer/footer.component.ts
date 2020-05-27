import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/user-service/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.userService.loggedIn;
  }
}
