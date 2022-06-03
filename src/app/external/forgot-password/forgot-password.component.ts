import { AppRoutes } from './../../models/app-routes';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from './../../services/http.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm : FormGroup;
  submitted = false;
  isLoading = false;
  AppRoutes = AppRoutes;
  get f() { return this.forgotPasswordForm.controls; }

  constructor(private formBuilder: FormBuilder,
     public router: Router,
     private http: HttpService,
     private toastrService: ToastrService) {

    }
    
    ngOnInit(): void {
      this.forgotPasswordForm = this.formBuilder.group({
        mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      },);
    }

  
  onSubmit() {
    this.submitted = true;
    console.log('register btn working')

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      // this.http.handleError("Please check all fields");
        return;
    }

    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.forgotPasswordForm.value, null, 4));
    this.isLoading = true;
    this.http.requestOtpForPatient(this.forgotPasswordForm.value).subscribe(res=>{
      this.http.showToaster(`OTP sent successfully to ${this.f.mobile.value}`);
      // localStorage.setItem("mobile", this.f.mobile.value);
      this.isLoading = false;
      this.http.storeMobileNo(this.f.mobile.value);
      
      this.router.navigate(['/', AppRoutes.OTP_VERIFY]);
    },
    err=>{
      this.isLoading = false;
      // this.http.handleError(err.error.message)
      console.log(err);
    })
}

}
