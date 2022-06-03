import { HttpService } from 'src/app/services/http.service';
import { AppRoutes } from './../models/app-routes';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs';
import { BackendResponse } from '../models/backend-response';
import { UserProfile } from '../models/user-profile';

@Injectable()
export class AuthService {

  private readonly apiEndpoint =  environment.ApiUrl;
  private _registerUrl = `${this.apiEndpoint}/api/patient/signup`;
  private _loginUrl = `${this.apiEndpoint}/api/patient/login`;

  
  // User Profile Url
  get userProfileUrl() {return this.apiEndpoint + '/api/patient/me'}
  private _userProfileData: BehaviorSubject<UserProfile> = new BehaviorSubject<UserProfile>(null);

  // private _userProfileData: BehaviorSubject<UserProfile> = new BehaviorSubject<UserProfile>(null);

  
  // private _canScheduleAppointmentData: BehaviorSubject<Boolean>=new BehaviorSubject <Boolean> (null);

  constructor(private http: HttpClient,
              private httpService: HttpService,
              private _router: Router) { }

  registerUser(user) {
    let payload: any = {
      "name":user.name, 
      "mobile":user.mobile,
      "email":user.email,
      "password":user.password
    }
    
    user.facilityId ? payload.facilityId = user.facilityId : ''; // sending facilityId for Invited user by facility

    return this.http.post<any>(this._registerUrl, payload)
  }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user)
  }

   // Profile data
   getUserProfile(): Observable<BackendResponse<UserProfile>>{
    const endpointUrl = this.userProfileUrl
    return this.http.get<BackendResponse<UserProfile>>(endpointUrl,this.requestHeaders);  
  }
  setUserProfileData(value: UserProfile) {
    this._userProfileData.next(value);
  }

  getUserProfileData(): Observable<UserProfile> {
    return this._userProfileData.asObservable();
  }

  // _canScheduleAppointmentData



  //  Utils

  logoutUser() {
    localStorage.removeItem('accessToken')
    this._router.navigate(['/', AppRoutes.LOGIN]);
    this.httpService.resetState();
  }

  getToken() {
    return localStorage.getItem('accessToken')
  }

  loggedIn() {
    return !!localStorage.getItem('accessToken')    
  }

  protected get requestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken(),
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*'
    });

    return { headers };
  }
}
