import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, MatIconModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <mat-icon class="logo-icon">receipt_long</mat-icon>
        <h2>Facturation</h2>
      </div>
      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.path"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: item.exact ?? false}">
          <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background: var(--color-sidebar);
      color: var(--color-text-inverse);
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      z-index: 100;
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .sidebar-header h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .logo-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: var(--color-primary-light);
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      padding: 12px 0;
      gap: 2px;
    }
    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 24px;
      margin: 0 8px;
      border-radius: var(--radius-md);
      color: var(--color-text-muted);
      text-decoration: none;
      transition: all 0.15s ease;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .sidebar-nav a:hover {
      background: var(--color-sidebar-hover);
      color: var(--color-text-inverse);
    }
    .sidebar-nav a.active {
      background: var(--color-sidebar-active);
      color: #fff;
    }
    .nav-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class SidebarComponent {
  readonly navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', exact: true },
    { path: '/clients', label: 'Clients', icon: 'group' },
    { path: '/fournisseurs', label: 'Fournisseurs', icon: 'factory' },
    { path: '/devis', label: 'Devis', icon: 'description' },
    { path: '/commandes', label: 'Commandes', icon: 'shopping_cart' },
    { path: '/bons-de-commande', label: 'Bons de commande', icon: 'assignment' },
    { path: '/factures', label: 'Factures', icon: 'receipt' },
    { path: '/produits', label: 'Produits', icon: 'inventory_2' },
    { path: '/paiements', label: 'Paiements', icon: 'payments' },
    { path: '/avoirs', label: 'Avoirs', icon: 'undo' },
  ];
}
