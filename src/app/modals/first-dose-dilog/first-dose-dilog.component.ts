import { DoseTypes } from './../../models/enums';
import { finalize } from 'rxjs/operators';
import { AppRoutes } from 'src/app/models/app-routes';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { REGEXP } from 'src/app/services/regexp';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/models/user-profile';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-first-dose-dilog',
  templateUrl: './first-dose-dilog.component.html',
  styleUrls: ['./first-dose-dilog.component.scss']
})
export class FirstDoseDilogComponent implements OnInit {

   patientNumber:string;
  public userProfileData: UserProfile;


  firstDoseForm: FormGroup = this.formBuilder.group({
    administrationName: ['', Validators.required],
    VISDate: ['', Validators.required],
    manufacturer: ['', Validators.required],
    lot: ['', Validators.required],
    patientNumber: [''],
    dob:['',Validators.required]
  });

  submitted = false;
  isLoading = false;
  get f() { return this.firstDoseForm.controls }

  constructor(
    private formBuilder: FormBuilder,
    private _regexp: REGEXP,
    public http: HttpService,
    public router: Router,
    public dialogRef: MatDialogRef<FirstDoseDilogComponent>,
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
    this._auth.getUserProfileData().subscribe((res:UserProfile) => {
      this.isLoading=true;
      console.log("User Data Fetched")
        // this.userProfileData = res;
        console.log(res);
        if(res) {
          this.userProfileData = res;
          this.firstDoseForm.patchValue({patientNumber: this.userProfileData.patientNumber})
          this.isLoading=false;
        }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {

    this.submitted = true;
    if (this.firstDoseForm.invalid) {
      console.log(this.firstDoseForm)
      let arr = this.findInvalidControlsRecursive(this.firstDoseForm);
      console.log(arr);
      this.http.handleError("Please check all required fields")
      return;
    }
  
    console.log(this.firstDoseForm.value)
    this.apiHit();
  }


  private apiHit() {
    this.isLoading = true;


    this.http.postFirstDoseDetials( this.firstDoseForm.value).pipe(finalize(() => { this.isLoading = false;})).subscribe(res => {
      console.log(res);
      this.http.setLatestDoseInfoData(DoseTypes.FIRST);
      this.dialogRef.close(true);
      this.router.navigate(["/",AppRoutes.APPOINTMENT]);
      this.http.showToaster("1st dose detail added successfully");
    })
    
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
