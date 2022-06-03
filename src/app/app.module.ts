import { ExternalAuthguardService } from './services/externalAuthguard.service';
import { environment } from './../environments/environment';
import { RegisterUserComponent } from './external/register-user/register-user.component';
import { HttpService } from './services/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RecaptchaFormsModule } from 'ng-recaptcha';
import { NgxCaptchaModule } from 'ngx-captcha';
import {
  MetaModule,
  MetaLoader,
  MetaStaticLoader,
  PageTitlePositioning,
} from '@ngx-meta/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { VerifyEmailIdComponent } from './modals/verify-email-id/verify-email-id.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgOtpInputModule } from 'ng-otp-input';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ReactiveFormsModule } from '@angular/forms';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { LoginUserComponent } from './external/login-user/login-user.component';
import { ForgotPasswordComponent } from './external/forgot-password/forgot-password.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { OtpVerificationComponent } from './external/otp-verification/otp-verification.component';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { RegisterCenterComponent } from './components/register-center/register-center.component';
import { RescheduleAppointmentComponent } from './modals/reschedule-appointment/reschedule-appointment.component';
import { UserRegistrationFormComponent } from './components/user-registration-form/user-registration-form.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { UserRegistration2Component } from './components/user-registration2/user-registration2.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ResetPasswordComponent } from './external/reset-password/reset-password.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { FilePickerModule } from 'ngx-awesome-uploader';

// import { S3UploaderModule } from 'ngx-s3-uploader';
import { MatRadioModule } from '@angular/material/radio';
import { SignaturePadModule } from 'angular2-signaturepad';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { AvatarModule } from 'ngx-avatar';
import { EditProfileInfoComponent } from './modals/edit-profile-info/edit-profile-info.component';
import { OnlynumericDirective } from './directives/onlynumeric.directive';
import { InputRestrictionDirective } from './directives/InputRestrictionDirective.directive';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ApplyForCovid19Component } from './modals/apply-for-covid19/apply-for-covid19.component';
import { FirstDoseDilogComponent } from './modals/first-dose-dilog/first-dose-dilog.component';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule,
} from 'ngx-ui-loader';
import { RegisterInvitedUserComponent } from './external/register-invited-user/register-invited-user.component';
import { OtpVerifyRegisterUserComponent } from './external/register-invited-user/otp-verify-register-user/otp-verify-register-user.component';
import { BookingTimingsComponent } from './components/booking-timings/booking-timings.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  // bgsColor: '#87cefa',
  // fgsColor: '#87cefa',
  // pbColor: '#87cefa'

  bgsColor: 'rgba(255,255,255,0)',
  bgsOpacity: 0.1,
  bgsPosition: 'bottom-right',
  bgsSize: 20,
  bgsType: 'ball-spin-clockwise',
  blur: 0,
  delay: 0,
  fastFadeOut: true,
  fgsColor: 'rgba(255,255,255,0)',
  fgsPosition: 'center-center',
  fgsSize: 20,
  fgsType: 'wandering-cubes',
  gap: 10,
  logoPosition: 'center-center',
  logoSize: 120,
  logoUrl: '',
  masterLoaderId: 'master',
  overlayBorderRadius: '0',
  overlayColor: 'rgba(255,255,255,0)',
  pbColor: '#87cefa',
  pbDirection: 'ltr',
  pbThickness: 4,
  hasProgressBar: true,
  text: '',
  textColor: '#FFFFFF',
  textPosition: 'center-center',
  maxTime: -1,
  minTime: 300,
};

export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: 'Tour of (lazy/busy) heroes',
    defaults: {
      title: 'Mighty mighty mouse',
      description: 'Mighty Mouse is an animated superhero mouse character',
      'og:image': '../assets/Og-Vaccsynk.jpg',
      'og:type': 'website',
      'og:locale': 'en_US',
      'og:locale:alternate': 'en_US,nl_NL,tr_TR',
    },
  });
}
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    RegisterUserComponent,
    MainComponent,
    VerifyEmailIdComponent,
    RegisterCenterComponent,
    AppLayoutComponent,
    LoginUserComponent,
    ForgotPasswordComponent,
    OtpVerificationComponent,
    AppointmentComponent,
    RescheduleAppointmentComponent,
    UserRegistrationFormComponent,
    UserRegistration2Component,
    ProfileDetailsComponent,
    ResetPasswordComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    EditProfileInfoComponent,
    OnlynumericDirective,
    InputRestrictionDirective,
    FeedbackFormComponent,
    NotificationsComponent,
    ApplyForCovid19Component,
    FirstDoseDilogComponent,
    RegisterInvitedUserComponent,
    OtpVerifyRegisterUserComponent,
    BookingTimingsComponent,
  ],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatTabsModule,
    FilePickerModule,
    AppRoutingModule,
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: metaFactory,
    }),
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    MatDialogModule,
    NgxScrollTopModule,
    NgOtpInputModule,
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    ReactiveFormsModule,
    // MatFormFieldModule
    SignaturePadModule,
    NgxCaptchaModule,
    MatCheckboxModule,
    BsDatepickerModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot(),
    DatepickerModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3000,
      progressAnimation: 'increasing',
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      progressBar: true,
    }),
    // S3UploaderModule.forRoot({
    //   region: environment.S3_REGION,
    //   bucket: environment.S3_BUCKET_NAME,
    //   credentials: { accessKeyId: environment.S3_ACCESS_KEY_ID, secretAccessKey: environment.S3_SECRET_ACCESS_KEY },
    // }),
    MatRadioModule,
    AvatarModule,
    GooglePlaceModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
  ],
  entryComponents: [VerifyEmailIdComponent, RescheduleAppointmentComponent],
  providers: [
    HttpService,
    ExternalAuthguardService,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
