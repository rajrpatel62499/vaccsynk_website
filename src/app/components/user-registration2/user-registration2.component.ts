import { filter, map } from 'rxjs/operators';
import { AppRoutes } from './../../models/app-routes';
import { CovidConcentForm } from './../../models/covid-consent-form';
import { DayOfWeek } from './../../models/enums';
import { VaccineCenter, SlotInfo, Slot } from './../../models/vaccine-center';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup } from '@angular/forms';
import { Appointment } from 'src/app/models/appointment';
import { BookingSetting } from 'src/app/models/booking-setting';

@Component({
  selector: 'app-user-registration2',
  templateUrl: './user-registration2.component.html',
  styleUrls: ['./user-registration2.component.scss']
})
export class UserRegistration2Component implements OnInit {

  AppRoutes = AppRoutes;
  availableDosesCount: number = 0;
  vaccineCenters: VaccineCenter[] = [];
  selectedVacCenter: VaccineCenter;
  reScheduleDate: string;
  reScheduleTime: string;
  isLoading = false;  
  isLoading1=false;
  bookingSetting: BookingSetting = new BookingSetting();
  

  availableSloats: SlotInfo[] = [];
  selectedSloat: Slot;
  selectedVacSlotInfo: SlotInfo;

  covidConcentForm: CovidConcentForm;
  rescheduleAppointment: Appointment;
  today = new Date();

  @ViewChild('date')
  date: ElementRef;
  
  constructor(private router: Router, private http: HttpService) { }

  ngOnInit(): void {

    let concentForm: FormGroup = this.http.loadCovidForm();
    
    // if(concentForm) { 
    //   this.covidConcentForm = concentForm.value;
    //   this.loadVaccineCenters();
    // }

    if(this.http._rescheduleAppointment) {
        this.rescheduleAppointment = this.http._rescheduleAppointment;
        this.loadVaccineCenterById(this.rescheduleAppointment.vaccineCenterId._id);
        console.log(this.rescheduleAppointment);
        // this.reScheduleDate = this.rescheduleAppointment.scheduleDate;
        // this.reScheduleTime = this.rescheduleAppointment.scheduleTime;
    } else if(concentForm) {
        this.covidConcentForm = concentForm.value;
        this.loadVaccineCenters();
    }

    if(!this.covidConcentForm  && !this.rescheduleAppointment) {
      this.router.navigate(["/"]);
      return;
    }

    console.log(this.covidConcentForm);
  }


