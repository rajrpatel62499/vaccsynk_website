import { AppRoutes } from 'src/app/models/app-routes';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private _authService: AuthService,
    private _router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this._authService.loggedIn()) {
        console.log('false');
        this._router.navigate([AppRoutes.APPOINTMENT]);
        return false;
      } else {
        console.log('true')            
        return true;
      }
  }
  
}
