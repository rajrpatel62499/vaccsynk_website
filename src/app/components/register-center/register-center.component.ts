import { HttpService } from '../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { VerifyEmailIdComponent } from 'src/app/modals/verify-email-id/verify-email-id.component';
import { PHARMACY_FORM } from 'src/app/constants/forms';
import { REGEXP } from 'src/app/services/regexp';
@Component({
  selector: 'app-register',
  templateUrl: './register-center.component.html',
  styleUrls: ['./register-center.component.scss']
})
export class RegisterCenterComponent implements OnInit {

  registerForm: FormGroup = this.formBuilder.group({
    pharmacyName : ['', [Validators.required,Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    mobile : ['',[Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    faxNo: ['',Validators.required],
    email: ['',[Validators.required, Validators.pattern(this._regexp.EMAIL_REGEXP)]],
    address : ['',Validators.required],
    state : ['',[Validators.required,Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    city:['',[Validators.required,Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]] ,
    zip: ['',[Validators.required]],
    NCPDPNo: [''],
    NPINo: [''],
    pharmacistName: ['',[Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    pharmacistEmail: ['',[Validators.email,Validators.pattern(this._regexp.EMAIL_REGEXP)]],
    pharmacistNpiNumber: ['' ]
  });

  public submitted = false;
  public isLoading = false;
  public showMsg = false;
  get f() : {
    [key: string]: AbstractControl;
  }{ return this.registerForm.controls; }

  constructor(public dialog: MatDialog,public http: HttpService,
    private _regexp: REGEXP,
    private formBuilder: FormBuilder) {}

  
  ngOnInit(): void {
  }

  onSubmit(): void {
    
    this.submitted = true;
    if(this.registerForm.valid) {
      this.requestOtp();
    }
   
  }

  handleAddressChange(address) {
    this.registerForm.get('address').setValue(address.formatted_address);
  }

 

  private requestOtp() {
    let payload={
      email: this.f.email.value
    };
    this.isLoading = true;
    this.http.requestOtpForVacCenter(payload).subscribe(res => this.onRequestOtpSuccessful(res), err=> this.onRequestOtpFailed(err));
  }

  private onRequestOtpSuccessful(res) {
    console.log(res);
    this.isLoading = false;
    // console.log(`OTP sent successfully on ${this.f.email.value}`);
    this.http.showToaster(`OTP sent successfully on ${this.f.email.value}`);
    this.openVerifyEmailIdDialog();
  }


  showDiv = {
    previous : false,
    current : false,
    next : false
  }
  private onRequestOtpFailed(err) {
    console.log(err);
    this.isLoading = false;
    if(err.error.responseType == 'USER_EXISTS') {
      console.log(`${this.f.email.value} already exists`);
    }
  }


  openVerifyEmailIdDialog() {
    let dialogRef = this.dialog.open(VerifyEmailIdComponent, {
      width: '583px',
      data: this.registerForm.value
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result) {
        this.showMsg = true;
        this.registerForm.reset();
      }
      this.submitted = false;
    });

    
  }
}
