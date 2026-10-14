// One shared IntersectionObserver for the whole app. Registers an element to
// run a callback ONCE the first time it scrolls into view, then unobserves it
// (animate-once). Used by both the reveal directive and the count-up directive
// so there is a single observer instance, not one per element.

type InViewCallback = (el: Element) => void;

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, InViewCallback>();

function ensureObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          observer!.unobserve(el);
          const cb = callbacks.get(el);
          callbacks.delete(el);
          cb?.(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
  }
  return observer;
}

/**
 * Run `cb` once when `el` first enters the viewport, then stop observing.
 * If IntersectionObserver is unavailable (very old browsers), the callback
 * runs immediately so content never stays hidden.
 */
export function observeInView(el: Element, cb: InViewCallback): void {
  const obs = ensureObserver();
  if (!obs) {
    cb(el);
    return;
  }
  callbacks.set(el, cb);
  obs.observe(el);
}

export function unobserveInView(el: Element): void {
  callbacks.delete(el);
  observer?.unobserve(el);
}
