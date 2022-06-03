import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { AppRoutes } from '../models/app-routes';

@Injectable({
  providedIn: 'root'
})
export class AppointmnentGuard implements CanActivate {
  
  constructor(
   private router: Router, private http: HttpService,) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (this.http.canScheduleAppointmentData()) {
        console.log('true')
        return true;
      } else {
        console.log('false')            
        // this.http.handleError("You are not allowed to schedule the appointment")
        this.router.navigate(['/', AppRoutes.APPOINTMENT])
        return false;
      }

      

  }
  
}
