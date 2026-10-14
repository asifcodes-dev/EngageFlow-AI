import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-switch',
  imports: [CommonModule],
  template: `
    <label
      class="flex cursor-pointer select-none items-center gap-3 text-sm font-medium"
      [ngClass]="disabled ? 'pointer-events-none text-gray-400 opacity-60' : 'text-(--au-ink)'"
      (click)="handleToggle()"
    >
      <!-- Aurora 44×24 toggle (common au-toggle classes) -->
      <span class="au-toggle" [ngClass]="{ 'au-toggle-on': isChecked }"></span>
      {{ label }}
    </label>
  `,
})
export class SwitchComponent {
  @Input() label!: string;
  @Input() defaultChecked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() color: 'blue' | 'gray' = 'blue';

  @Output() valueChange = new EventEmitter<boolean>();

  isChecked: boolean = false;

  ngOnInit() {
    this.isChecked = this.defaultChecked;
  }

  handleToggle() {
    if (this.disabled) return;
    this.isChecked = !this.isChecked;
    this.valueChange.emit(this.isChecked);
  }

  get switchColors() {
    if (this.color === 'blue') {
      return {
        background: this.isChecked ? 'bg-brand-500' : 'bg-gray-200 dark:bg-white/10',
        knob: this.isChecked ? 'translate-x-full bg-white' : 'translate-x-0 bg-white',
      };
    } else {
      return {
        background: this.isChecked
          ? 'bg-gray-800 dark:bg-white/10'
          : 'bg-gray-200 dark:bg-white/10',
        knob: this.isChecked ? 'translate-x-full bg-white' : 'translate-x-0 bg-white',
      };
    }
  }
}
