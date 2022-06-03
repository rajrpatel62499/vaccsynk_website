import { HttpService } from 'src/app/services/http.service';
import { AppRoutes } from './../../models/app-routes';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SECTION_IDS } from 'src/app/constants/ids';
import { UserProfile } from 'src/app/models/user-profile';
import { environment } from 'src/environments/environment';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  disabled = true;
  
  navLinks = [
    // { path: `/${AppRoutes.USER_REG_F}`, label: "COVID-19 Conscent Form", img: 'assets/images/form.svg'},
    // { path: `/${AppRoutes.APPOINTMENT}`, label: "Appointment/Reminder", img: 'assets/images/reminder.svg'},
    // // { path: `/${AppRoutes.HISTORY}`, label: "History", img: 'assets/images/history.svg'},
    // { path: `/${AppRoutes.NOTIFICATION}`, label: "Notifications", img: 'assets/images/notification.svg'}
  ];
  public sids = SECTION_IDS;
  public AppRoutes = AppRoutes;
  isLoading=false;
  isCollapsed = true;
  public userProfileData: UserProfile;
  env = environment;
  constructor(private router: Router, public _auth: AuthService, public http: HttpService) {  }

  ngOnInit(): void {
    console.log(this._auth.loggedIn());
    
    this.setHeaderRoutes();
    
    this.getLoggedInUserData();
  }

  getLoggedInUserData() {
    this.isLoading=true;
    if(this._auth.loggedIn()) {
      this.isLoading=true;

      this._auth.getUserProfileData().subscribe(res => {
        this.isLoading=true;
        console.log("User Data Fetched")
        if (res) {
          this.userProfileData = res;
          this.isLoading=false;
        }
      })

    }
  }

  
  setHeaderRoutes() {
    this.isLoading=true;
    this.http.canScheduleStatus$.subscribe(res => {
      if (res === true) {
        this.navLinks = [
          { path: `/${AppRoutes.APPOINTMENT}`, label: "Appointment/Reminder", img: 'assets/images/reminder.svg'},
          // { path: `/${AppRoutes.HISTORY}`, label: "History", img: 'assets/images/history.svg'},
          { path: `/${AppRoutes.NOTIFICATION}`, label: "Notifications", img: 'assets/images/notification.svg'}
        ];
        this.isLoading = false;
        
      } else if (res === false){
        this.navLinks = [
          { path: `/${AppRoutes.FEEDBACK_FORM}`, label: "Feedback Form", img: 'assets/images/form.svg'},
          { path: `/${AppRoutes.APPOINTMENT}`, label: "Appointment/Reminder", img: 'assets/images/reminder.svg'},
          // { path: `/${AppRoutes.HISTORY}`, label: "History", img: 'assets/images/history.svg'},
          { path: `/${AppRoutes.NOTIFICATION}`, label: "Notifications", img: 'assets/images/notification-bells.svg'}
        ];
        this.isLoading = false;
      }
    })
  }

  // yourFn(event: MatTabChangeEvent){
  //   console.log(event);
  //  if(event.index==0){
  //   this.router.navigate([AppRoutes.ROOT, AppRoutes.USER_REG_F]);
  //  }
  //  else if(event.index==1){
  //   this.router.navigate([AppRoutes.ROOT, AppRoutes.APPOINTMENT]);
  //  }
  //  else if(event.index==3){
  //   this.router.navigate([AppRoutes.ROOT, AppRoutes.NOTIFICATION]);
  //  }
  // }

  scrollTo(id: string) {
    // window.scroll(500,500);
    if(this.router.url != '/') {
      this.router.navigate(['/']);
      setTimeout(()=>{
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth'});
      },0);
    } else {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth'});
    }
  }

}
