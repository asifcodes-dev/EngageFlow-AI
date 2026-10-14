import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Minimal Prev/Next pager for admin tables ("Page X of Y"). */
@Component({
  selector: 'app-admin-pagination',
  standalone: true,
  template: `
    <div
      class="flex items-center justify-between border-t px-5 py-3"
      style="border-color: var(--au-line); background: var(--au-hover-row)"
    >
      <span class="text-[13px]" style="color: var(--au-muted)">
        Page {{ page }} of {{ totalPages }} · {{ total }} total
      </span>
      <div class="flex gap-1.5">
        <button
          type="button"
          [disabled]="page <= 1"
          (click)="pageChange.emit(page - 1)"
          class="au-page-btn"
        >
          Previous
        </button>
        <button
          type="button"
          [disabled]="page >= totalPages"
          (click)="pageChange.emit(page + 1)"
          class="au-page-btn"
        >
          Next
        </button>
      </div>
    </div>
  `,
})
export class AdminPaginationComponent {
  @Input() page = 1;
  @Input() pageSize = 20;
  @Input() total = 0;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }
}
