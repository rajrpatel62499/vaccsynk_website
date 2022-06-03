import { SECTION_IDS } from 'src/app/constants/ids';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {

  sids = SECTION_IDS;
  constructor() { }

  ngOnInit(): void {
  }

}
