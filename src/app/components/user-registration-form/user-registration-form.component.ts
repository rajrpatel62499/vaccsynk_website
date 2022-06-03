import { DoseTypes } from './../../models/enums';
import { UserProfile } from 'src/app/models/user-profile';
import { AppRoutes } from './../../models/app-routes';
import { HttpService } from 'src/app/services/http.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CovidConcentForm } from 'src/app/models/covid-consent-form';
import { SignaturePad } from 'angular2-signaturepad';
import { CodeStarNotifications } from 'aws-sdk/clients/all';
import { ChangeDetectorRef } from '@angular/core';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormArray } from '@angular/forms';
import { REGEXP } from 'src/app/services/regexp';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  canScheduleAppointmentGroup: any[];
  today = new Date();
  covidConsentForm: FormGroup;

  isGenderMale: boolean = false;

  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker: BsDatepickerDirective;
  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker.hide();
  }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    canvasWidth: 300,
    canvasHeight: 100,
    minWidth: 1.5,
  };
  get f() {
    return this.covidConsentForm.controls;
  }

  constructor(
    private cdref: ChangeDetectorRef,
    private _regexp: REGEXP,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpService,
    private auth: AuthService
  ) {}

  insCardFront: File = null;
  insCardBack: File = null;
  govIssuedId: File = null;
  signature: File = null;
  userProfileData: UserProfile;

  isSignatureUploadProgress: string = '';
  isInsuranceFrontProgress: string = '';
  isInsuranceBackProgress: string = '';
  isPersonalIdProgress: string = '';

  ngOnInit(): void {
    document.getElementById("user-vac-form")?.scrollTo(0,0);
    // let concentForm: CovidConcentForm = JSON.parse(localStorage.getItem("concentForm"));
    this.auth.getUserProfileData().subscribe((res) => {
      this.userProfileData = res;

      let concentForm: FormGroup = this.http.loadCovidForm();
      if (concentForm) {
        // coming from Slots page
        // this.covidConsentForm.patchValue(concentForm);
        this.insCardFront = concentForm.value.insCardFront;
        this.insCardBack = concentForm.value.insCardBack;
        this.govIssuedId = concentForm.value.govIssuedId;
        this.signature = concentForm.value.signature;
        delete concentForm.value.insCardFront;
        delete concentForm.value.insCardBack;
        delete concentForm.value.govIssuedId;
        delete concentForm.value.signature;

        this.covidConsentForm = this.getBlankCovidVaccineForm();
        this.covidConsentForm.patchValue(concentForm.value);
      } else {
        this.covidConsentForm = this.getBlankCovidVaccineForm();
        this.covidConsentForm.patchValue({
          mobile: this.userProfileData?.mobile,
          email: this.userProfileData?.email,
        });
      }
      console.log(this.covidConsentForm);
      this.applyConditionalValidation();


    

      // this.http.latestDoseInfo$.subscribe((res: any) => {
      //   if (res) {
      //     if (res == DoseTypes.NONE) {
      //       this.covidConsentForm.patchValue({ dose: DoseTypes.FIRST})
      //     } else if(res == DoseTypes.FIRST) {
      //       this.covidConsentForm.patchValue({ dose: DoseTypes.SECOND})
      //     }
      //   }
      
     
      // });
        
    });
  }

  ngAfterViewInit() {
    this.covidConsentForm
      .get('insCardFront')
      .patchValue(this.insCardFront, { emitModelToViewChange: false }); //setting file object to reactive form
    this.covidConsentForm
      .get('insCardBack')
      .patchValue(this.insCardBack, { emitModelToViewChange: false }); //setting file object to reactive form
    this.covidConsentForm
      .get('govIssuedId')
      .patchValue(this.govIssuedId, { emitModelToViewChange: false }); //setting file object to reactive form
    this.covidConsentForm
      .get('signature')
      .patchValue(this.signature, { emitModelToViewChange: false }); //setting file object to reactive form
    this.cdref.detectChanges();
    let count =0;
    let clear = setInterval(()=>{
      this.updateLatestDoseInfo();
      count++;
      if (count==2) {
        clearInterval(clear);
      }
    },1000);
  }

  updateLatestDoseInfo() {
    const sub = this.http.getLatestDoseInfo().pipe(map(x => x.dose)).subscribe(res => {
      if (res) {
        if (res == DoseTypes.NONE) {
          this.covidConsentForm.patchValue({ dose: DoseTypes.FIRST})
        } else if(res == DoseTypes.FIRST) {
          this.covidConsentForm.patchValue({ dose: DoseTypes.SECOND}) 
        }
      }
      console.log({
        res,
        dose: this.covidConsentForm.get("dose").value
      });
      sub.unsubscribe();
    })

  }

  // async loadData(): Promise<void> {
  //   this.isLoading = true;
   
  //   forkJoin([
  //     this.http.getLatestDoseInfo().pipe(tap(x => { this.latestDoseInfo = x.dose })),
      
  //   ]).subscribe(console.log);

  // }

  drawComplete() {
    let file = this.http.base64ToFile(
      this.signaturePad.toDataURL(),
      'signature'
    );
    console.log(file);
    console.log(this.covidConsentForm.get('signature'));
    this.covidConsentForm
      .get('signature')
      .setValue(file, { emitModelToViewChange: false });
    console.log(this.covidConsentForm.get('signature'));
    console.log(file);
    this.signaturePad.off();
  }

  onClearSignature() {
    this.signaturePad?.clear();
    this.signaturePad?.on();
    this.covidConsentForm
      .get('signature')
      .setValue('', { emitModelToViewChange: false });
  }

  onGenderChange(gender) {    
    if (gender === 'male') {
      this.isGenderMale = true;
      this.covidConsentForm
      .get('potentialConsiderationFirst.isPregOrBreastfeeding')
      .setValue('No');
      
    } else {
      this.isGenderMale = false;
    }
  }

  onDateChange(dob: HTMLInputElement, formControl: string) {
    console.log('date selected', this.covidConsentForm.get(formControl).value);
    let date = new Date(dob.value);
    if (dob.value && formControl) {
      console.log('date changed');
      this.covidConsentForm
        .get(formControl)
        .setValue(moment(date).format('MM/DD/YYYY'), {
          emitModelToViewChange: false,
        });
      console.log(this.covidConsentForm.get(formControl).value);
    }
  }

  uploadImage(event, formControl: string) {
    let file: File = <File>event.target.files[0];
    if (
      file.type == 'image/jpeg' ||
      file.type == 'application/pdf' ||
      file.type == 'image/png' ||
      file.type == 'image/jpg'
    ) {
    } else {
      this.http.handleError('Please upload valid file type.!!');
      return;
    }

    if (file.size >= 5000000) {
      this.http.handleError('File size should be less thatn 5 MB');
      return;
    }
    console.log(this.covidConsentForm.get(formControl).value);

    this.covidConsentForm
      .get(formControl)
      .patchValue(file, { emitModelToViewChange: false }); //setting file object to reactive form
    console.log(this.covidConsentForm.get(formControl).value);
    console.log(this.covidConsentForm.value);
  }


  setUploadedImage(event, formControl) {
    let file: File = <File>event.target.files[0];

    if (file.size >= 5000000) {
      this.http.handleError('File size should be less thatn 5 MB');
      return;
    }

    this.covidConsentForm
      .get(formControl)
      .patchValue(file, { emitModelToViewChange: false }); //setting file object to reactive form
    console.log(this.covidConsentForm.get(formControl).value);
    console.log(this.covidConsentForm.value);
  }

  nextForm() {
    // stop here if form is invalid
    this.submitted = true;
    if (this.covidConsentForm.invalid) {
      console.log(this.covidConsentForm);
      let arr = this.findInvalidControlsRecursive(this.covidConsentForm);
      console.log(arr);
      this.http.handleError('Please check all required fields');
      return;
    }
    console.log(this.covidConsentForm.value);
    // localStorage.setItem("concentFormImages" , JSON.stringify(this.covidConsentFormImgs));
    // localStorage.setItem("concentForm", JSON.stringify(this.covidConsentForm.value));

    this.http.storeCovidForm(this.covidConsentForm);
    if (this.userProfileData.facilityId) {
      this.router.navigate(['/', AppRoutes.BOOKING_TIMINGS]);
    } else {
      this.router.navigate(['/', AppRoutes.USER_REG_S]);
    }
  }

  public handleAddressChange(address, formControl: string) {
    this.covidConsentForm.get(formControl).setValue(address.formatted_address);

    if (formControl === 'address') {
      for (let comp of address.address_components) {
        if (!comp.types || comp.types.length == 0) continue;

        if (comp.types.findIndex((x) => x.toLowerCase() == 'locality') > -1) {
          console.log(comp);
          this.covidConsentForm.get('city').setValue(comp.long_name);
        } else if (
          comp.types.findIndex(
            (x) => x.toLowerCase() == 'administrative_area_level_1'
          ) > -1
        ) {
          console.log(comp);
          this.covidConsentForm.get('state').setValue(comp.long_name);
        } else if (
          comp.types.findIndex((x) => x.toLowerCase() == 'postal_code') > -1
        ) {
          this.covidConsentForm.get('zip').setValue(comp.long_name);
        }
      }
    }
  }

  private getBlankCovidVaccineForm() {
    return this.fb.group({
      dose: ['', Validators.required],
      firstname: [
        '',
        [
          Validators.required,
          Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR),
          Validators.maxLength(50),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR),
          Validators.maxLength(50),
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
      email: [
        '',
        [Validators.required, Validators.pattern(this._regexp.EMAIL_REGEXP)],
      ],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      city: [
        '',
        [
          Validators.required,
          Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR),
        ],
      ],
      state: [
        '',
        [
          Validators.required,
          Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR),
        ],
      ],
      zip: ['', [Validators.required, Validators.maxLength(10)]],
      PCPname: ['', [Validators.required, Validators.maxLength(50)]],
      PCPmobile: ['', [Validators.required, Validators.maxLength(10)]],
      PCPfaxnumber: ['', Validators.maxLength(15)],
      PCPaddress: [''],
      PCPcity: [''],
      PCPstate: [''],
      PCPzip: ['', Validators.maxLength(10)],
      race: ['', Validators.required],
      ethnicity: ['', Validators.required],
      nextOfKin: this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(50)]],
        mobile: ['', [Validators.required, Validators.maxLength(10)]],
        relationship: [''],
        address: [''],
      }),
      // emergencyAddress: [''],
      registrySharingIndicator: ['', Validators.required],
      // patientInfo: this.fb.group({
      //   type: ['', Validators.required],
      //   doseCount: ['', Validators.required],
      // }),
      insCardFront: [null],
      insCardBack: [null],
      govIssuedId: [null],
      // insuranceInfo: this.fb.group({
      // }),
      insType: ['', Validators.required],
      prescriptionInsurance: this.fb.group({
        isPrimaryCardholder: [''],
        dob: [''],
        cardHolderId: [''],
        rxGroupId: [''],
        bin: [''],
        pcn: [''],
      }),
      medicareFields: this.fb.group({
        patientAgeAbove65: [''],
        mbi: [''],
      }),
      medicalIns: this.fb.group({
        isPrimaryCardholder: [''],
        dob: [''],
        medicalInsProvider: [''],
        cardHolderId: [''],
        groupId: [''],
        payerId: [''],
      }),
      uninsured: this.fb.group({
        isUninsured: [false],
        socialSecurityNumber: [''],
        stateIdNumber: [''],
        driverLicenseNumber: [''],
      }),
      potentialContradiction: this.fb.group({
        sick: ['', [Validators.required]],
        hadSevereAllergy: ['', [Validators.required]],
        hadAllergyAfterDose: ['', [Validators.required]],
        hadAllergyAfterOtherDoseOrInjectable: ['', [Validators.required]],
        hadAllergyRelatedToPolyGlycol: ['', [Validators.required]],
        receivedDoseIn14Days: ['', [Validators.required]],
        receivedAntibodies: ['', [Validators.required]],
      }),
      potentialConsiderationFirst: this.fb.group({
        haveBleedingDisorder: ['', [Validators.required]],
        haveWeekImmuneSystem: ['', [Validators.required]],
        isPregOrBreastfeeding: ['', [Validators.required]],
      }),
      signature: [null, Validators.required],
      potentialConsiderationSecond: this.fb.group({
        date: ['', Validators.required],
        nameOfParent: [''],
        mobile: [''],
        relationship: [''],
      }),
      vaccineCenterId: [''],
      scheduleDate: [''],
      scheduleTime: [''], 
    });
  }

  public onInsTypeSelected() {
    let insTypeSelected = this.covidConsentForm.get('insType').value;
    switch (insTypeSelected) {
      case 'prescriptioninsurance': {
        this.covidConsentForm
          .get('prescriptionInsurance.isPrimaryCardholder')
          .setValidators([Validators.required]);
        this.covidConsentForm
          .get('prescriptionInsurance.cardHolderId')
          .setValidators([Validators.required]);

        this.covidConsentForm.get('medicareFields').reset('');
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['medicareFields']
        );

        this.covidConsentForm.get('medicalIns').reset('');
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['medicalIns']
        );

        this.covidConsentForm.get('uninsured').reset({
          isUninsured: false,
          socialSecurityNumber: '',
          stateIdNumber: '',
          driverLicenseNumber: '',
        });
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['uninsured']
        );
        break;
      }
      case 'medicare': {
        this.covidConsentForm
          .get('medicareFields.patientAgeAbove65')
          .setValidators([Validators.required]);
        this.covidConsentForm
          .get('medicareFields.mbi')
          .setValidators([Validators.required]);

        this.covidConsentForm.get('prescriptionInsurance').reset('');
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['prescriptionInsurance']
        );

        this.covidConsentForm.get('medicalIns').reset('');
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['medicalIns']
        );

        this.covidConsentForm.get('uninsured').reset({
          isUninsured: false,
          socialSecurityNumber: '',
          stateIdNumber: '',
          driverLicenseNumber: '',
        });
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['uninsured']
        );
        break;
      }
      case 'medical': {
        this.covidConsentForm
          .get('medicalIns.isPrimaryCardholder')
          .setValidators([Validators.required]);
        this.covidConsentForm
          .get('medicalIns.medicalInsProvider')
          .setValidators([Validators.required]);
        this.covidConsentForm
          .get('medicalIns.cardHolderId')
          .setValidators([Validators.required]);

        this.covidConsentForm.get('prescriptionInsurance').reset('');
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['prescriptionInsurance']
        );

        this.covidConsentForm.get('medicareFields').reset('');
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['medicareFields']
        );

        this.covidConsentForm.get('uninsured').reset({
          isUninsured: false,
          socialSecurityNumber: '',
          stateIdNumber: '',
          driverLicenseNumber: '',
        });
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['uninsured']
        );

        break;
      }
      case 'uninsured': {
        this.covidConsentForm
          .get('uninsured.isUninsured')
          .setValidators([Validators.required]);

        this.covidConsentForm.get('prescriptionInsurance').reset('');
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['prescriptionInsurance']
        );

        this.covidConsentForm.get('medicareFields').reset('');
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['medicareFields']
        );

        this.covidConsentForm.get('medicalIns').reset('');
        this.removeFormGroupValidators(
          <FormGroup>this.covidConsentForm.controls['medicalIns']
        );

        break;
      }
    }
    this.cdref.detectChanges();
    console.log(this.covidConsentForm);
  }
  onFeedBackForm() {
    this.router.navigate(['/', AppRoutes.FEEDBACK_FORM]);
  }

  public uinsuredControl: FormControl = new FormControl(
    '',
    Validators.required
  );
  public submitted = false;
  onUninsuredTypeSelected() {
    switch (this.uinsuredControl.value) {
      case 'socialSecurityNumber': {
        this.covidConsentForm.get('uninsured.stateIdNumber').reset('');
        this.covidConsentForm.get('uninsured.stateIdNumber').clearValidators();
        this.covidConsentForm
          .get('uninsured.stateIdNumber')
          .updateValueAndValidity();

        this.covidConsentForm.get('uninsured.driverLicenseNumber').reset('');
        this.covidConsentForm
          .get('uninsured.driverLicenseNumber')
          .clearValidators();
        this.covidConsentForm
          .get('uninsured.driverLicenseNumber')
          .updateValueAndValidity();

        this.covidConsentForm
          .get('uninsured.socialSecurityNumber')
          .setValidators([Validators.required]);
        break;
      }
      case 'stateIdNumber': {
        this.covidConsentForm.get('uninsured.socialSecurityNumber').reset('');
        this.covidConsentForm
          .get('uninsured.socialSecurityNumber')
          .clearValidators();
        this.covidConsentForm
          .get('uninsured.socialSecurityNumber')
          .updateValueAndValidity();

        this.covidConsentForm.get('uninsured.driverLicenseNumber').reset('');
        this.covidConsentForm
          .get('uninsured.driverLicenseNumber')
          .clearValidators();
        this.covidConsentForm
          .get('uninsured.driverLicenseNumber')
          .updateValueAndValidity();

        this.covidConsentForm
          .get('uninsured.stateIdNumber')
          .setValidators([Validators.required]);
        break;
      }
      case 'driverLicenseNumber': {
        this.covidConsentForm.get('uninsured.socialSecurityNumber').reset('');
        this.covidConsentForm
          .get('uninsured.socialSecurityNumber')
          .clearValidators();
        this.covidConsentForm
          .get('uninsured.socialSecurityNumber')
          .updateValueAndValidity();

        this.covidConsentForm.get('uninsured.stateIdNumber').reset('');
        this.covidConsentForm.get('uninsured.stateIdNumber').clearValidators();
        this.covidConsentForm
          .get('uninsured.stateIdNumber')
          .updateValueAndValidity();

        this.covidConsentForm
          .get('uninsured.driverLicenseNumber')
          .setValidators([Validators.required]);
        break;
      }
    }
    this.cdref.detectChanges();
  }
  applyConditionalValidation() {
    this.uinsuredControl.setValue(
      this.covidConsentForm.get('uninsured.isUninsured').value
    );

    this.covidConsentForm
      .get('prescriptionInsurance.isPrimaryCardholder')
      .valueChanges.subscribe((value) => {
        console.log(value);
        value == 'No'
          ? this.covidConsentForm
              .get('prescriptionInsurance.dob')
              .setValidators([Validators.required])
          : this.covidConsentForm
              .get('prescriptionInsurance.dob')
              .clearValidators();

        this.covidConsentForm
          .get('prescriptionInsurance.dob')
          .updateValueAndValidity();
      });

    this.covidConsentForm
      .get('medicalIns.isPrimaryCardholder')
      .valueChanges.subscribe((value) => {
        console.log(value);
        value == 'No'
          ? this.covidConsentForm
              .get('medicalIns.dob')
              .setValidators([Validators.required])
          : this.covidConsentForm.get('medicalIns.dob').clearValidators();

        this.covidConsentForm.get('medicalIns.dob').updateValueAndValidity();
      });

    // this.covidConsentForm.get('potentialContradiction.receivedDose').valueChanges.subscribe(value => {
    //   console.log(value)
    //   value == 'Yes' ?
    //     this.covidConsentForm.get('potentialContradiction.vaccineCompany').setValidators([Validators.required]) :
    //     this.covidConsentForm.get('potentialContradiction.vaccineCompany').clearValidators();

    //   this.covidConsentForm.get('potentialContradiction.vaccineCompany').updateValueAndValidity();

    // })

    this.cdref.detectChanges();
  }

  private removeFormGroupValidators(form: FormGroup) {
    for (const key in form.controls) {
      form.get(key).clearValidators();
      form.get(key).updateValueAndValidity();
    }
  }
  private findInvalidControls() {
    const invalid = [];
    const controls = this.covidConsentForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  private findInvalidControlsRecursive(
    formToInvestigate: FormGroup | FormArray
  ): string[] {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach((field) => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    };
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

  //   public addValidators(form: FormGroup) {
  //   for (const key in form.controls) {
  //       form.get(key).setValidators(this.validationType[key]);
  //       form.get(key).updateValueAndValidity();
  //   }
  // }
}
