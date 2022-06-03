import { AppRoutes } from './../models/app-routes';
import {Injectable} from '@angular/core';
import {Router, CanActivate, CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs';
import { AuthService } from './auth.service';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ExternalAuthguardService implements CanActivate, CanDeactivate<CanComponentDeactivate> {
    constructor(public router: Router, private _auth: AuthService) {
    }

    canActivate(): boolean {
        if (!this._auth.loggedIn()) {
            return true;
        } else {
            this.router.navigate([AppRoutes.ROOT]);
            return false;
        }
    }

    canDeactivate(component: CanComponentDeactivate) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        return !!token;
    }

}
