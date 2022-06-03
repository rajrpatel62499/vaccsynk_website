import { finalize } from 'rxjs/operators';
import { AppRoutes } from './../../models/app-routes';
import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { REGEXP } from 'src/app/services/regexp';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit {
  hide = true;
  hide1 = true;
  terms: FormControl = new FormControl(true, Validators.required);
  registerForm: FormGroup;
  submitted = false;
  isLoading = false;
  AppRoutes = AppRoutes;
  constructor(
    private formBuilder: FormBuilder,
    private _auth: AuthService,
    private _router: Router,
    private http: HttpService,
    private _regexp: REGEXP
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(this._regexp.EMAIL_REGEXP),
          ],
        ],
        mobile: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {    
    if (this.terms.value == false) {
      this.http.handleError('Please check terms and conditions.');
      return;
    }
    this.submitted = true;
    console.log('register btn working');

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      // this.http.handleError("Please check all fields");
      return;
    }
    let payload = Object.assign({}, this.registerForm.value);
    payload.confirmPassword ? delete payload.confirmPassword : '';
    this.registerUser(payload);
  }

  registerUser(payload) {
    this.isLoading = true;

    this.http
      .requestOtpForRegister({ mobile: this.f.mobile.value })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        this.http.showToaster(
          `Otp sent successfully to ${this.f.mobile.value}`
        );
        this.http.updateRegisterUser(this.registerForm.value);
        this._router.navigate(['/', AppRoutes.OTP_VERIFY]);
      });
    // this._auth.registerUser(payload)
    // .subscribe(
    //   res => {
    //     localStorage.setItem('accessToken', res.data.accessToken);
    //     this._router.navigate([ AppRoutes.ROOT, AppRoutes.APPOINTMENT]);
    //     this.isLoading = false;
    //   },
    //   err =>{
    //     console.log(err);
    //     this.isLoading = false;
    //     // this.http.handleError(err.error?.message);
    //   }
    // )
  }

  lettersOnly(event) {
    var charCode = event.keyCode;

    if (
      (charCode > 64 && charCode < 91) ||
      (charCode > 96 && charCode < 123) ||
      charCode == 8
    )
      return true;
    else return false;
  }
}
