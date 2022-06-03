import { AppRoutes } from 'src/app/models/app-routes';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RescheduleAppointmentComponent } from 'src/app/modals/reschedule-appointment/reschedule-appointment.component';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentReminder } from 'src/app/models/appointment-reminder';
import { Dose } from 'src/app/models/dose';
import { HttpService } from 'src/app/services/http.service';
import { forkJoin } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { UserProfile } from 'src/app/models/user-profile';
import { ApplyForCovid19Component } from 'src/app/modals/apply-for-covid19/apply-for-covid19.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DoseTypes } from 'src/app/models/enums';
import { FirstDoseDilogComponent } from 'src/app/modals/first-dose-dilog/first-dose-dilog.component';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

  appointments: Appointment[] = [];
  doses: Dose[] = [];
  appointmentReminders: AppointmentReminder[] = [];
  userProfile: UserProfile;
  isLoading = false;

  public latestDoseInfo: DoseTypes;
  DoseTypes = DoseTypes;


  constructor(public dialog: MatDialog,
    public router: Router,
    private ngxUiLoaderService: NgxUiLoaderService,
    public http: HttpService, private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }
  
  async loadData(): Promise<void> {
    this.isLoading = true;
    this.authService.getUserProfileData().subscribe(res => { res ? this.userProfile = res : ''; console.log('profile',this.userProfile) });
    // let sub = this.http.latestDoseInfo$.subscribe((res: any) => { res ? this.latestDoseInfo = res : ''; console.log('latestDoseInfo',this.latestDoseInfo) });

    console.log(this.latestDoseInfo);
    
    this.ngxUiLoaderService.startLoader('can-schedule-loader');
    forkJoin([
      this.http.getLatestDoseInfo().pipe(tap(x => { this.latestDoseInfo = x.dose })),
      this.http.getAppointmentDetails().pipe(tap(x => this.appointments = x)),
      this.http.getPatientAppointmentReminder().pipe(tap(x => this.appointmentReminders = x)),
      this.http.getDoses().pipe(tap(x => this.doses = x)),
    
      
    ]).pipe(finalize(() => {
      //  sub.unsubscribe();
       setTimeout(()=>{
        this.isLoading = false;
       },3000)
       console.log('reminders',this.appointmentReminders)
       this.ngxUiLoaderService.stopLoader('can-schedule-loader');
    })).subscribe((console.log));

  }

  printPage() {
    window.print();
  }


  redirectToForm() {
    this.router.navigate([AppRoutes.ROOT, AppRoutes.USER_REG_F]);
  }
  openRescheduleDialog(appointment: Appointment) {

    let dialogRef = this.dialog.open(RescheduleAppointmentComponent, {
      width: '583px',
      data: {
        appointment: appointment,
        button: "RESCHEDULE"
      }
    });
    dialogRef.afterClosed().subscribe(result => {            
      console.log('The dialog was closed');
      if(result!=='cancel'){
        this.loadData();
      }     
    });
  }

  openDialogCovid19() {

    let dialogRef = this.dialog.open(ApplyForCovid19Component, {
      width: '583px',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if(result) {
        this.openFirstDoseDialog();
      }
    });
  }

  openFirstDoseDialog() {
    console.log('The dialog was closed');
    let dialogRef = this.dialog.open(FirstDoseDilogComponent, {
      width: '583px',
      data: { }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
      console.log('The dialog was closed');
    });
  }

  cancelAppointment(appointment) {

    let dialogRef = this.dialog.open(RescheduleAppointmentComponent, {

      width: '583px',
      data: {
        appointment: appointment,
        button: 'CANCEL'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      
      console.log('The dialog was closed');
      if(result!=='cancel'){
        this.loadData();
      }
      

    });




    // const swalWithBootstrapButtons = Swal.mixin({
    //   customClass: {
    //     confirmButton: 'btn btn-success',
    //     cancelButton: 'btn btn-danger'
    //   },
    //   buttonsStyling: false
    // })
    // swalWithBootstrapButtons.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes, delete it!',
    //   cancelButtonText: 'No, cancel! ',
    //   reverseButtons: true
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     // this.http.cancelAppointment(appointmentId).subscribe(res => {
    //     //   console.log(res);
    //     // })
    //     swalWithBootstrapButtons.fire(
    //       'Deleted!',
    //       'Your file has been deleted.',
    //       'success'
    //     )
    //   } else if (
    //     /* Read more about handling dismissals below */
    //     result.dismiss === Swal.DismissReason.cancel
    //   ) {
    //     swalWithBootstrapButtons.fire(
    //       'Cancelled',
    //       'Your imaginary file is safe :)',
    //       'error'
    //     )
    //   }
    // })
  }


}
