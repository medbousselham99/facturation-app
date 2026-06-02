import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new Subject<Toast>();
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(message: string, type: Toast['type'] = 'info'): void {
    this.toastsSubject.next({ id: ++this.counter, message, type });
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error'); }
  warning(message: string): void { this.show(message, 'warning'); }
  info(message: string): void { this.show(message, 'info'); }
}
