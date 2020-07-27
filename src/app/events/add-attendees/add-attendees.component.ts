import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../model/user';
import {UserService} from '../../shared/user-service/user.service';
import {Presence} from '../../model/presence';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-attendees',
  templateUrl: './add-attendees.component.html',
  styleUrls: ['./add-attendees.component.css']
})
export class AddAttendeesComponent implements OnInit {
  displayUser = false;
  msgs: Message[] = [];
  userForm: FormGroup;
  sourceUsers: User[];
  targetUsers: User[] = [];
  presences: Presence[] = [];
  eventID: number;
  eventAttendees: Presence[] = [];
  responsiveOptions;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit() {
    this.eventID = +this.route.snapshot.params.id;
    this.getEventsUsers(this.eventID);
    this.getUsers();
    this.cleanForm();
  }

  cleanForm() {
    this.userForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      faculty: new FormControl('', Validators.required),
      organization: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required)
    });
  }

  showSuccessMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Success Message', detail: 'Sistem je zapamtio polaznika.'});
  }

  showErrorMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Sistem nije zapamtio polaznika.'});
  }

  showSuccessMessage2() {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Success Message', detail: 'Polaznici su uspesno dodati na dogadjaj.'});
  }

  showErrorMessage2() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Sistem nije dodao polaznike na dogadjaj.'});
  }

  showUserModal() {
    this.displayUser = true;
  }
  saveUser() {
    const user: User = {
      userID: null,
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
      faculty: this.userForm.get('faculty').value,
      organization: this.userForm.get('organization').value,
      username: this.userForm.get('username').value,
      password: this.userForm.get('password').value,
      role: this.userForm.get('role').value,
      email: this.userForm.get('email').value,
      authdata: null
    };
    this.userService.saveUser(user).subscribe(
      (data) => {
        console.log('Data:', data.userID);
        this.displayUser = false;
        this.sourceUsers.push(data);
        this.cleanForm();
        this.showSuccessMessage();
      },
      (error) => {
        console.log('GRESKAAA!', error);
        this.showErrorMessage();
      }
    );
  }

  getUsers() {
    this.userService.getNotInvitedUsers(this.eventID).subscribe(
      (data) => {
        this.sourceUsers = data;
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
  }

  getEventsUsers(id) {
    this.userService.findByEvent(id).subscribe(
      (data) => {
        this.eventAttendees = data;
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
  }

  savePresences() {
    this.targetUsers.forEach(user => {
      this.presences.push({
        userID: user.userID,
        eventID: this.eventID,
        user: null,
        event: null
      });
    });
    this.userService.savePresences(this.presences).subscribe(
      (data) => {
        this.presences.forEach(presence => {
          this.targetUsers.forEach(user => {
            if (presence.userID === user.userID) {
              presence.user = user;
              this.eventAttendees.push(presence);
              this.targetUsers = this.targetUsers.filter(item => item !== user);
            }
          });
        });
        this.showSuccessMessage2();
      },
      (error) => {
        console.log('GRESKAAA!', error);
        this.showErrorMessage2();
      }
    );
  }

  presencesValid() {
    return this.targetUsers.length > 0;
  }
}
