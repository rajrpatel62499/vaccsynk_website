import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Routes } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, finalize, tap } from 'rxjs/operators';
import { LayoutTypes } from '../models/enums';
import { HttpService } from '../services/http.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {

  layout = LayoutTypes.EXTERNAL;
  currentRoute: string;
  constructor(private _auth: AuthService, 
    private ngxUiLoaderService: NgxUiLoaderService,
    private _router: Router,private http: HttpService,) {
    // this.changeLayoutAccordingToRoute();
   }

  ngOnInit(): void {
    if(this._auth.loggedIn()) {
      this.setAppStateData();
    }

  }

  setAppStateData() {
    this.ngxUiLoaderService.startLoader('app-state-loader');

    forkJoin([
      this.http.getLatestDoseInfo().pipe(tap(x => this.http.setLatestDoseInfoData(x.dose))),
      this._auth.getUserProfile().pipe(tap(res => this._auth.setUserProfileData(res.data))),
      this.http.canScheduleAppointment().pipe(tap(res => this.http.setScheduleAppointmentData(res)))

    ]).pipe(finalize(() => {
       this.ngxUiLoaderService.stopLoader('app-state-loader');
    })).subscribe(console.log);


  }

  // changeLayoutAccordingToRoute() {
  //   this._router.events
  //   .pipe(
  //       filter(x => x instanceof NavigationEnd)
  //     )
  //     .subscribe((route: NavigationEnd) => {
  //       // console.log(this._router.getCurrentNavigation());
  //       this.currentRoute = route.url;
  //       if(this.currentRoute.startsWith("/")) this.currentRoute = this.currentRoute.substr(1, this.currentRoute.length);
        
  //       let currentAppRoute = routes[0].children.find(x => x.path == this.currentRoute);
  //       if(currentAppRoute.data?.layout == LayoutTypes.EXTERNAL) {
  //         this.layout = LayoutTypes.EXTERNAL;
  //       }else {
  //       this.layout = LayoutTypes.INTERNAL;
  //       }
  //       console.log(this.layout);
  //     })
  // }

}
