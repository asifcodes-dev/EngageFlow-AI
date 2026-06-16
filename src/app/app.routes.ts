import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './pages/auth-pages/reset-password/reset-password.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivacyPolicyComponent } from './pages/legal/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/legal/terms-of-service/terms-of-service.component';
import { RefundPolicyComponent } from './pages/legal/refund-policy/refund-policy.component';

export const routes: Routes = [
  // public marketing landing page (no app chrome)
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
    title: 'EngageFlow AI — AI-Powered Instagram DM & Comment Automation',
  },
  // authenticated dashboard (sidebar + header shell)
  {
    path: 'dashboard',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title: 'Dashboard | EngageFlow AI',
      },
      {
        path: 'calendar',
        component: CalenderComponent,
        title: 'Calendar | EngageFlow AI',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile | EngageFlow AI',
      },
      {
        path: 'form-elements',
        component: FormElementsComponent,
        title: 'Form Elements | EngageFlow AI',
      },
      {
        path: 'basic-tables',
        component: BasicTablesComponent,
        title: 'Basic Tables | EngageFlow AI',
      },
      {
        path: 'blank',
        component: BlankComponent,
        title: 'Blank Page | EngageFlow AI',
      },
      // support tickets
      {
        path: 'invoice',
        component: InvoicesComponent,
        title: 'Invoice Details | EngageFlow AI',
      },
      {
        path: 'line-chart',
        component: LineChartComponent,
        title: 'Line Chart | EngageFlow AI',
      },
      {
        path: 'bar-chart',
        component: BarChartComponent,
        title: 'Bar Chart | EngageFlow AI',
      },
      {
        path: 'alerts',
        component: AlertsComponent,
        title: 'Alerts | EngageFlow AI',
      },
      {
        path: 'avatars',
        component: AvatarElementComponent,
        title: 'Avatars | EngageFlow AI',
      },
      {
        path: 'badge',
        component: BadgesComponent,
        title: 'Badges | EngageFlow AI',
      },
      {
        path: 'buttons',
        component: ButtonsComponent,
        title: 'Buttons | EngageFlow AI',
      },
      {
        path: 'images',
        component: ImagesComponent,
        title: 'Images | EngageFlow AI',
      },
      {
        path: 'videos',
        component: VideosComponent,
        title: 'Videos | EngageFlow AI',
      },
    ],
  },
  // public legal pages (no app chrome)
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    title: 'Privacy Policy | EngageFlow AI',
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent,
    title: 'Terms of Service | EngageFlow AI',
  },
  {
    path: 'refund-policy',
    component: RefundPolicyComponent,
    title: 'Refund Policy | EngageFlow AI',
  },
  // auth pages
  {
    path: 'signin',
    component: SignInComponent,
    title: 'Sign In | EngageFlow AI',
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Sign Up | EngageFlow AI',
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Reset Password | EngageFlow AI',
  },
  // error pages
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Page Not Found | EngageFlow AI',
  },
];
