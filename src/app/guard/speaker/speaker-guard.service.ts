import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from '../../shared/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class SpeakerGuardService implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userService.admin || (!this.userService.attendee && !this.userService.admin)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
