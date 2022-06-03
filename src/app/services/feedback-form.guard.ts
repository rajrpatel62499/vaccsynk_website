import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppRoutes } from '../models/app-routes';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackFormGuard implements CanActivate {
  constructor(
    private router: Router, private http: HttpService,) {
   }
  async canActivate() {
    
      console.log(this.http.canScheduleAppointmentData())
      // const canSchedule = await this.http.canScheduleAppointment().toPromise<boolean>().then();
      const canSchedule = this.http.canScheduleAppointmentData();
      console.log(canSchedule);
      
    if (canSchedule === true) {
      // don't allow user to access to feedback form | because user have not filled the vaccination form yet.
      this.router.navigate([AppRoutes.APPOINTMENT])
      console.log("Don't have access to feedback form")
      return false;
    } else if (canSchedule === false){
      console.log("have access to feedback form")
      // allow user | because user can schedule appointment => that meanse user have not submitted the form yet => means we don't have user vac form data yet.
      return true;
    }

  }
  
}
