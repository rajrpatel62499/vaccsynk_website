import { HttpService } from './../../services/http.service';
import { finalize } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/models/app-routes';
import { BookingSetting } from 'src/app/models/booking-setting';
import { UserProfile } from 'src/app/models/user-profile';
import { AuthService } from 'src/app/services/auth.service';
import { CovidConcentForm } from 'src/app/models/covid-consent-form';
import { VaccineCenter } from 'src/app/models/vaccine-center';
import { DayOfWeek } from 'src/app/models/enums';

export interface Timings {
  Monday: SlotInfo;
  Tuesday: SlotInfo;
  Wednesday: SlotInfo;
  Thursday: SlotInfo;
  Friday: SlotInfo;
  Saturday: SlotInfo;
  Sunday: SlotInfo;
}

export interface SlotInfo {
  maxDose?: number;
  open: string;
  close: string;
  noOfVaccinator: number;
  slots: Slot[];
}
export interface Slot {
  _id?: string;
  limit?: number;
  start: string;
  end: string;
}
@Component({
  selector: 'app-booking-timings',
  templateUrl: './booking-timings.component.html',
  styleUrls: ['./booking-timings.component.scss']
})
export class BookingTimingsComponent implements OnInit {

  public startTimes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  public endTimes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];

  AppRoutes = AppRoutes;

  bookingSettings: BookingSetting[] = [];
  vaccineCenterLoader = false;  
  isLoading=false;

  bookingSetting: BookingSetting;
  userProfile: UserProfile;
  

  // selectedVacSlotInfo: SlotInfo;
  
  selectedSloat: Slot;
  availableSloats: Slot[] = [];

  // facilityCovidFormData: FacilityFormData;
  today = new Date();
  selectedVacCenter: VaccineCenter;

  @ViewChild('scheduleDate')
  scheduleDate: ElementRef;
  

  covidConcentForm: CovidConcentForm;

  selectedVacSlotInfo:SlotInfo;

  constructor(private fb: FormBuilder, 
    private cdr: ChangeDetectorRef,
    private http: HttpService,
    private auth: AuthService, private router: Router,) { }

  ngOnInit(): void {

    
  }
  ngAfterViewInit() {
    this.init();
    this.cdr.detectChanges();
  }


  init() {
    let concentForm: FormGroup = this.http.loadCovidForm();
    this.auth.getUserProfileData().subscribe(res => {
    
      if (res) {
        this.userProfile = res;
        
        if(concentForm) {
          this.covidConcentForm = concentForm.value;
        }
        
        console.log(this.covidConcentForm);
        if(!this.covidConcentForm ) {
          this.router.navigate(["/", AppRoutes.USER_REG_F]);
          return;
        }

        this.loadVaccineCenters();
        
      }

    })
  }
 

  loadVaccineCenters() {
    this.vaccineCenterLoader = true;
    console.log('dihdh',this.userProfile)
    this.http.getVaccinecenterForInvitation(this.userProfile.facilityId).pipe(finalize(()=>{ this.vaccineCenterLoader=false; })).subscribe(res => {
      if (res[0]) {
        this.bookingSetting = res[0];
        this.editMode(this.bookingSetting);
        console.log(this.bookingSettings)
      }
    });
  }

  editMode(bookingSetting: BookingSetting) {
    this.onSelectStartTime(bookingSetting.startTime);
    setTimeout(() => {
      
      this.scheduleDate.nativeElement.value = bookingSetting.scheduleDate;
    }, 100);
    this.covidConcentForm.scheduleDate = bookingSetting.scheduleDate;
    this.covidConcentForm.vaccineCenterId = bookingSetting.currentVaccineCenter._id;

    let selectedDate: Date = new Date(bookingSetting.scheduleDate);
    this.selectedVacSlotInfo = null;
    this.selectedVacSlotInfo = bookingSetting.currentVaccineCenter.timings[
      DayOfWeek[selectedDate.getUTCDay()].toString()
    ];   

    console.log(this.selectedVacSlotInfo);
    this.setMaxDosBadge(this.selectedVacSlotInfo);
  }



  selectSloat(sloat: Slot) {
    this.selectedSloat = sloat;
    this.covidConcentForm.scheduleTime = `${sloat.start} - ${sloat.end}`;
  }

  // onSubmit() {

  //   console.log(this.bookingSetting);
  //   let form = this.getForm();
  //   form.patchValue(this.bookingSetting);

  //   if (form.invalid) {
  //     console.log(this.util.findInvalidControlsRecursive(form));
  //     this.util.handleError("Please check all fields");
  //   }

  //   this.isLoading = true;
  //   this.vacService.updateBookingDetails(this.bookingSetting).subscribe(
  //     res => {
  //       console.log(res);
  //       this.isLoading = false;
  //       this.resetState();
  //       this.bookingSetting = null;
  //       this.util.showToaster("Your Form Updated Successfully!");

  //     }, err => {
  //       console.log(err);
  //       this.isLoading = false;
  //       this.util.handleError(err.error?.message);
  //     }
  //   )
  // }
  onSubmit() {
    if(this.http.isNullOrEmpty(this.covidConcentForm.scheduleDate) || this.http.isNullOrEmpty(this.covidConcentForm.scheduleTime)) {
      this.http.showToaster("Please select available time slot", "error");
      return;
    }
    
    this.isLoading = true;

    this.http.postCovidVaccineForm(this.covidConcentForm).pipe(finalize(()=>{this.isLoading = false;})).subscribe(
      res => {
        console.log(res);
        this.http.storeCovidForm(null);
        this.http.showToaster("Appointment scheduled successfully!");
        this.router.navigate([AppRoutes.ROOT, AppRoutes.APPOINTMENT]);

      }, err => {
        console.log(err);
        this.http.handleError(err.error?.message);
      }
    )
  }

  private getForm() {
    return this.fb.group({
      currentVaccineCenter: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      scheduleDate: ['', Validators.required]
    })
  }

  private onSelectStartTime(start: number) {
    this.bookingSetting.startTime = start; 
    console.log(this.bookingSetting);
    if (start == 24) {
      this.bookingSetting.endTime = 24;
    } else {
      this.bookingSetting.endTime = start + 1;
    }

    this.onSelectEndTime(this.bookingSetting.endTime);
  }

  private onSelectEndTime(end: number) {
    this.bookingSetting.endTime = end;
    // generate slots
    // this.availableSloats = this.getSlots(this.bookingSetting.startTime, this.bookingSetting.endTime);
    // this.setMaxDosBadge(this.selectedVacSlotInfo);
  }

  setMaxDosBadge(selectedVacData){
    if (this.selectedVacSlotInfo.slots.length != 0) {
      for (
        let index = 0;
        index < this.selectedVacSlotInfo.slots.length;
        index++
      ) {
        for (let j = 0; j < this.availableSloats.length; j++) {           

          if(this.selectedVacSlotInfo.slots[index].start.indexOf(":") == -1){
            this.selectedVacSlotInfo.slots[index].start = this.selectedVacSlotInfo.slots[index].start+":00"
          }

          if(this.selectedVacSlotInfo.slots[index].end.indexOf(":") == -1){
            this.selectedVacSlotInfo.slots[index].end = this.selectedVacSlotInfo.slots[index].end+":00"
          }

          if (
            this.availableSloats[j].start ==
              this.selectedVacSlotInfo.slots[index].start &&
            this.availableSloats[j].end ==
              this.selectedVacSlotInfo.slots[index].end
          ) {
            this.availableSloats[j].limit = this.selectedVacSlotInfo.slots[index].limit;
          }
        }
      }
    }
  }

  private resetState() {
    this.availableSloats.splice(0, this.availableSloats.length); // to remove slots.
    this.scheduleDate.nativeElement.value = '';
    delete this.bookingSetting.scheduleDate;
    delete this.bookingSetting.startTime ;
    delete this.bookingSetting.endTime ;
  }

  // onDateChange(currentDateInput: HTMLInputElement) {
  //   this.bookingSetting.scheduleDate = currentDateInput.value;
  // }

  // onVacCenterSelected(vacCenter: VaccineCenter) {
  //   this.selectedVacCenter = vacCenter;
  //   this.bookingSetting.currentVaccineCenter = vacCenter._id;
  //   this.resetState();
  //   console.log(this.bookingSetting);
  //   console.log(this.selectedVacCenter);
  // }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   console.log(filterValue);
  //   this.loadVaccineCenters(filterValue);
  // }


  private getSlots(startTime: number, endTime: number): Slot[] {
    let slots: Slot[] = [];

    for (let i = startTime; i < endTime; i++ )
    {
      const start = `${i}:00`;
      const middle = `${i}:30`;
      const end = `${i + 1}:00`;
      
      slots.push({
        start: start,
        end: middle
      })

      slots.push({
        start: middle,
        end: end
      })
    }

    return slots;
  }

}
