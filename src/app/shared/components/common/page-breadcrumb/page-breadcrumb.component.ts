import { Component, Input } from '@angular/core';

/**
 * Aurora page eyebrow — the small uppercase label above a page H1
 * (e.g. "SELL / SALES"). `tone: 'violet'` for the admin section.
 */
@Component({
  selector: 'app-page-breadcrumb',
  standalone: true,
  imports: [],
  template: `
    <div [class.au-eyebrow]="tone === 'brand'" [class.au-eyebrow-violet]="tone === 'violet'">
      {{ pageTitle }}
    </div>
  `,
})
export class PageBreadcrumbComponent {
  @Input() pageTitle = '';
  @Input() tone: 'brand' | 'violet' = 'brand';
}
