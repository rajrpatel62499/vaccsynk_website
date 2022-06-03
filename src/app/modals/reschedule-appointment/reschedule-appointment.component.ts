import { AppRoutes } from './../../models/app-routes';
import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/models/appointment';

@Component({
  selector: 'app-reschedule-appointment',
  templateUrl: './reschedule-app\ointment.component.html',
  styleUrls: ['./reschedule-appointment.component.scss']
})
export class RescheduleAppointmentComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RescheduleAppointmentComponent>,
    public router: Router,
    private http: HttpService
  ) { }

  appointment: Appointment;
  appointmentId: string;

  ngOnInit(): void {
    
    if(this.data.button == 'RESCHEDULE') {
      this.appointment = this.data.appointment;
    }else if(this.data.button == 'CANCEL') {
      this.appointmentId = this.data.appointment._id;
    }
  }
  onNoClick(type): void {
    this.dialogRef.close(type);
  }
  rescheduleAppointment() {
    this.http._rescheduleAppointment = this.appointment;
    this.dialogRef.close('success');
    this.router.navigate(['/', AppRoutes.USER_REG_S])
  }
  cancelAppointment() {
    console.log("cancel called");
    console.log(this.appointmentId);
    this.http.cancelAppointment(this.appointmentId).subscribe(res => {
        this.http.showToaster("Appointment Cancelled Successfully");
        this.dialogRef.close('success');
      },
      err => {
        console.log(err)
        // this.http.handleError(err.error?.message);
      })
    
  }
}
