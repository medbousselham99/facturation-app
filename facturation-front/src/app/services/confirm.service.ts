import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private confirmSubject = new Subject<ConfirmDialogData | null>();
  confirm$ = this.confirmSubject.asObservable();

  confirm(data: ConfirmDialogData): void {
    this.confirmSubject.next(data);
  }

  close(): void {
    this.confirmSubject.next(null);
  }
}
