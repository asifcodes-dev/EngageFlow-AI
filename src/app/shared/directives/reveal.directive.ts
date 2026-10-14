import { Directive, ElementRef, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { observeInView, unobserveInView } from '../util/in-view';

/**
 * On-scroll reveal. Add `appReveal` to any element; it starts hidden
 * (opacity:0; translateY(20px) — see `.reveal` in styles.css, gated behind
 * `html.js` so prerendered/no-JS content stays visible) and transitions in
 * once when it enters the viewport, then stops observing (animate once).
 *
 * Stagger grouped children by also setting `[style.--i]="index"` in the
 * template — the CSS applies `transition-delay: calc(var(--i) * 90ms)`.
 *
 * Once the reveal transition finishes, `in-view-done` drops `will-change`
 * back to `auto` (see styles.css) so the element stops being a permanent GPU
 * compositor layer — otherwise every revealed element on the page (there can
 * be dozens across all the landing sections) stays promoted forever, which is
 * what makes later scrolling feel heavy/stuck even though nothing is
 * animating anymore.
 *
 * SSR/prerender-safe: the `.reveal` class is applied via host binding so it is
 * present in the static HTML, but the observer/listener only run in the browser.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { '[class.reveal]': 'true' },
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly onTransitionEnd = (event: TransitionEvent): void => {
    if (event.target === this.el.nativeElement) {
      this.el.nativeElement.classList.add('in-view-done');
      this.el.nativeElement.removeEventListener('transitionend', this.onTransitionEnd);
    }
  };

  ngOnInit(): void {
    if (!this.isBrowser) return;
    const node = this.el.nativeElement;
    observeInView(node, () => {
      node.classList.add('in-view');
      node.addEventListener('transitionend', this.onTransitionEnd);
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    unobserveInView(this.el.nativeElement);
    this.el.nativeElement.removeEventListener('transitionend', this.onTransitionEnd);
  }
}
