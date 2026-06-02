import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { ToastService, Toast } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type">
          <span class="toast-icon">
            @if (toast.type === 'success') { ✓ }
            @else if (toast.type === 'error') { ✕ }
            @else if (toast.type === 'warning') { ⚠ }
            @else { ℹ }
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="removeToast(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
      border-radius: 8px;
      color: #fff;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .toast-success { background: #10b981; }
    .toast-error { background: #ef4444; }
    .toast-warning { background: #f59e0b; color: #1e293b; }
    .toast-info { background: #3b82f6; }
    .toast-icon { font-size: 1.2rem; flex-shrink: 0; }
    .toast-message { flex: 1; }
    .toast-close {
      background: none;
      border: none;
      color: inherit;
      font-size: 1.3rem;
      cursor: pointer;
      opacity: 0.7;
      padding: 0;
      line-height: 1;
      flex-shrink: 0;
    }
    .toast-close:hover { opacity: 1; }
    .removing {
      opacity: 0;
      transform: translateX(100%);
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription?: Subscription;
  private removalTimers: Map<number, any> = new Map();

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      const timer = setTimeout(() => this.removeToast(toast.id), 4000);
      this.removalTimers.set(toast.id, timer);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.removalTimers.forEach(timer => clearTimeout(timer));
  }

  removeToast(id: number): void {
    const timer = this.removalTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.removalTimers.delete(id);
    }
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
