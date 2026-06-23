import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './pages/auth-pages/reset-password/reset-password.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivacyPolicyComponent } from './pages/legal/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/legal/terms-of-service/terms-of-service.component';
import { RefundPolicyComponent } from './pages/legal/refund-policy/refund-policy.component';
import { authGuard } from './shared/guards/auth.guard';
import { OverviewComponent } from './pages/dashboard/overview/overview.component';
import { FlowsComponent } from './pages/dashboard/flows/flows.component';
import { CommentGuardComponent } from './pages/dashboard/comment-guard/comment-guard.component';
import { ReplyStudioComponent } from './pages/dashboard/reply-studio/reply-studio.component';
import { AudienceComponent } from './pages/dashboard/audience/audience.component';
import { LeadsComponent } from './pages/dashboard/leads/leads.component';
import { ProductCatalogComponent } from './pages/dashboard/product-catalog/product-catalog.component';
import { StoreComponent } from './pages/dashboard/store/store.component';
import { SalesComponent } from './pages/dashboard/sales/sales.component';
import { EarningsComponent } from './pages/dashboard/earnings/earnings.component';
import { InsightsComponent } from './pages/dashboard/insights/insights.component';
import { MembershipComponent } from './pages/dashboard/membership/membership.component';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';

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
        component: OverviewComponent,
        pathMatch: 'full',
        title: 'Dashboard | EngageFlow AI',
      },

      // Engage (Instagram-gated)
      { path: 'flows', component: FlowsComponent, title: 'Flows | EngageFlow AI' },
      {
        path: 'comment-guard',
        component: CommentGuardComponent,
        title: 'Comment Guard | EngageFlow AI',
      },
      {
        path: 'reply-studio',
        component: ReplyStudioComponent,
        title: 'Reply Studio | EngageFlow AI',
      },
      { path: 'audience', component: AudienceComponent, title: 'Audience | EngageFlow AI' },
      { path: 'leads', component: LeadsComponent, title: 'Leads | EngageFlow AI' },

      // Catalog
      {
        path: 'product-catalog',
        component: ProductCatalogComponent,
        title: 'Product Catalog | EngageFlow AI',
      },

      // Sell
      { path: 'store', component: StoreComponent, title: 'Store | EngageFlow AI' },
      { path: 'sales', component: SalesComponent, title: 'Sales | EngageFlow AI' },
      { path: 'earnings', component: EarningsComponent, title: 'Earnings | EngageFlow AI' },

      // Insights
      { path: 'insights', component: InsightsComponent, title: 'Insights | EngageFlow AI' },

      // Account
      { path: 'membership', component: MembershipComponent, title: 'Membership | EngageFlow AI' },
      { path: 'settings', component: SettingsComponent, title: 'Settings | EngageFlow AI' },

      // legacy paths → new homes
      { path: 'billing', redirectTo: 'membership', pathMatch: 'full' },
      { path: 'profile', redirectTo: 'settings', pathMatch: 'full' },
      { path: 'instagram', redirectTo: 'settings', pathMatch: 'full' },
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
