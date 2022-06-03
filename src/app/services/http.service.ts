import { DoseTypes } from 'src/app/models/enums';
import { UserProfile } from './../models/user-profile';
import { Appointment } from 'src/app/models/appointment';
import { VaccineCenter } from './../models/vaccine-center';
import { PharmacyRegisterForm } from './../models/pharmacy-register-form';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { debounceTime, map } from "rxjs/operators";
import { CovidConcentForm } from '../models/covid-consent-form';
import { Dose } from '../models/dose';
import { FormGroup } from '@angular/forms';
import { AppointmentReminder } from '../models/appointment-reminder';
import { FeedBackForm } from '../models/feedback-form';
import { BookingSetting } from '../models/booking-setting';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly apiEndpoint = environment.ApiUrl;
  public _rescheduleAppointment: Appointment;

  // patient api's
  private get patientRequestOtpUrl() { return this.apiEndpoint + "/api/patient/request-otp-forgot-password"}
  private get requestOtpForRegisterUrl() { return this.apiEndpoint + "/api/patient/request-otp"}
  private get patientVerifyOtpUrl() { return this.apiEndpoint + "/api/patient/verify-otp"}
  private get patientChangePasswordUrl() { return this.apiEndpoint + "/api/patient/forgot-password"}
  private get patientVacFormUrl() { return this.apiEndpoint + "/api/patient/vaccinationForm"}
  private get patientDoseUrl() { return this.apiEndpoint + "/api/patient/dose"}
  private get canScheduleAppointmentUrl() {return this.apiEndpoint + "/api/patient/canScheduleAppointment"}
  private get patientProfileUrl() { return this.apiEndpoint + "/api/patient/me"}
  private get patientAppointmentReminderUrl() { return this.apiEndpoint + "/api/patient/reminder"}
  private get updatePatientProfileUrl() { return this.apiEndpoint + "/api/patient/update-profile"}
  private get feedbackUrl() {return this.apiEndpoint + "/api/patient/feedback"}
  private get cancelPatientAppointmentUrl() { return this.apiEndpoint + "/api/patient/cancelAppointment"}
  private get reschedulePatientAppointmentUrl() { return this.apiEndpoint + "/api/patient/rescheduleAppointment"}

  // Vaccenter api's
  private get vacCenterUrl() { return this.apiEndpoint + "/api/vaccine-center"}
  private get vacCenterListUrl() { return this.apiEndpoint + "/api/patient/vaccine-center"}
  private get vacCenterRequestOtpUrl() { return this.apiEndpoint + "/api/vaccine-center/request-otp"}
  private get vacCenterVerifyOtpUrl() { return this.apiEndpoint + "/api/vaccine-center/verify-otp"}


  // Notification For Patient

  private get notificationForPatientUrl() {return this.apiEndpoint +"/api/patient/notifications"}


  //  Contact_Us Api's
  private get contactUsUrl(){ return this.apiEndpoint + "/api/user/contact-us"}

  // register user data
  private registerdUserSubject = new BehaviorSubject<any>(null);
  public registerdUser = this.registerdUserSubject.asObservable();

  updateRegisterUser(value) {
    this.registerdUserSubject.next(value);
  }

  getRegistedUser() {
    return this.registerdUserSubject.getValue();
  }
  // public mobileNoSubject: BehaviorSubject<any> = new BehaviorSubject<any>("");

  constructor(public http: HttpClient, public _toastr: ToastrService) { }


  postData(url, payload, isLoading?: boolean) {
    
    let formData: FormData = this.jsonToFormData(payload);
    return this.http.post<any>(this.apiEndpoint + url, formData, {reportProgress: isLoading});
  }

  postFirstDoseDetials(payload: any) {
    const endpointUrl = this.apiEndpoint + "/api/patient/addDose";
    return this.http.post<any>(endpointUrl, payload);
  }
  
  // VacCenter API's
  requestOtpForVacCenter(payload): Observable<any> {
    const endpointUrl = `${this.vacCenterRequestOtpUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }
  
  verifyOtpForVacCenter(payload): Observable<any> {
    const endpointUrl = `${this.vacCenterVerifyOtpUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }

  postPharmacyForm(payload: PharmacyRegisterForm): Observable<any> {
    const endpointUrl = `${this.vacCenterUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }

  postCovidVaccineForm(payload: CovidConcentForm) {
    const endpointUrl = `${this.patientVacFormUrl}`;
    // let formData: FormData = this.jsonToFormData(payload);
    let formData: FormData = this.jsonToFormData(payload);
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
    }
    return this.http.post<any>(endpointUrl, formData);
  }
 
  getVaccineCenters(search? : string): Observable<VaccineCenter[]> {
    const endpointUrl = `${this.vacCenterListUrl}`;
    let params = new HttpParams();
    if(search) { params = params.append("search", search.toString())}
    return this.http.get<any>(endpointUrl, {params: params} ).pipe(
      map(res =>res.data)
    );
  }

  private get vaccineCenterForInviationUrl() { return this.apiEndpoint + "/api/facility/vaccinecentersForInvitation"}

  getVaccinecenterForInvitation(facilityId): Observable<BookingSetting[]> {
    const endpointUrl = `${this.vaccineCenterForInviationUrl}/${facilityId}`;
    return this.http.get<any>(endpointUrl).pipe(
      map(res =>res.data)
    );
  }

  contactUs(payload:{name:string,email:string,message:string}): Observable<any>{
    const endpointUrl = `${this.contactUsUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }



  feedBackUs(payload:FeedBackForm): Observable<any>{
    const endpointUrl = `${this.feedbackUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }



  // Patient API's
  requestOtpForPatient(payload:{mobile:string}): Observable<any> {
    const endpointUrl = `${this.patientRequestOtpUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }
  
  requestOtpForRegister(payload:{mobile:string}): Observable<any> {
    const endpointUrl = `${this.requestOtpForRegisterUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }
  
  verifyOtpForPatient(payload:{code:string,mobile:string}): Observable<any> {
    const endpointUrl = `${this.patientVerifyOtpUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }
  
  patientChangePassword(payload:{mobile:string,password:string}): Observable<any> {
    const endpointUrl = `${this.patientChangePasswordUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }

  canScheduleAppointment(): Observable<boolean>{
    const endpointUrl =`${this.canScheduleAppointmentUrl}`
    return this.http.get<any>(endpointUrl).pipe(
      map(res =>res.data.data),
    );
  }


  getAppointmentDetails(): Observable<Appointment[]> {
    const endpointUrl = `${this.patientVacFormUrl}`;
    return this.http.get<any>(endpointUrl).pipe(
      map(res =>res.data)
    );
  }

  getLatestDoseInfo() {
    const endpointUrl = this.apiEndpoint +  '/api/patient/latestDose';
    return this.http.get<any>(endpointUrl).pipe(
      map(res =>res.data)
    );
  }

  notificationForPatient(){
    const endpointUrl = `${this.notificationForPatientUrl}`;
    return this.http.get<any>(endpointUrl).pipe(
      map(res =>res.data)
    );
  }
  
  
  cancelAppointment(appointmentId) {
    const endpointUrl = `${this.cancelPatientAppointmentUrl}/${appointmentId}`;
    return this.http.post<any>(endpointUrl, {});
  }
  
  rescheduleAppointmentById(appointmentId, payload: {scheduleDate: string, scheduleTime: string, vaccineCenterId: string }) {
    const endpointUrl = `${this.reschedulePatientAppointmentUrl}/${appointmentId}`;
    return this.http.post<any>(endpointUrl, payload);
  }
  
  getPatientAppointmentReminder(): Observable<AppointmentReminder[]> {
    const endpointUrl = `${this.patientAppointmentReminderUrl}`;
    return this.http.get<any>(endpointUrl).pipe(
      map(res =>res.data)
    );
    
  }
  
  getDoses(): Observable<Dose[]> {
    const endpointUrl = `${this.patientDoseUrl}`;
    return this.http.get<any>(endpointUrl).pipe(
      map(res =>res.data)
      );
    }
    
  updatePatientProfile(payload: UserProfile) {
    delete payload._id;
    const endpointUrl = `${this.updatePatientProfileUrl}`;
    return this.http.post<UserProfile>(endpointUrl, payload);
  }

  // getProfile(): Observable<UserProfile> {
  //   const endpointUrl = `${this.patientProfileUrl}`;
  //   return this.http.get<any>(endpointUrl).pipe(
  //     map(res =>res.data)
  //   );
  // }
  

  
  // Util Services
  
  private _covidForm: FormGroup;
  private _mobileNo; 

  storeCovidForm(covidForm: FormGroup){
    this._covidForm = covidForm;
  }
  loadCovidForm() {
    return this._covidForm;
  }
  storeMobileNo(mobileNo: string){
    this._mobileNo = mobileNo;
  }
  loadMobileNo() {
    return this._mobileNo;
  }

  resetState() {
    this._covidForm = null;
    this._mobileNo = null;
  }

  private _canScheduleAppointmentSubject = new BehaviorSubject<boolean>(null);
  public canScheduleStatus$ = this._canScheduleAppointmentSubject.asObservable();
  setScheduleAppointmentData(value:boolean){
    // this._canScheduleAppointmentData.next(value);
    this._canScheduleAppointmentSubject.next(value);
  }
  canScheduleAppointmentData(): boolean {
    return this._canScheduleAppointmentSubject.getValue();
  }
  private _latestDoseInfoSubj = new BehaviorSubject<string>(null);
  public latestDoseInfo$ = this._latestDoseInfoSubj.asObservable();
  
  setLatestDoseInfoData(value:string){
    this._latestDoseInfoSubj.next(value);
  }
  getLatestDoseInfoData(): string {
    return this._latestDoseInfoSubj.getValue();
  }

  showToaster(message:string, toastrType:string='success') {
    switch (toastrType) {
      case "success":
        setTimeout(() => this._toastr.success(message, "Success!"));
        break;
      case "error":
        setTimeout(() => this._toastr.error(message, ""));
        break;
      case "warning":
        setTimeout(() => this._toastr.warning(message, "Warning!"));
        break;
      case "info":
        setTimeout(() => this._toastr.info(message, "Info!"));
        break;
    }
  }

  handleError(msg:string) {
    this.showToaster(msg, 'error');
  }

  public jsonToFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => {
      if(object[key] instanceof Object ){
        console.log(typeof object[key], key, object[key])
        if(object[key] instanceof File) {
          console.log(typeof object[key], key, object[key])
          formData.append(key,object[key]);
          // let file = this.base64ToFile(object[key], key);
          // formData.append(key,file);
        }else {
          console.log(typeof object[key], key, object[key])
          formData.append(key, JSON.stringify(object[key]));
        }
      }else {
        console.log(typeof object[key], key, object[key])
        formData.append(key,object[key]);
      }
    });
    return formData;
  }

  public base64ToFile(dataURI:string, fileName: string): File {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ext = '.' + mimeString.split('/')[1];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ia], {type:mimeString});
    var file: File = new File([blob], fileName + ext , {
      type: blob.type
    });
    return file
  } 

  public base64ToBlob(dataURI:string) {

    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  public fileObjToBase64(file: File) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (_event) =>{
      console.log(reader.result);
      return reader.result;
    }
  }

  public isNullOrEmpty(item) {
    if (item == null || item == '' || item == undefined) {
      return true;
    } else {
      return false;
    }
  }

  // private readonly _ImgFiles: { [formControl:string ]: File}
  // storeFiles(formControl, img: File) {
  //   this._ImgFiles[formControl] = img;
  // }

  // getFiles() {
  //   return this._ImgFiles;
  // }

}
