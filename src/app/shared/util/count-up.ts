// Reusable count-up: animates an element's number from 0 → target over ~1.1s
// with an ease-out curve, using requestAnimationFrame. The element keeps its
// final formatted value in the HTML (so crawlers / no-JS see it); we read the
// numeric target from `data-count` and re-derive the display format (₹ prefix,
// thousands separators, K/L/Cr/%/s/+ suffixes) from that final text so the
// intermediate frames match the final formatting exactly.

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

interface NumberFormat {
  prefix: string;
  suffix: string;
  scale: number; // display divisor (K=1e3, L=1e5, M=1e6, Cr=1e7)
  decimals: number;
  grouping: boolean;
  locale: string;
}

/** Derive the display format from the final formatted text, e.g. "₹1,497",
 *  "10K+", "<3s", "98%", "+38". */
function parseFormat(finalText: string): NumberFormat {
  const match = finalText.match(/^(\D*?)([\d.,]+)(.*)$/s);
  const prefix = match?.[1] ?? '';
  const numStr = match?.[2] ?? '';
  const suffix = match?.[3] ?? '';

  const grouping = numStr.includes(',');
  const dot = numStr.indexOf('.');
  const decimals = dot >= 0 ? numStr.length - dot - 1 : 0;

  const s = suffix.replace(/^\s+/, '');
  let scale = 1;
  if (/^K/i.test(s)) scale = 1e3;
  else if (/^M/i.test(s)) scale = 1e6;
  else if (/^Cr/i.test(s)) scale = 1e7;
  else if (/^L/.test(s)) scale = 1e5; // Indian lakh

  const locale = prefix.includes('₹') || /^(L|Cr)/.test(s) ? 'en-IN' : 'en-US';
  return { prefix, suffix, scale, decimals, grouping, locale };
}

function render(value: number, f: NumberFormat): string {
  const n = value / f.scale;
  return (
    f.prefix +
    n.toLocaleString(f.locale, {
      minimumFractionDigits: f.decimals,
      maximumFractionDigits: f.decimals,
      useGrouping: f.grouping,
    }) +
    f.suffix
  );
}

/** Animate the element from 0 to `data-count`. No-op (leaves the final value)
 *  when reduced motion is requested or `data-count` is missing/invalid. */
export function countUp(el: HTMLElement, duration = 1100): void {
  const target = Number(el.dataset['count']);
  const finalText = (el.textContent ?? '').trim();
  if (!Number.isFinite(target)) return;
  if (prefersReducedMotion()) {
    el.textContent = finalText; // final state, no motion
    return;
  }

  const fmt = parseFormat(finalText);
  const start = performance.now();
  const tick = (now: number): void => {
    const p = Math.min(1, (now - start) / duration);
    el.textContent = p >= 1 ? finalText : render(target * easeOut(p), fmt);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
