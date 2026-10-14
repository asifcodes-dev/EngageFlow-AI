import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';

type BadgeVariant = 'light' | 'solid';
type BadgeSize = 'sm' | 'md';
type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';

@Component({
  selector: 'app-badge',
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'light';
  @Input() size: BadgeSize = 'md';
  @Input() color: BadgeColor = 'primary';
  @Input() startIcon?: string; // SVG or HTML string
  @Input() endIcon?: string; // SVG or HTML string

  @HostBinding('class') get hostClasses(): string {
    // return `${this.baseStyles} ${this.sizeClass} ${this.colorStyles}`;
    return `flex`;
  }

  /** Aurora status pill (common `au-pill` classes); size only bumps the type. */
  get baseStyles() {
    return 'au-pill justify-center';
  }

  get sizeClass() {
    return {
      sm: '',
      md: 'text-xs',
    }[this.size];
  }

  get colorStyles() {
    const variants = {
      // "light" = the Aurora pastel pills (constant across themes, per handoff).
      light: {
        primary: 'au-pill-blue',
        success: 'au-pill-green',
        error: 'au-pill-red',
        warning: 'au-pill-amber',
        info: 'au-pill-blue',
        light: 'au-pill-grey',
        dark: 'au-pill-grey',
      },
      // "solid" = filled pills using the same Aurora status hues.
      solid: {
        primary: 'bg-[#1a5dab] text-white',
        success: 'bg-[#2d7a4f] text-white',
        error: 'bg-[#b3402f] text-white',
        warning: 'bg-[#a07a2c] text-white',
        info: 'bg-[#1a5dab] text-white',
        light: 'bg-gray-400 text-white',
        dark: 'bg-gray-700 text-white',
      },
    };
    return variants[this.variant][this.color];
  }
}
