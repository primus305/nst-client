import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng';
import {UserService} from '../shared/user-service/user.service';
import {User} from '../model/user';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  itemsAdmin: MenuItem[];
  itemsAttendee: MenuItem[];
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.curUser
      .subscribe(
        (u) => {
          if (this.isAdmin()) {
            this.setAdminItems(u.firstName, u.lastName);
          } else {
            this.setAttendeeItems(u.firstName, u.lastName);
          }
        }
      );
  }

  isLoggedIn() {
    return this.userService.loggedIn;
  }

  logout() {
    this.userService.logout();
  }

  isAdmin() {
    return this.userService.admin;
  }

  setAdminItems(firstName, lastName) {
    this.itemsAdmin = [
      {
        label: 'Events',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus',
            routerLink: '/event-create'
          },
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            routerLink: '/events'
          }
        ]
      },
      {separator: true},
      {
        label: firstName + ' ' + lastName, icon: 'pi pi-user'
      }
    ];
  }

  setAttendeeItems(firstName, lastName) {
    this.itemsAttendee = [
      {
        label: 'My Events',
        icon: 'pi pi-fw pi-calendar',
        routerLink: '/events'
      },
      {
        label: 'My Sessions',
        icon: 'pi pi-fw pi-clock',
        routerLink: '/my-sessions'
      },
      {separator: true},
      {
        label: firstName + ' ' + lastName, icon: 'pi pi-user'
      }
    ];
  }
}
