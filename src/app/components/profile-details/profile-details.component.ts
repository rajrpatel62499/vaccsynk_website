import { EditProfileInfoComponent } from './../../modals/edit-profile-info/edit-profile-info.component';
import { AppRoutes } from './../../models/app-routes';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/models/user-profile';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  public userProfileData: UserProfile;
  isLoading=false;
  public AppRoutes = AppRoutes
  constructor(private _auth: AuthService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.isLoading=false;
    this._auth.getUserProfileData().subscribe((res:UserProfile) => {
      this.isLoading=true;
      console.log("User Data Fetched")
        // this.userProfileData = res;
        console.log(res);
        if(res) {
          this.userProfileData = res;
          this.isLoading=false;
        }
    })
  }

  editProfile() {
    let dialogRef = this.dialog.open(EditProfileInfoComponent, {
      width: '1000px',
      data : this.userProfileData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(result){
        this.userProfileData = result;
        this._auth.setUserProfileData(this.userProfileData);
      }
    });
  }


}
