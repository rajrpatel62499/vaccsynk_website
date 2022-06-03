import { Component, OnInit, Pipe } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notificationList:any[];
  isLoading=false;
  constructor(public http:HttpService) { }

  ngOnInit(): void {
       this.isLoading = true;
       this.http.notificationForPatient().subscribe(res=>{
       this.isLoading = false;
       this.notificationList = res;
        console.log('Notification For Patient', this.notificationList)
    }, err => {
      console.log(err)
      // this.http.handleError(err.error?.message);
    });

  }

 


}
