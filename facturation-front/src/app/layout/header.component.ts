import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header">
      <div class="header-title">
        <h2>{{ user?.role === 'admin' ? 'Administrateur' : 'Backoffice' }}</h2>
      </div>
      <div class="header-user">
        <span class="user-name">{{ user?.name }}</span>
        <button class="btn-logout" (click)="logout()">Déconnexion</button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 30px;
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
    }
    .header-title h2 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e3a5f;
    }
    .header-user {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: #0f172a;
    }
    .btn-logout {
      padding: 6px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #fff;
      color: #ef4444;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background: #fef2f2;
      border-color: #fecaca;
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
