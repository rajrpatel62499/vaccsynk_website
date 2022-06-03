import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy  {
  title = 'vaccsynk-website';

  constructor(private readonly meta: MetaService) { }

  ngOnInit() {
    this.meta.setTag('og:image', '../assets/Og-Vaccsynk.jpg');
  }
  ngOnDestroy() {
     this.meta.removeTag('property="og:type"');
  }
}
