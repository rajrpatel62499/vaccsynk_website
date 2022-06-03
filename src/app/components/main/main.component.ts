import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { SECTION_IDS } from 'src/app/constants/ids';
import {trigger, style, animate, transition} from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { ReCaptcha2Component } from 'ngx-captcha';
import { REGEXP } from 'src/app/services/regexp';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(800, style({opacity: 1}))
      ]) 
    ])
  ]
})
export class MainComponent implements OnInit {

  viewMode = 'map';
  vieModes: string[] = ['list', 'list1', 'list12', 'map'];
  registerForm: FormGroup;
  submitted = false;
  isLoading=false;
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  @ViewChild('captchaElem',{static : true}) captchaElem: ReCaptcha2Component;
  @ViewChild('langInput',{static : true}) langInput: ElementRef;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';

  public sids = SECTION_IDS;
  constructor(private _auth: AuthService, private formBuilder: FormBuilder, private http: HttpService,private _regexp: REGEXP,) {  

    // --------contact-form-validation------------//
    this.registerForm = this.formBuilder.group({
      name: ['',[Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR), Validators.maxLength(50)]],
      message: [''],
      email: ['',[Validators.required,Validators.pattern(this._regexp.EMAIL_REGEXP)]],
      recaptcha: ['', Validators.required],
  },);


  }

  ngOnInit(): void {

    let count = 0;
    setInterval(() => {
      if(count==this.vieModes.length){
        count=0;
      }
      this.viewMode = this.vieModes[count];      
      count++;
    }, 5000)

    
  }

  

  get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        // this.isLoading = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.isLoading = true;
        const { name, email, message} = this.registerForm.value;
        this.http.contactUs({
          name,email, message
        }).subscribe(res=>{ 
          this.http.showToaster(`Email Sent Successfully !  `)
          // localStorage.setItem("mobile", this.f.mobile.value);
          this.isLoading = false;
          this.submitted = false;
          this.registerForm.reset();
          this.captchaElem.resetCaptcha();
          this.registerForm.reset();
        } ,err=>{
          this.isLoading = false;
          this.submitted = false;
          // this.http.handleError(err.error.message)
          this.captchaElem.resetCaptcha();
          console.log(err);
        })
        // display form values on success
        // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
    }
     
  handleSuccess(data) {
    console.log(data);
  }

}
