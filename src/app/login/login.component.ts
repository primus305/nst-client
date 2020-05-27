import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../shared/user-service/user.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Message} from 'primeng';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  msgs: Message[] = [];
  constructor(private fb: FormBuilder, private userService: UserService, private http: HttpClient,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  showErrorMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Nevažeći parametri.'});
  }

  login() {
    this.userService.login(this.loginForm.get('username').value, this.loginForm.get('password').value)
      .subscribe(
        () => {
            this.router.navigate(['/events']);
          },
        error => {
          console.log('Greska', error);
          this.showErrorMessage();
        }
      );
  }
}
