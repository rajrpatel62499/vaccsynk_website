import { AppRoutes } from './../../models/app-routes';
import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from 'src/app/_helpers/must-match.validator';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss']
})
export class LoginUserComponent implements OnInit {
  hide = true;
  hide1 = true;
  isLoading = false;
  loginForm : FormGroup;
  submitted = false;
  AppRoutes = AppRoutes;
  constructor(private formBuilder: FormBuilder, private _auth: AuthService, private _router: Router, private http: HttpService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      mobile: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
  });

  }

  get f() { return this.loginForm.controls; }
  
  loginUserData = {}
  onhideToggle() {
    console.log(this.hide)
  }

  loginUser () {
    this._auth.loginUser(this.loginForm.value)
    .subscribe(
      res => {
        localStorage.setItem('accessToken', res.data.accessToken)
        this._router.navigate( [AppRoutes.ROOT, AppRoutes.APPOINTMENT]);
        this.isLoading = false;
      },
      err => {
        console.log(err)
        // this.http.handleError(err.error?.message);
        this.isLoading = false;
      }
    ) 
  }
  onSubmit() {
    this.submitted = true;

    console.log('register btn working')

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      // this.http.handleError("Please check all fields");
        return;
    }
    this.isLoading = true;

    this.loginUser();
  }

}
