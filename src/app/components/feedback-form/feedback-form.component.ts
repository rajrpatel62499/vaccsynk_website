import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { REGEXP } from 'src/app/services/regexp';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent  implements OnInit{

  feedbackForm:FormGroup;
  registerForm: FormGroup;
  submitted = false;
  isLoading=false;
     
  get f() { return this.feedbackForm.controls; }


  constructor(private cdref: ChangeDetectorRef,  private formBuilder: FormBuilder, private http: HttpService,private _regexp: REGEXP,) {

    // --------contact-form-validation------------//
    this.feedbackForm = this.formBuilder.group({
      sick:['',Validators.required],
      receivedDose:[''],
      vaccineCompany:[''],
      hadAllergyOfCovidVaccine:['',Validators.required],
      hadAllergyOfPolysorbate:['',Validators.required],
      hadAllergyOfPrevDose:['',Validators.required],
      hadAllergyAfterOtherDoseOrInjectableFirst:['',Validators.required],
      hadAllergyAfterOtherDoseOrInjectableSecond:['',Validators.required],
      receivedDoseIn14Days:['',Validators.required],
      receivedTherapy:['',Validators.required],
      hadCovidPositive:['',Validators.required],
      haveWeekImmuneSystem:['',Validators.required],
      haveBleedingDisorder:['',Validators.required],
      isPregOrBreastfeeding:['',Validators.required],
      },);
   }


    ngOnInit(): void {
      
    this.applyConditionalValidations();
    }
    
    applyConditionalValidations() {
      this.feedbackForm.get('receivedDose').valueChanges.subscribe(value => {
        console.log(value)
        value == 'Yes' ?
          this.feedbackForm.get('vaccineCompany').setValidators([Validators.required]) :
          this.feedbackForm.get('vaccineCompany').clearValidators();
  
        this.feedbackForm.get('vaccineCompany').updateValueAndValidity();
  
      })

    this.cdref.detectChanges();


    }


    onSubmit() {
      this.submitted = true;
      if (this.feedbackForm.invalid) {
        console.log(this.feedbackForm)
        let arr = this.findInvalidControlsRecursive(this.feedbackForm);
        console.log(arr);
        this.http.handleError("Please check all required fields")
        return;
      }
      this.isLoading = true;
      
      this.http.feedBackUs(this.feedbackForm.value).subscribe(res=>{
        this.isLoading = false;
        this.submitted = false;
        this.http.showToaster(`FeedBack Form Submit Successfully..!`);
        this.feedbackForm.reset();
      },
      err=>{
        this.isLoading = false;
        this.submitted = false;
      //  this.http.handleError(err.error.message)
        console.log(err);
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
