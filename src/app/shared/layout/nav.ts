// Shared navigation model for the Aurora chrome. The desktop rail, the mobile
// drawer, the tablet pill-nav and the mobile bottom-tab bar all render from
// these definitions so the nav stays consistent across breakpoints.

export interface NavItem {
  name: string;
  icon: string; // inline stroke-SVG string (rendered via SafeHtmlPipe)
  path: string;
  /** Requires a connected Instagram account; shows a lock until then. */
  locked?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
  /** Rendered only for role=ADMIN (the platform owner); label tinted violet. */
  adminOnly?: boolean;
}

// ── Icons (1em stroke SVGs, Lucide/Feather equivalents) ─────────────────────
const ICON_HOME = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 3.25C4.26 3.25 3.25 4.26 3.25 5.5V9c0 1.24 1.01 2.25 2.25 2.25H9c1.24 0 2.25-1.01 2.25-2.25V5.5C11.25 4.26 10.24 3.25 9 3.25H5.5Zm0 9.5C4.26 12.75 3.25 13.76 3.25 15v3.5c0 1.24 1.01 2.25 2.25 2.25H9c1.24 0 2.25-1.01 2.25-2.25V15c0-1.24-1.01-2.25-2.25-2.25H5.5Zm7.25-7.25C12.75 4.26 13.76 3.25 15 3.25h3.5c1.24 0 2.25 1.01 2.25 2.25V9c0 1.24-1.01 2.25-2.25 2.25H15c-1.24 0-2.25-1.01-2.25-2.25V5.5Zm2.25 7.25c-1.24 0-2.25 1.01-2.25 2.25v3.5c0 1.24 1.01 2.25 2.25 2.25h3.5c1.24 0 2.25-1.01 2.25-2.25V15c0-1.24-1.01-2.25-2.25-2.25H15Z" fill="currentColor"/></svg>`;
const ICON_FLOWS = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M5 7h6M5 12h14M5 17h9M17 5l3 3-3 3"/></svg>`;
const ICON_GUARD = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3 4 6v6c0 4.5 3.4 7.6 8 9 4.6-1.4 8-4.5 8-9V6l-8-3Zm-2 9 1.5 1.5L15 10"/></svg>`;
const ICON_REPLY = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3a9 9 0 1 0 4.5 16.8L21 21l-1.2-4.5A9 9 0 0 0 12 3Zm-3 9h.01M12 12h.01M15 12h.01"/></svg>`;
const ICON_AUDIENCE = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 8v-1a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></svg>`;
const ICON_LEADS = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m1 0a2 2 0 1 1 6 0M9 14l2 2 4-4"/></svg>`;
const ICON_TAG = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v4.6c0 .5.2 1 .6 1.4l7.4 7.4a2 2 0 0 0 2.8 0l4.6-4.6a2 2 0 0 0 0-2.8L11 5.6c-.4-.4-.9-.6-1.4-.6H5a2 2 0 0 0-2 2Zm4 .5h.01"/></svg>`;
const ICON_STORE = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="m21 16-9 5-9-5V8l9-5 9 5v8ZM3 8l9 5 9-5M12 13v8"/></svg>`;
const ICON_CART = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>`;
const ICON_WALLET = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9m-4 4h.01"/></svg>`;
const ICON_CHART = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19V5m0 14h16M8 16v-4m4 4V8m4 8v-6"/></svg>`;
const ICON_CROWN = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="m3 7 4 4 5-6 5 6 4-4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z"/></svg>`;
const ICON_GEAR = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 7 19.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.7 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>`;
const ICON_ADMIN_USERS = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-1a4 4 0 0 0-5-3.87M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-1a3 3 0 1 0 0-6M2 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/></svg>`;
const ICON_ADMIN_PULSE = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12h4l2.5-7 5 14 2.5-7h4"/></svg>`;
const ICON_ADMIN_BOARD = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19V5m0 14h16M8 16V9m4 7V6m4 10v-4"/><circle cx="8" cy="7" r="1"/><circle cx="12" cy="4" r="1"/><circle cx="16" cy="10" r="1"/></svg>`;

export const NAV_GROUPS: NavGroup[] = [
  { label: 'Main', items: [{ name: 'Overview', icon: ICON_HOME, path: '/dashboard' }] },
  {
    label: 'Engage',
    items: [
      { name: 'Flows', icon: ICON_FLOWS, path: '/dashboard/flows', locked: true },
      { name: 'Comment Guard', icon: ICON_GUARD, path: '/dashboard/comment-guard', locked: true },
      { name: 'Reply Studio', icon: ICON_REPLY, path: '/dashboard/reply-studio', locked: true },
      { name: 'Audience', icon: ICON_AUDIENCE, path: '/dashboard/audience', locked: true },
      { name: 'Leads', icon: ICON_LEADS, path: '/dashboard/leads', locked: true },
    ],
  },
  {
    label: 'Catalog',
    items: [{ name: 'Product Catalog', icon: ICON_TAG, path: '/dashboard/product-catalog' }],
  },
  {
    label: 'Sell',
    items: [
      { name: 'Store', icon: ICON_STORE, path: '/dashboard/store' },
      { name: 'Sales', icon: ICON_CART, path: '/dashboard/sales' },
      { name: 'Earnings', icon: ICON_WALLET, path: '/dashboard/earnings' },
    ],
  },
  {
    label: 'Insights',
    items: [{ name: 'Insights', icon: ICON_CHART, path: '/dashboard/insights' }],
  },
  {
    label: 'Account',
    items: [
      { name: 'Membership', icon: ICON_CROWN, path: '/dashboard/membership' },
      { name: 'Settings', icon: ICON_GEAR, path: '/dashboard/settings' },
    ],
  },
  {
    label: 'Admin',
    adminOnly: true,
    items: [
      { name: 'Subscribers', icon: ICON_ADMIN_USERS, path: '/dashboard/admin' },
      { name: 'Account Usage', icon: ICON_ADMIN_PULSE, path: '/dashboard/admin/usage' },
      { name: 'Feature Analytics', icon: ICON_ADMIN_BOARD, path: '/dashboard/admin/features' },
    ],
  },
];