  ngOnDestroy() {
    // handling for the reschedule appointment.
    this.http._rescheduleAppointment = null;
    this.rescheduleAppointment = null;
  }




  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    this.loadVaccineCenters(filterValue);
  }

  loadVaccineCenterById(vaccineCenterId: string) {

    this.isLoading =true;

    this.http.getVaccineCenters().pipe(
      map(x => x.filter(y => y._id == vaccineCenterId))
    ).subscribe(res => {
      this.vaccineCenters = res;
      this.isLoading = false;
   
      if(res) {
        this.selectedVacCenter = res[0];
        
      }
    })

  }

  loadVaccineCenters(search?: string) {
    this.isLoading=true;
    this.vaccineCenters = [];
    this.selectedVacCenter = null;

    this.resetControls();
    this.http.getVaccineCenters(search).subscribe(res => {
      this.vaccineCenters = res;
      this.isLoading=false;
      console.log(this.vaccineCenters)
      // let selectedVac = this.vaccineCenters.find(x => x._id == this.rescheduleAppointment?.vaccineCenterId._id)
      // if(selectedVac) {
      //   this.selectedVacCenter = selectedVac;
      // }
    });
  }

  onVacCenterSelected(vacCenter: VaccineCenter) {
    this.selectedVacCenter = vacCenter;
    this.resetControls();
    if(this.covidConcentForm) {
      this.covidConcentForm.vaccineCenterId = this.selectedVacCenter._id;
    }
    this.date ? this.date.nativeElement.value = '' : '';
    console.log(this.selectedVacCenter);
  }

  resetControls() {
    this.availableSloats.splice(0, this.availableSloats.length); // to remove slots.
    this.reScheduleDate = '';
    this.reScheduleTime = '';
    this.covidConcentForm.scheduleDate = '';
    this.covidConcentForm.scheduleTime = '';
    
    this.selectedVacSlotInfo = null;
    this.availableDosesCount = 0;
  }

  handler(e){
    alert(e.target.value);
  }
  
  onDateChange(currentDateInput: HTMLInputElement) {
    let selectedDate: Date = new Date(currentDateInput.value);
    if(currentDateInput.value) {
      
        if(this.selectedVacCenter) {
            // let availableSlotInfo:SlotInfo
            this.selectedVacSlotInfo = null;
            this.selectedVacSlotInfo = this.selectedVacCenter.timings[DayOfWeek[selectedDate.getUTCDay()].toString()];
            if(this.selectedVacSlotInfo) {
              // this.availableSloats = this.getTimeSlotsBySlotInfo(this.selectedVacSlotInfo);
            }
            if(this.covidConcentForm) {
              // this.covidConcentForm.scheduleDate = `${selectedDate.getMonth()+1}/${selectedDate.getDay()}/${selectedDate.getFullYear()}`;
              this.covidConcentForm.scheduleDate = currentDateInput.value;
            }else {
              // this.scheduleDate = `${selectedDate.getMonth()+1}/${selectedDate.getDay()}/${selectedDate.getFullYear()}`;
              this.reScheduleDate = currentDateInput.value;
              this.reScheduleTime = '';
            }

          this.availableDosesCount = this.getCount(this.selectedVacSlotInfo);


        }
        
    }
  }
  updateAvailableDoseCount() {
    if(this.bookingSetting.scheduleDate) {
      let selectedDate: Date = new Date(this.bookingSetting.scheduleDate);
      if(this.selectedVacCenter) {
        let timing: SlotInfo =  this.selectedVacCenter.timings[DayOfWeek[selectedDate.getUTCDay()].toString()];
        console.log(timing);
        this.availableDosesCount = this.getCount(timing);
        // console.log('this.availableDosesCount    this.availableDosesCount',this.availableDosesCount);
      }
      console.log('this.availableDosesCount    this.availableDosesCount',this.availableDosesCount);

    }
  }

  
  getCount(timing: SlotInfo) {
    let count: number = 0;
    timing.slots.forEach(slot => {
      // let start: number = +slot.start.split(":") [0];
      // let end: number = +slot.end.split(":")[0];
      count = count + slot.limit;
    })
   
    return count;
  }
  selectSloat(sloat: Slot) {
    this.selectedSloat = sloat;
    if(this.covidConcentForm) {
      // this.covidConcentForm.scheduleTime = `${sloat.open}:00 - ${sloat.close}:00`;
      this.covidConcentForm.scheduleTime = `${sloat.start} - ${sloat.end}`;
    }else {
      // this.reScheduleTime = `${sloat.open}:00 - ${sloat.close}:00`;
      this.reScheduleTime = `${sloat.start} - ${sloat.end}`;
    }
  }

  onSubmit() {
    if(this.http.isNullOrEmpty(this.covidConcentForm.scheduleDate) || this.http.isNullOrEmpty(this.covidConcentForm.scheduleTime)) {
      this.http.showToaster("Please select date & time", "error");
      return;
    }
    
    this.isLoading1 = true;
    this.http.postCovidVaccineForm(this.covidConcentForm).subscribe(res =>{
      console.log(res);
      this.http.storeCovidForm(null);
      this.isLoading1 = false;
      this.http.showToaster("Your Form Submitted Successfully!");
      this.router.navigate([AppRoutes.ROOT, AppRoutes.APPOINTMENT]);
      // localStorage.removeItem("concentForm");
    }, err=>{
      this.isLoading1 = false;
      console.log(err);
      // this.http.handleError(err.error?.message);
    });
  }

  onReschedule() {
    console.log(this.reScheduleDate);
    console.log(this.reScheduleTime);
    console.log(this.selectedVacCenter._id);
    if(!this.reScheduleDate || !this.reScheduleTime) {
      this.http.showToaster("Please select date & time", "error");
      return;
    }

    this.isLoading1 = true;
    this.http.rescheduleAppointmentById(this.rescheduleAppointment._id, {
      scheduleDate: this.reScheduleDate,
      scheduleTime: this.reScheduleTime,
      vaccineCenterId: this.selectedVacCenter._id
    }).subscribe(res => {
      this.isLoading1 = false;
      this.http.showToaster("Appointment Reschedule Successfully");
      this.router.navigate([AppRoutes.APPOINTMENT]);
    },
    err => {
      this.isLoading1 = false;
      console.log(err)
      this.http.handleError(err.error?.message);
    })

  }

  // private getTimeSlotsBySlotInfo(availableSlotInfo: SlotInfo): SlotInfo[] {
  //   const open= availableSlotInfo?.open?.split(" ");
  //   const close= availableSlotInfo?.close?.split(" ");
  //   if(!open && !close) {
  //     return [];
  //   }
  //   const openingTime = Number.parseFloat(open[0]);
  //   const closingTime = Number.parseFloat(close[0]);
  //   console.log(openingTime);
  //   console.log(closingTime);
  //   let availableSloats: {open:string, close:string}[] = [];
  //   // for(let i=openingTime; i< 45; i++) {
  //   //   // console.log(i %13);
  //   //   if( i % 13 == closingTime) {
  //   //     break;
  //   //   }
  //   //   ( i % 13) != 0 ? availableSloats.push({open: `${i % 13}`, close: `${(i % 13 + 1 == 13) ? 1 : (i % 13 + 1)}`}) : '';
  //   // }
  //   for (let i = openingTime; i < 45; i++) {
  //     console.log(i);
  //     if (i % 25 == closingTime) {
  //         break;
  //     }
  //     (i % 25) != 0 ? availableSloats.push({ open: `${i}`, close: `${i + 1}` }) : '';
     
  //   }

  //   console.log(availableSloats);
  //   return availableSloats;
  // }
}
