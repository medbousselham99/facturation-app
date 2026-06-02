import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FournisseurService } from '../../services/fournisseur.service';
import { Fournisseur } from '../../models/fournisseur.model';
import { PaginationComponent } from '../../components/pagination.component';

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Fournisseurs</h2>
        <a routerLink="/fournisseurs/new" class="btn btn-primary">+ Ajouter</a>
      </div>
      <div class="search-bar">
        <input type="text" [(ngModel)]="searchTerm" (input)="filterItems()" placeholder="Rechercher un fournisseur..." class="search-input">
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of paginatedItems; track item.id) {
              <tr>
                <td>{{ item.id }}</td>
                <td>{{ item.nom }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.telephone }}</td>
                <td>{{ item.ville }}</td>
                <td class="actions">
                  <a [routerLink]="['/fournisseurs', item.id, 'edit']" class="btn btn-sm btn-edit">Modifier</a>
                  <button (click)="deleteItem(item.id!)" class="btn btn-sm btn-delete">Supprimer</button>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="6" class="empty">Aucun fournisseur trouvé</td></tr>
            }
          </tbody>
        </table>
      </div>
      <app-pagination [currentPage]="currentPage" [pageSize]="pageSize" [totalItems]="filteredItems.length" (pageChange)="currentPage = $event"></app-pagination>
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-header h2 { margin: 0; color: #1e293b; }
    .search-bar { margin-bottom: 20px; }
    .search-input { width: 100%; max-width: 400px; padding: 10px 15px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; box-sizing: border-box; }
    .search-input:focus { outline: none; border-color: #3b82f6; }
    .table-container { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #f8fafc; text-align: left; padding: 12px 15px; font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
    .table td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9rem; }
    .table tr:hover td { background: #f8fafc; }
    .empty { text-align: center; color: #94a3b8; padding: 40px !important; }
    .actions { display: flex; gap: 8px; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; text-decoration: none; display: inline-block; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-sm { padding: 5px 12px; font-size: 0.8rem; }
    .btn-edit { background: #f59e0b; color: #fff; }
    .btn-edit:hover { background: #d97706; }
    .btn-delete { background: #ef4444; color: #fff; }
    .btn-delete:hover { background: #dc2626; }
  `]
})
export class FournisseurListComponent implements OnInit {
  items: Fournisseur[] = [];
  filteredItems: Fournisseur[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  get paginatedItems(): Fournisseur[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  constructor(private service: FournisseurService) {}

  ngOnInit(): void { this.loadItems(); }

  loadItems(): void {
    this.service.getFournisseurs().subscribe(data => { this.items = data; this.filteredItems = data; });
  }

  filterItems(): void {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(c =>
      c.nom.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || c.ville.toLowerCase().includes(term)
    );
  }

  deleteItem(id: number): void {
    if (confirm('Supprimer ce fournisseur ?')) {
      this.service.deleteFournisseur(id).subscribe(() => this.loadItems());
    }
  }
}
