# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TailAdmin Angular (`ng-tailadmin`) — a free admin dashboard template built with **Angular 21**, **Tailwind CSS v4**, and **TypeScript**. It is a static, presentational template: there is no backend, no HttpClient, and all chart/table data is hardcoded inside component classes. This repo is the *free* edition, so many pages referenced in the README changelog (AI, Maps, Vector Maps, extra dashboards) are PRO-only and not present here.

## Commands

```bash
npm start            # ng serve — dev server at http://localhost:4200
npm run build        # ng build — production build by default (output: dist/ng-tailadmin)
npm run watch        # ng build --watch --configuration development
npm test             # ng test — Karma + Jasmine (headless Chrome)
npm run lint         # ng lint — ESLint (angular-eslint) over src/**/*.{ts,html}
npm run format       # prettier --write over src/**/*.{ts,html,css}
npm run format:check # prettier --check (CI-friendly; fails on unformatted files)
```

Requires Node `^20.19.0 || ^22.12.0 || >=24` (see `engines` in [package.json](package.json) / [.nvmrc](.nvmrc)).

`ng lint` currently reports many pre-existing findings in the template code (accessibility, `no-explicit-any`, unused imports, inferrable types) — the linter is correctly configured; the template just predates these rules. Config lives in [eslint.config.js](eslint.config.js), which also extends `eslint-config-prettier` so ESLint and Prettier don't fight over formatting. Prettier config: [.prettierrc](.prettierrc) (single quotes, 100 print width). All of `src/` is already Prettier-formatted — keep it that way.

Run a single test file (no `.spec.ts` files currently exist in the repo, but the harness is configured):

```bash
ng test --include='**/my.component.spec.ts'
```

Requires Node.js 20.x+. Angular CLI is used directly via `ng` (installed locally as a dev dependency).

## Architecture

**Standalone, no NgModules.** The app bootstraps via `bootstrapApplication(AppComponent, appConfig)` in [src/main.ts](src/main.ts). Every component uses `standalone: true` with explicit `imports`. Swiper custom elements are registered globally in `main.ts` before bootstrap.

**App config** ([src/app/app.config.ts](src/app/app.config.ts)) provides only zone change detection (with `eventCoalescing`) and `provideRouter(routes)`. There is no HTTP, store, or interceptor wiring.

**Routing** ([src/app/app.routes.ts](src/app/app.routes.ts)) has two zones:
- Dashboard pages are **children of `AppLayoutComponent`** (sidebar + header chrome).
- Auth pages (`/signin`, `/signup`) and the `**` 404 fallback render standalone, outside the layout.
- Note: some sidebar nav links point to paths not defined in the routes (e.g. `/error-404`) and will fall through to the 404 page.

**Layout shell** ([src/app/shared/layout/](src/app/shared/layout/)) — `AppLayoutComponent` composes `AppHeaderComponent`, `AppSidebarComponent`, `BackdropComponent`, and a `<router-outlet>`. Sidebar expand/collapse/hover/mobile state is driven entirely by `SidebarService`.

**State management is plain RxJS `BehaviorSubject` services** in [src/app/shared/services/](src/app/shared/services/) — there is no NgRx/Signals store:
- `ThemeService` — light/dark mode; persists to `localStorage` and toggles the `dark` class on `document.documentElement`.
- `SidebarService` — `isExpanded$` / `isMobileOpen$` / `isHovered$`.
- `ModalService` — global modal open/close state.

**Component organization** under [src/app/](src/app/):
- `pages/` — route-level page components (one per route). These are thin and mostly compose shared components.
- `shared/components/ui/` — design-system primitives (`button`, `badge`, `alert`, `avatar`, `dropdown`, `modal`, `table`).
- `shared/components/{form,charts,cards,tables,ecommerce,invoice,header,...}/` — larger reusable building blocks.
- `shared/components/common/` — cross-cutting widgets (breadcrumb, component-card wrapper, theme toggles, chart tabs).

**Charts** use ApexCharts via `ng-apexcharts`; `apexcharts.min.js` is loaded as a global script in [angular.json](angular.json). amCharts5 is also a dependency (used by PRO map pages). Chart options and series are defined as typed public fields on the component class (see [monthly-sales-chart.component.ts](src/app/shared/components/ecommerce/monthly-sales-chart/monthly-sales-chart.component.ts) as the canonical pattern).

**Icons** are inline SVG markup stored as strings and rendered through the `SafeHtmlPipe` ([src/app/shared/pipe/safe-html.pipe.ts](src/app/shared/pipe/safe-html.pipe.ts), which calls `bypassSecurityTrustHtml`). The sidebar nav items are the main example — each `NavItem.icon` is a raw SVG string.

## Styling

Tailwind CSS v4 is configured **entirely in CSS**, not JavaScript — there is no `tailwind.config.js`. All theme customization lives in [src/styles.css](src/styles.css) via `@import "tailwindcss"` and the `@theme { ... }` block: custom `brand-*` color scale, `title-*` text sizes, extra breakpoints (`2xsm`, `xsm`, `3xl`), the Outfit font, and dark mode through `@custom-variant dark (&:is(.dark *))`. PostCSS uses `@tailwindcss/postcss` ([.postcssrc.json](.postcssrc.json)). When adding design tokens, edit `@theme` in `styles.css`.

## Conventions

- Component selector prefix is `app-` (configured in `angular.json`).
- TypeScript is in `strict` mode and Angular `strictTemplates` is enabled ([tsconfig.json](tsconfig.json)) — type templates and inputs accordingly.
- No path aliases; use relative imports.
- Production build budgets are enforced: initial bundle warns at 4mb / errors at 5mb; per-component styles warn at 4kb / error at 8kb. The production config also disables source maps and enables subresource integrity + license extraction.
- New components default to `OnPush` change detection and `.css` styles (configured under `schematics` in [angular.json](angular.json)).
- Environment config lives in [src/environments/](src/environments/); `environment.ts` is the production file, swapped for `environment.development.ts` via `fileReplacements` in the development build.
