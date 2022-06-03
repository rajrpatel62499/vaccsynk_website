import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/models/app-routes';
import { FirstDoseDilogComponent } from '../first-dose-dilog/first-dose-dilog.component';

@Component({
  selector: 'app-apply-for-covid19',
  templateUrl: './apply-for-covid19.component.html',
  styleUrls: ['./apply-for-covid19.component.scss']
})
export class ApplyForCovid19Component implements OnInit {

  isLoading=false;
  AppRoutes = AppRoutes;

  constructor( public router:Router,public dialog: MatDialog, public dialogRef: MatDialogRef<ApplyForCovid19Component>) { }

  ngOnInit(): void {
  }



  openDialogFirstDose() {
    this.dialogRef.close(true);
    // let dialogRef = this.dialog.open(FirstDoseDilogComponent, {
    //   width: '583px',
    //   data: {
        
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

}
