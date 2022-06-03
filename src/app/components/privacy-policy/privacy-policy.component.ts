import { Component, OnInit } from '@angular/core';
import { SECTION_IDS } from 'src/app/constants/ids';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor() { }


  sids = SECTION_IDS;
  ngOnInit(): void {
  }

}
