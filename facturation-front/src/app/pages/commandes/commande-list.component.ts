import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommandeService } from '../../services/commande.service';
import { Commande } from '../../models/commande.model';
import { PaginationComponent } from '../../components/pagination.component';

@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Commandes</h2>
        <a routerLink="/commandes/new" class="btn btn-primary">+ Nouvelle Commande</a>
      </div>
      <div class="search-bar">
        <input type="text" [(ngModel)]="searchTerm" (input)="filterItems()" placeholder="Rechercher une commande..." class="search-input">
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Client</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Montant TTC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of paginatedItems; track item.id) {
              <tr>
                <td>{{ item.numero_commande }}</td>
                <td>{{ item.client?.nom || '—' }}</td>
                <td>{{ item.date_commande | date:'dd-MM-yyyy' }}</td>
                <td><span class="badge" [class]="'badge-' + item.statut">{{ item.statut }}</span></td>
                <td>{{ item.montant_ttc | number:'1.2-2' }} DH</td>
                <td class="actions">
                  <a [routerLink]="['/commandes', item.id]" class="btn btn-sm btn-view">Voir</a>
                  <a [routerLink]="['/commandes', item.id, 'edit']" class="btn btn-sm btn-edit">Modifier</a>
                  <button (click)="deleteItem(item.id!)" class="btn btn-sm btn-delete">Supprimer</button>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="6" class="empty">Aucune commande trouvée</td></tr>
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
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; }
    .badge-brouillon { background: #fef9c3; color: #a16207; }
    .badge-en_attente { background: #dbeafe; color: #1d4ed8; }
    .badge-valide { background: #dcfce7; color: #15803d; }
    .badge-annulee { background: #fee2e2; color: #b91c1c; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; text-decoration: none; display: inline-block; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-sm { padding: 5px 12px; font-size: 0.8rem; }
    .btn-view { background: #6366f1; color: #fff; }
    .btn-view:hover { background: #4f46e5; }
    .btn-edit { background: #f59e0b; color: #fff; }
    .btn-edit:hover { background: #d97706; }
    .btn-delete { background: #ef4444; color: #fff; }
    .btn-delete:hover { background: #dc2626; }
  `]
})
export class CommandeListComponent implements OnInit {
  items: Commande[] = [];
  filteredItems: Commande[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  get paginatedItems(): Commande[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  constructor(private service: CommandeService) {}

  ngOnInit(): void { this.loadItems(); }

  loadItems(): void {
    this.service.getCommandes().subscribe(data => { this.items = data; this.filteredItems = data; });
  }

  filterItems(): void {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(c =>
      c.numero_commande.toLowerCase().includes(term) || (c.client?.nom?.toLowerCase().includes(term) ?? false)
    );
  }

  deleteItem(id: number): void {
    if (confirm('Supprimer cette commande ?')) {
      this.service.deleteCommande(id).subscribe(() => this.loadItems());
    }
  }
}
