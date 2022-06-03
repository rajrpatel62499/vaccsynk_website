import { AppRoutes } from './../../models/app-routes';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SECTION_IDS } from 'src/app/constants/ids';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isDropup = true;
  sids = SECTION_IDS;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  scrollTo(id: string) {
    // window.scroll(500,500);
    if( id == AppRoutes.PRIVACY_POLICY) {
      this.router.navigate([ AppRoutes.ROOT, AppRoutes.PRIVACY_POLICY]).then(res =>{
        setTimeout(()=>{document.getElementById(id)?.scrollIntoView({ behavior: 'smooth'});}, 100)
      });
    }
    if( id == AppRoutes.TERMS_CON) {
      this.router.navigate([ AppRoutes.ROOT, AppRoutes.TERMS_CON]).then(res =>{
        setTimeout(()=>{document.getElementById(id)?.scrollIntoView({ behavior: 'smooth'});}, 100)
      });
    }
    // if(this.router.url != `${AppRoutes.ROOT}${AppRoutes.PRIVACY_POLICY}` ) {
    //   // this.router.navigateByUrl()
    //   // setTimeout(()=>{
    //   //   document.getElementById(id)?.scrollIntoView({ behavior: 'smooth'});
    //   // },500);
    // } 
    // else if(this.router.url != `${AppRoutes.ROOT}${AppRoutes.TERMS_CON}` ) {
    //   this.router.navigate([ AppRoutes.ROOT, AppRoutes.TERMS_CON]);
    //   setTimeout(()=>{
    //     document.getElementById(id)?.scrollIntoView({ behavior: 'smooth'});
    //   },500);
    // } 
    // else {
    //   document.getElementById(id).scrollIntoView({ behavior: 'smooth'});
    // }
      // document.getElementById(id)?.scrollIntoView({ behavior: 'smooth'});
  }

  scrollTo1(id: string) {
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
