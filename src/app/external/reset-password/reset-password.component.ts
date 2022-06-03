import { AppRoutes } from '../../models/app-routes';
import { HttpService } from '../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from 'src/app/_helpers/must-match.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  hide = true;
  hide1 = true;
  isLoading = false;
  chnagePasswordForm : FormGroup;
  AppRoutes = AppRoutes;
  submitted = false;
  mobileNo:string;
  constructor(private formBuilder: FormBuilder, private _auth: AuthService, private _router: Router, private http: HttpService) { }

  ngOnInit(): void {
    // this.mobileNo = localStorage.getItem("mobile");
    this.mobileNo = this.http.loadMobileNo();
    if(!this.mobileNo) {
      this._router.navigate([this.AppRoutes.ROOT, this.AppRoutes.LOGIN]);
    }
    this.chnagePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }
    ,{
      validator: MustMatch('password', 'confirmPassword')
    });

  }

  get f() { return this.chnagePasswordForm.controls; }
  
  loginUserData = {}

  
  onSubmit() {
    this.submitted = true;
    console.log('register btn working')

    // stop here if form is invalid
    if (this.chnagePasswordForm.invalid) {
        return;
    }
    this.isLoading = true;
    // this.loginUser();
    this.http.patientChangePassword({mobile: this.mobileNo, password: this.f.password.value}).subscribe(res=>{
      this.http.showToaster(`Your password changed successfully`);
      this.isLoading = false;
      this.http.storeMobileNo(null);
      this._router.navigate(['/', AppRoutes.LOGIN]);
    }, err=>{
      console.log(err);
      this.isLoading = false;
      // this.http.handleError(err.error?.message);
    })    
  }

  
  // loginUser () {
  //   this._auth.loginUser(this.chnagePasswordForm.value)
  //   .subscribe(
  //     res => {
  //       localStorage.setItem('accessToken', res.data.accessToken)
  //       this._router.navigate(['/']);
  //     },
  //     err => console.log(err)
  //   ) 
  // }
}
