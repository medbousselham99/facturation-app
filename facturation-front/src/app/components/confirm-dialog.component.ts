import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmService, ConfirmDialogData } from '../services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (data) {
      <div class="confirm-overlay" (click)="cancel()">
        <div class="confirm-dialog" (click)="$event.stopPropagation()">
          <h3 class="confirm-title">{{ data.title }}</h3>
          <p class="confirm-message">{{ data.message }}</p>
          <div class="confirm-actions">
            <button class="btn btn-cancel" (click)="cancel()">{{ data.cancelText || 'Annuler' }}</button>
            <button class="btn" [class.btn-danger]="data.type === 'danger'" [class.btn-warning]="data.type === 'warning'" (click)="confirm()">{{ data.confirmText || 'Confirmer' }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    .confirm-dialog {
      background: #fff;
      border-radius: 10px;
      padding: 30px;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    }
    .confirm-title {
      margin: 0 0 10px 0;
      font-size: 1.2rem;
      color: #1e293b;
    }
    .confirm-message {
      margin: 0 0 25px 0;
      color: #64748b;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn {
      padding: 9px 20px;
      border-radius: 6px;
      border: none;
      font-size: 0.9rem;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }
    .btn-cancel {
      background: #f1f5f9;
      color: #475569;
    }
    .btn-cancel:hover { background: #e2e8f0; }
    .btn-danger {
      background: #ef4444;
      color: #fff;
    }
    .btn-danger:hover { background: #dc2626; }
    .btn-warning {
      background: #f59e0b;
      color: #fff;
    }
    .btn-warning:hover { background: #d97706; }
  `]
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  data: ConfirmDialogData | null = null;
  private subscription?: Subscription;

  constructor(private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.subscription = this.confirmService.confirm$.subscribe(data => {
      this.data = data;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  confirm(): void {
    this.data?.onConfirm();
    this.confirmService.close();
  }

  cancel(): void {
    this.data?.onCancel?.();
    this.confirmService.close();
  }
}
