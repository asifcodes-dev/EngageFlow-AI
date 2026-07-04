import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats an integer paise amount as Indian rupees, e.g. 149900 → "₹1,499.00".
 * The single money-display point for admin views (the API always sends paise).
 */
@Pipe({ name: 'inrPaise', standalone: true })
export class InrPaisePipe implements PipeTransform {
  transform(paise: number | null | undefined): string {
    const rupees = (paise ?? 0) / 100;
    return `₹${rupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}
