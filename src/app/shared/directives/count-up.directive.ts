import { Directive, ElementRef, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { observeInView, unobserveInView } from '../util/in-view';
import { countUp } from '../util/count-up';

/**
 * Count-up hook. Add `appCountUp` to a number element whose text is the final
 * formatted value and whose `data-count` is the numeric target, e.g.
 * `<span appCountUp data-count="10000">10K+</span>`. It animates 0 → target
 * once when it scrolls into view (shares the one app IntersectionObserver).
 *
 * SSR/prerender-safe and reduced-motion-safe (the util no-ops to the final
 * value); the final formatted text always stays in the HTML for crawlers.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    if (!this.isBrowser) return;
    observeInView(this.el.nativeElement, (node) => countUp(node as HTMLElement));
  }

  ngOnDestroy(): void {
    if (this.isBrowser) unobserveInView(this.el.nativeElement);
  }
}
