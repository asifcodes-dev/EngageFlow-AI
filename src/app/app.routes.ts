import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';

/**
 * All routes are lazily loaded (`loadComponent`) so the initial bundle stays
 * small: a landing-page visitor never downloads the dashboard, and each
 * dashboard page is fetched on demand. Components are standalone, so no NgModule
 * wiring is needed.
 */
export const routes: Routes = [
  // public marketing landing page (no app chrome)
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent),
    title: 'EngageFlow AI — AI-Powered Instagram DM & Comment Automation',
  },
  // authenticated dashboard (sidebar + header shell)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('./shared/layout/app-layout/app-layout.component').then((m) => m.AppLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/dashboard/overview/overview.component').then((m) => m.OverviewComponent),
        title: 'Dashboard | EngageFlow AI',
      },

      // Engage (Instagram-gated)
      {
        path: 'flows',
        loadComponent: () =>
          import('./pages/dashboard/flows/flows.component').then((m) => m.FlowsComponent),
        title: 'Flows | EngageFlow AI',
      },
      {
        path: 'comment-guard',
        loadComponent: () =>
          import('./pages/dashboard/comment-guard/comment-guard.component').then(
            (m) => m.CommentGuardComponent,
          ),
        title: 'Comment Guard | EngageFlow AI',
      },
      {
        path: 'reply-studio',
        loadComponent: () =>
          import('./pages/dashboard/reply-studio/reply-studio.component').then(
            (m) => m.ReplyStudioComponent,
          ),
        title: 'Reply Studio | EngageFlow AI',
      },
      {
        path: 'audience',
        loadComponent: () =>
          import('./pages/dashboard/audience/audience.component').then((m) => m.AudienceComponent),
        title: 'Audience | EngageFlow AI',
      },
      {
        path: 'leads',
        loadComponent: () =>
          import('./pages/dashboard/leads/leads.component').then((m) => m.LeadsComponent),
        title: 'Leads | EngageFlow AI',
      },

      // Catalog
      {
        path: 'product-catalog',
        loadComponent: () =>
          import('./pages/dashboard/product-catalog/product-catalog.component').then(
            (m) => m.ProductCatalogComponent,
          ),
        title: 'Product Catalog | EngageFlow AI',
      },

      // Sell
      {
        path: 'store',
        loadComponent: () =>
          import('./pages/dashboard/store/store.component').then((m) => m.StoreComponent),
        title: 'Store | EngageFlow AI',
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./pages/dashboard/sales/sales.component').then((m) => m.SalesComponent),
        title: 'Sales | EngageFlow AI',
      },
      {
        path: 'earnings',
        loadComponent: () =>
          import('./pages/dashboard/earnings/earnings.component').then((m) => m.EarningsComponent),
        title: 'Earnings | EngageFlow AI',
      },

      // Insights
      {
        path: 'insights',
        loadComponent: () =>
          import('./pages/dashboard/insights/insights.component').then((m) => m.InsightsComponent),
        title: 'Insights | EngageFlow AI',
      },

      // Account
      {
        path: 'membership',
        loadComponent: () =>
          import('./pages/dashboard/membership/membership.component').then(
            (m) => m.MembershipComponent,
          ),
        title: 'Membership | EngageFlow AI',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/dashboard/settings/settings.component').then((m) => m.SettingsComponent),
        title: 'Settings | EngageFlow AI',
      },

      // Admin (platform owner only — server-enforced via RolesGuard, UI here)
      {
        path: 'admin',
        canActivate: [adminGuard],
        canActivateChild: [adminGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./pages/dashboard/admin/subscribers/admin-subscribers.component').then(
                (m) => m.AdminSubscribersComponent,
              ),
            title: 'Admin · Subscribers | EngageFlow AI',
          },
          {
            path: 'usage',
            loadComponent: () =>
              import('./pages/dashboard/admin/usage/admin-usage.component').then(
                (m) => m.AdminUsageComponent,
              ),
            title: 'Admin · Account Usage | EngageFlow AI',
          },
          {
            path: 'features',
            loadComponent: () =>
              import('./pages/dashboard/admin/features/admin-features.component').then(
                (m) => m.AdminFeaturesComponent,
              ),
            title: 'Admin · Feature Analytics | EngageFlow AI',
          },
          {
            path: 'subscribers/:id',
            loadComponent: () =>
              import('./pages/dashboard/admin/subscriber-detail/admin-subscriber-detail.component').then(
                (m) => m.AdminSubscriberDetailComponent,
              ),
            title: 'Admin · Subscriber | EngageFlow AI',
          },
        ],
      },

      // legacy paths → new homes
      { path: 'billing', redirectTo: 'membership', pathMatch: 'full' },
      { path: 'profile', redirectTo: 'settings', pathMatch: 'full' },
      { path: 'instagram', redirectTo: 'settings', pathMatch: 'full' },
    ],
  },
  // public marketing pages (header + footer chrome; reached from the nav)
  {
    path: 'features',
    loadComponent: () =>
      import('./pages/marketing/features-page.component').then((m) => m.FeaturesPageComponent),
    title: 'Features | EngageFlow AI',
  },
  {
    path: 'how-it-works',
    loadComponent: () =>
      import('./pages/marketing/how-it-works-page.component').then(
        (m) => m.HowItWorksPageComponent,
      ),
    title: 'How it works | EngageFlow AI',
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./pages/marketing/pricing-page.component').then((m) => m.PricingPageComponent),
    title: 'Pricing | EngageFlow AI',
  },
  // public legal pages (no app chrome)
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./pages/legal/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent,
      ),
    title: 'Privacy Policy | EngageFlow AI',
  },
  {
    path: 'terms-of-service',
    loadComponent: () =>
      import('./pages/legal/terms-of-service/terms-of-service.component').then(
        (m) => m.TermsOfServiceComponent,
      ),
    title: 'Terms of Service | EngageFlow AI',
  },
  {
    path: 'refund-policy',
    loadComponent: () =>
      import('./pages/legal/refund-policy/refund-policy.component').then(
        (m) => m.RefundPolicyComponent,
      ),
    title: 'Refund Policy | EngageFlow AI',
  },
  // public storefront (no app chrome; 404 state when the store is inactive)
  {
    path: 's/:slug',
    loadComponent: () =>
      import('./pages/public-store/public-store.component').then((m) => m.PublicStoreComponent),
    title: 'Store | EngageFlow AI',
  },
  // auth pages
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/auth-pages/sign-in/sign-in.component').then((m) => m.SignInComponent),
    title: 'Sign In | EngageFlow AI',
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/auth-pages/sign-up/sign-up.component').then((m) => m.SignUpComponent),
    title: 'Sign Up | EngageFlow AI',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/auth-pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
    title: 'Reset Password | EngageFlow AI',
  },
  // error pages
  {
    path: '**',
    loadComponent: () =>
      import('./pages/other-page/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page Not Found | EngageFlow AI',
  },
];
