import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './pages/auth-pages/reset-password/reset-password.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ProductCatalogComponent } from './pages/dashboard/product-catalog/product-catalog.component';
import { BillingComponent } from './pages/dashboard/billing/billing.component';
import { InstagramConnectComponent } from './pages/dashboard/instagram/instagram-connect.component';
import { PrivacyPolicyComponent } from './pages/legal/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/legal/terms-of-service/terms-of-service.component';
import { RefundPolicyComponent } from './pages/legal/refund-policy/refund-policy.component';
import { authGuard } from './shared/guards/auth.guard';

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
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title: 'Dashboard | EngageFlow AI',
      },
      {
        path: 'product-catalog',
        component: ProductCatalogComponent,
        title: 'Product Catalog | EngageFlow AI',
      },
      {
        path: 'instagram',
        component: InstagramConnectComponent,
        title: 'Instagram | EngageFlow AI',
      },
      {
        path: 'billing',
        component: BillingComponent,
        title: 'Billing | EngageFlow AI',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile | EngageFlow AI',
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
