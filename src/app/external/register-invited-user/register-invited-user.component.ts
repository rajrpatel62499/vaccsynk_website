import { finalize } from 'rxjs/operators';
import { AppRoutes } from './../../models/app-routes';
import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';

import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { REGEXP } from 'src/app/services/regexp';

@Component({
  selector: 'app-register-invited-user',
  templateUrl: './register-invited-user.component.html',
  styleUrls: ['./register-invited-user.component.scss']
})
export class RegisterInvitedUserComponent implements OnInit  {
  hide = true;
  hide1 = true;
  registerForm : FormGroup;
  submitted = false;
  isLoading = false;
  AppRoutes = AppRoutes;

  
  facilityId: string;
  terms: FormControl = new FormControl(true, Validators.required);
  constructor(private formBuilder: FormBuilder, private _auth: AuthService,
    private _router: Router,private http: HttpService,     public activatedRoute: ActivatedRoute, private _regexp: REGEXP,) { 

      this.facilityId = this.activatedRoute.snapshot.params.facilityId;

    }

  ngOnInit(): void {
      this.registerForm = this.formBuilder.group({
        facilityId: [''], 
        name: ['', [Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
        email: ['', [Validators.required, Validators.email,Validators.pattern(this._regexp.EMAIL_REGEXP)]],
        mobile: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        },{
          validator: MustMatch('password', 'confirmPassword')
      });
 
      this.registerForm.patchValue({
        facilityId: this.facilityId
      });
  }
  get f() { return this.registerForm.controls; }
  
  onSubmit() {
    this.submitted = true;
    console.log('register btn working')

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log(this.registerForm.value);
      
      let arr = this.findInvalidControlsRecursive(this.registerForm);
      console.log(arr);
      this.http.handleError("Please check all fields");
        return;
    }
    let payload  = Object.assign({}, this.registerForm.value);
    payload.confirmPassword ? delete payload.confirmPassword : '';
    this.registerUser(payload);
  }


  registerUser(payload) {
    this.isLoading = true;

    this.http.requestOtpForRegister({mobile: this.f.mobile.value}).pipe(finalize(()=>{this.isLoading = false;})).subscribe(res=>{
      this.http.showToaster(`Otp sent successfully to ${this.f.mobile.value}`);
      this.http.updateRegisterUser(this.registerForm.value);
      this._router.navigate(['/', AppRoutes.REGISTER, AppRoutes.INVITE, this.facilityId , AppRoutes.OTP_VERIFY_INVITED_USER]);
    },
   )

  }


  private findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    }
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

}
