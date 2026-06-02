import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Facturation</h2>
      </div>
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
          <span class="nav-icon">📊</span> Dashboard
        </a>
        <a routerLink="/clients" routerLinkActive="active">
          <span class="nav-icon">👥</span> Clients
        </a>
        <a routerLink="/fournisseurs" routerLinkActive="active">
          <span class="nav-icon">🏭</span> Fournisseurs
        </a>
        <a routerLink="/devis" routerLinkActive="active">
          <span class="nav-icon">📋</span> Devis
        </a>
        <a routerLink="/commandes" routerLinkActive="active">
          <span class="nav-icon">📝</span> Commandes
        </a>
        <a routerLink="/bons-de-commande" routerLinkActive="active">
          <span class="nav-icon">📑</span> Bons de Commande
        </a>
        <a routerLink="/factures" routerLinkActive="active">
          <span class="nav-icon">💰</span> Factures
        </a>
        <a routerLink="/produits" routerLinkActive="active">
          <span class="nav-icon">📦</span> Produits
        </a>
        <a routerLink="/paiements" routerLinkActive="active">
          <span class="nav-icon">💳</span> Paiements
        </a>
        <a routerLink="/avoirs" routerLinkActive="active">
          <span class="nav-icon">↩️</span> Avoirs
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background: #1e293b;
      color: #fff;
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
    }
    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #334155;
    }
    .sidebar-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      padding: 10px 0;
    }
    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.2s;
      font-size: 0.9rem;
    }
    .sidebar-nav a:hover {
      background: #334155;
      color: #fff;
    }
    .sidebar-nav a.active {
      background: #3b82f6;
      color: #fff;
    }
    .nav-icon {
      font-size: 1.1rem;
    }
  `]
})
export class SidebarComponent {}
