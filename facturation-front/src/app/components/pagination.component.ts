import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <div class="pagination">
        <button class="page-btn" [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)">‹</button>
        @for (p of pages; track $index) {
          @if (p === -1) {
            <span class="page-dots">...</span>
          } @else {
            <button class="page-btn" [class.active]="p === currentPage" (click)="goToPage(p)">{{ p }}</button>
          }
        }
        <button class="page-btn" [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">›</button>
        <span class="page-info">{{ pageSize * (currentPage - 1) + 1 }}–{{ Math.min(pageSize * currentPage, totalItems) }} / {{ totalItems }}</span>
      </div>
    }
  `,
  styles: [`
    .pagination { display: flex; align-items: center; gap: 4px; margin-top: 15px; justify-content: center; }
    .page-btn {
      min-width: 32px; height: 32px; border: 1px solid #e2e8f0; background: #fff; border-radius: 6px;
      cursor: pointer; font-size: 0.85rem; color: #475569; display: flex; align-items: center; justify-content: center;
    }
    .page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
    .page-dots { padding: 0 4px; color: #94a3b8; }
    .page-info { font-size: 0.8rem; color: #64748b; margin-left: 10px; }
  `]
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number { return Math.ceil(this.totalItems / this.pageSize); }

  get pages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (this.currentPage > 3) pages.push(-1);
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(total - 1, this.currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (this.currentPage < total - 2) pages.push(-1);
      pages.push(total);
    }
    return pages;
  }

  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.pageChange.emit(p);
    }
  }

  protected Math = Math;
}
