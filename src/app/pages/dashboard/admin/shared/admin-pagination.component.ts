import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Minimal Prev/Next pager for admin tables ("Page X of Y"). */
@Component({
  selector: 'app-admin-pagination',
  standalone: true,
  template: `
    <div class="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-gray-800">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Page {{ page }} of {{ totalPages }} · {{ total }} total
      </span>
      <div class="flex gap-2">
        <button
          type="button"
          [disabled]="page <= 1"
          (click)="pageChange.emit(page - 1)"
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-200 transition hover:bg-gray-50 disabled:opacity-40 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
        >
          Previous
        </button>
        <button
          type="button"
          [disabled]="page >= totalPages"
          (click)="pageChange.emit(page + 1)"
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-200 transition hover:bg-gray-50 disabled:opacity-40 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
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
