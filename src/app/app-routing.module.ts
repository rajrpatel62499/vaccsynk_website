import { BookingTimingsComponent } from './components/booking-timings/booking-timings.component';
import { LoggedInGuard } from './services/logged-in.guard';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AppointmnentGuard } from './services/appointmnent.guard';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { ExternalAuthguardService } from './services/externalAuthguard.service';
import { AppRoutes } from './models/app-routes';
import { ResetPasswordComponent } from './external/reset-password/reset-password.component';
import { AuthGuard } from './services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import {  RegisterUserComponent } from './external/register-user/register-user.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { LoginUserComponent } from './external/login-user/login-user.component';
import { ForgotPasswordComponent } from './external/forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './external/otp-verification/otp-verification.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { UserRegistrationFormComponent } from './components/user-registration-form/user-registration-form.component';
import { UserRegistration2Component } from './components/user-registration2/user-registration2.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { FeedbackFormGuard } from './services/feedback-form.guard';
import { RegisterInvitedUserComponent } from './external/register-invited-user/register-invited-user.component';
import { OtpVerifyRegisterUserComponent } from './external/register-invited-user/otp-verify-register-user/otp-verify-register-user.component';

export const routes: Routes = [
  {
    path: AppRoutes.REGISTER,
    component: RegisterUserComponent,
    canActivate: [ExternalAuthguardService],
    data: { title: 'Register User' }
  },
  {
    path: `${AppRoutes.REGISTER}/invite/:facilityId`,
    component: RegisterInvitedUserComponent,
    canActivate: [ExternalAuthguardService],
    pathMatch: 'full',
    data: { title: 'Register Invited User' }
  },
  {
    path: `${AppRoutes.REGISTER}/${AppRoutes.INVITE}/:facilityId/${AppRoutes.OTP_VERIFY_INVITED_USER}`,
    component: OtpVerifyRegisterUserComponent,
    canActivate: [ExternalAuthguardService],
    pathMatch: 'full',
    data: { title: 'OTP verify register user' }
  },
  {
    path: AppRoutes.LOGIN,
    component: LoginUserComponent,
    canActivate: [ExternalAuthguardService],
    data: { title: 'Login User' }
  },
  {
    path: AppRoutes.FORGOT_PASS,
    component: ForgotPasswordComponent,
    canActivate: [ExternalAuthguardService],
    data: { title: 'Forgot Password' }
  },
  {
    path: AppRoutes.OTP_VERIFY,
    component: OtpVerificationComponent,
    canActivate: [ExternalAuthguardService],
    data: { title: 'OTP' }
  },
  {
    path: AppRoutes.RESET_PASS,
    component: ResetPasswordComponent,
    canActivate: [ExternalAuthguardService],
    data: { title: 'Reset Password' }
  },

  {
    path: '',
    component: AppLayoutComponent,
    // canActivateChild: [AuthGuard],
    children: [
      // { path: '', redirectTo: '', pathMatch: 'full' },
      {
        path: '',
        component: MainComponent,
        // canActivate: [ LoggedInGuard],
        data: { title: 'Main' }
      },
      {
        path: AppRoutes.APPOINTMENT,
        component: AppointmentComponent,
        canActivate: [AuthGuard],
        data: { title: 'Appointment' }
      },
      {
        path: AppRoutes.USER_REG_F,
        component: UserRegistrationFormComponent,
        canActivate: [AuthGuard,AppointmnentGuard],
        data: { title: 'User Registration Form' }
      },
      {
        path: AppRoutes.FEEDBACK_FORM,
        component: FeedbackFormComponent,
        canActivate: [AuthGuard],
        data: { title: 'Feedback Form' }
      },
      {
        path: AppRoutes.USER_REG_S,
        component: UserRegistration2Component,
        canActivate: [AuthGuard],
        data: { title: 'User Registration Form Two' }
      },
      {
        path: AppRoutes.BOOKING_TIMINGS,
        component: BookingTimingsComponent,
        canActivate: [AuthGuard],
        data: { title: 'Booking Timings' }
      },
      {
        path: AppRoutes.NOTIFICATION,
        component: NotificationsComponent,
        canActivate: [AuthGuard],
        data: { title: 'Notification' }
      },
      {
        path: AppRoutes.PROFILE,
        component: ProfileDetailsComponent,
        canActivate: [AuthGuard],
        data: { title: 'Profile' }
      },
      // {
      //   path: AppRoutes.REGISTER_CENTER,
      //   component: RegisterCenterComponent,
      //   data: { title: 'Register Center' }
      // },      
      {
        path: AppRoutes.PRIVACY_POLICY,
        component: PrivacyPolicyComponent,
        data: { title: 'Privacy Policy' }
      },
      {
        path: AppRoutes.TERMS_CON,
        component: TermsConditionsComponent,
        data: { title: 'Terms Conditions' }
      },
    ]
  },
  { path: '**', redirectTo: '/'}

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
