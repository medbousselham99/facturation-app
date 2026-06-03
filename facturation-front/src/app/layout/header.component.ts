import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <header class="header">
      <div class="header-breadcrumb">
        <mat-icon class="breadcrumb-icon">chevron_right</mat-icon>
        <span class="breadcrumb-label">{{ user?.role === 'admin' ? 'Administrateur' : 'Opérateur' }}</span>
      </div>
      <div class="header-user">
        <div class="user-avatar">{{ user?.name?.charAt(0)?.toUpperCase() }}</div>
        <div class="user-info">
          <span class="user-name">{{ user?.name }}</span>
          <span class="user-role">{{ user?.role === 'admin' ? 'Administrateur' : 'Backoffice' }}</span>
        </div>
        <button class="btn-logout" (click)="logout()" title="Déconnexion">
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 32px;
      height: 64px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }
    .header-breadcrumb {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
    }
    .breadcrumb-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .header-user {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
    }
    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text);
    }
    .user-role {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }
    .btn-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      color: var(--color-text-secondary);
      transition: all 0.15s ease;
      margin-left: 8px;
    }
    .btn-logout:hover {
      background: var(--color-danger-bg);
      border-color: var(--color-danger);
      color: var(--color-danger);
    }
    .btn-logout mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class HeaderComponent {
  user: any;

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getUser();
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.auth.clearSession();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.auth.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}
