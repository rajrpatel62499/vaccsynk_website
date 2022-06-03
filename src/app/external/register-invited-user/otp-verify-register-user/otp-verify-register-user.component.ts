import { finalize } from 'rxjs/operators';
import { AppRoutes } from './../../../models/app-routes';
import { HttpService } from './../../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-otp-verify-register-user',
  templateUrl: './otp-verify-register-user.component.html',
  styleUrls: ['./otp-verify-register-user.component.scss']
})
export class OtpVerifyRegisterUserComponent implements OnInit {

  otp: string;
  AppRoutes = AppRoutes;
  isLoading = false;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  registerdUser: any;
  facilityId: string;

  constructor(private router: Router,  public activatedRoute: ActivatedRoute,private http: HttpService, private _auth: AuthService) {
    // this.mobileNo = localStorage.getItem("mobile");
    this.facilityId = this.activatedRoute.snapshot.params.facilityId;

    this.registerdUser = this.http.getRegistedUser();

    if (!this.registerdUser) {
      this.router.navigate([AppRoutes.ROOT, AppRoutes.REGISTER, AppRoutes.INVITE, this.facilityId]);
    }
  }

  ngOnInit(): void {
  }

  onOtpChange(otp) {
    this.otp = otp;
  }

  verifyCode() {
    this.isLoading = true;
    if (this.registerdUser) {
      this.http.verifyOtpForPatient({ code: this.otp, mobile: this.registerdUser.mobile }).subscribe(res => {
        this.http.showToaster(`OTP verified successfully`);
        this.registerUser();
      },
        err => {
          this.isLoading = false;
          // this.http.handleError(err.error?.message);
        })
    } 
  }


  registerUser() {
    this._auth.registerUser(this.registerdUser).pipe(finalize(() => { this.isLoading = false; })).subscribe(
      res => {
        localStorage.setItem('accessToken', res.data.accessToken);
        this.http.updateRegisterUser(null);
        this.router.navigate([AppRoutes.ROOT, AppRoutes.APPOINTMENT]);
      });
  }

  resendCode() {

    if(this.registerdUser) {
      this.http.requestOtpForRegister({ mobile: this.registerdUser.mobile }).subscribe(res => {
        this.http.showToaster(`OTP resent successfully to ${this.registerdUser.mobile}`);
      })
      
    } 

  }

}
