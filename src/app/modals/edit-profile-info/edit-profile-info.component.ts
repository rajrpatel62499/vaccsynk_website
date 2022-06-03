import { AppRoutes } from './../../models/app-routes';
import { UserProfile } from 'src/app/models/user-profile';
import { HttpService } from './../../services/http.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl } from '@angular/forms';
import { Address } from 'cluster';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { REGEXP } from 'src/app/services/regexp';
import * as moment from 'moment'

@Component({
  selector: 'app-edit-profile-info',
  templateUrl: './edit-profile-info.component.html',
  styleUrls: ['./edit-profile-info.component.scss']
})
export class EditProfileInfoComponent implements OnInit {

  AppRoutes = AppRoutes;
  userProfileData: UserProfile;
  today = new Date()
  userProfileForm: FormGroup = this.formBuilder.group({
    name : ['', Validators.required],
    email : ['', [Validators.required, Validators.pattern(this._regexp.EMAIL_REGEXP)]],
    mobile : [ '', Validators.required],
    gender : [''],
    birthdate : [''],
    address : [''],
    state : ['', Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR) ],
    city : ['', Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)],
    zip : [''],
    // faxNo: ['',],
    // NPINo: ['',],
    // pharmacistName: ['',],
    // pharmacistEmail: ['',],
    // pharmacistNpiNumber: ['', ],
  });
  public dateFirstTime = true;

  
  public submitted = false;
  public isLoading = false;
  get f() : {  
    [key: string]: AbstractControl;
  }{ return this.userProfileForm.controls; }
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
    
  // public handleAddressChange(address) {
  // // Do some stuff
  // console.log(address);
  //   this.userProfileForm.get('address').setValue(address.formatted_address);
  // }

  mobile: string;
  constructor(public dialog: MatDialog,
    private _regexp: REGEXP,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileInfoComponent>,
   @Inject(MAT_DIALOG_DATA) public data: any,
   private _http: HttpService
    ) { }

  ngOnInit(): void {
    this.userProfileData = JSON.parse(JSON.stringify(this.data));
    console.log(this.userProfileData)

    this.userProfileForm.patchValue(this.userProfileData);

    if ( this.userProfileForm.get('birthdate').value) {
      const bday = new Date(this.userProfileForm.get('birthdate').value);
      console.log('date selected', this.userProfileForm.get('birthdate').value)
  
      this.userProfileForm.get('birthdate').setValue(moment(bday).format('DD-MM-YYYY'), { emitModelToViewChange: false});
      console.log('date selected', this.userProfileForm.get('birthdate').value)
      
    }

    this.mobile = this.userProfileData.mobile; //storing into variable.

    this.userProfileForm.get('mobile').disable();
  }

  cancel(){
    this.dialogRef.close();
  }

  public handleAddressChange(address, formControl: string) {
    this.userProfileForm.get(formControl).setValue(address.formatted_address);

    if (formControl === 'address') {
      for (let comp of address.address_components) {
        if (!comp.types || comp.types.length == 0) continue;

        if (comp.types.findIndex((x) => x.toLowerCase() == 'locality') > -1) {
          console.log(comp);
          this.userProfileForm.get('city').setValue(comp.long_name);
        } else if (
          comp.types.findIndex(
            (x) => x.toLowerCase() == 'administrative_area_level_1'
          ) > -1
        ) {
          console.log(comp);
          this.userProfileForm.get('state').setValue(comp.long_name);
        } else if (
          comp.types.findIndex((x) => x.toLowerCase() == 'postal_code') > -1
        ) {
          this.userProfileForm.get('zip').setValue(comp.long_name);
        }
      }
    }
  }

  onDateChange(dob: HTMLInputElement, formControl: string) {
    // if (this.dateFirstTime) return;
    // this.dateFirstTime = false;
    // console.log('date selected', this.userProfileForm.get(formControl).value)
    // let date = new Date(dob.value);
    // moment(date).format('DD-MM-YYYY');

    // if(dob.value && formControl) {
    //   console.log('date changed')
    //     this.userProfileForm.get(formControl).setValue(date.toString(), { emitModelToViewChange: false});
    // //     console.log(this.covidConsentForm.get(formControl).value);
    // }
    
    // console.log('date selected', this.userProfileForm.get(formControl).value)

  }
  updateProfile() {
    this.submitted = true;
    console.log("update called")
    if(!this.userProfileForm.valid) {
      return;
    }
    // console.log(this.userProfileForm.value.zip);
    // return;
    this.isLoading = true;
    console.log(JSON.stringify(this.userProfileData))
    this.userProfileData = this.userProfileForm.value;
    this._http.updatePatientProfile(this.userProfileData).subscribe(res =>{
      this._http.showToaster("Profile update successfully! ");
      this.isLoading = false;
      this.userProfileData.mobile = this.mobile; //sending back.
      this.dialogRef.close(this.userProfileData);
    },err=>{
      this.isLoading = false;
      this._http.handleError(err.error.message);
    })
  }


}
