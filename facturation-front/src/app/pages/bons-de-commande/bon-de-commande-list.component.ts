import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BonDeCommandeService } from '../../services/bon-de-commande.service';
import { ToastService } from '../../services/toast.service';
import { BonDeCommande } from '../../models/bon-de-commande.model';
import { PaginationComponent } from '../../components/pagination.component';

@Component({
  selector: 'app-bon-de-commande-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Bons de Commande</h2>
        <a routerLink="/bons-de-commande/new" class="btn btn-primary">+ Nouveau BC</a>
      </div>
      <div class="search-bar">
        <input type="text" [(ngModel)]="searchTerm" (input)="filterItems()" placeholder="Rechercher un bon de commande..." class="search-input">
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>N° BC</th>
              <th>Fournisseur</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Montant TTC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of paginatedItems; track item.id) {
              <tr>
                <td>{{ item.numero_bc }}</td>
                <td>{{ item.fournisseur?.nom || '—' }}</td>
                <td>{{ item.date_bc | date:'dd-MM-yyyy' }}</td>
                <td><span class="badge" [class]="'badge-' + item.statut">{{ item.statut }}</span></td>
                <td>{{ item.montant_ttc | number:'1.2-2' }} DH</td>
                <td class="actions">
                  <a [routerLink]="['/bons-de-commande', item.id]" class="btn btn-sm btn-view">Voir</a>
                  <a [routerLink]="['/bons-de-commande', item.id, 'edit']" class="btn btn-sm btn-edit">Modifier</a>
                  <button (click)="deleteItem(item.id!)" class="btn btn-sm btn-delete">Supprimer</button>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="7" class="empty">Aucun bon de commande trouvé</td></tr>
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
    .badge-en_cours { background: #dbeafe; color: #1d4ed8; }
    .badge-livre { background: #dcfce7; color: #15803d; }
    .badge-annule { background: #fee2e2; color: #b91c1c; }
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
export class BonDeCommandeListComponent implements OnInit {
  items: BonDeCommande[] = [];
  filteredItems: BonDeCommande[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  get paginatedItems(): BonDeCommande[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  constructor(
    private service: BonDeCommandeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void { this.loadItems(); }

  loadItems(): void {
    this.service.getBonsDeCommande().subscribe({
      next: (data) => { this.items = data; this.filteredItems = data; },
      error: () => this.toastService.error('Erreur lors du chargement de la liste'),
    });
  }

  filterItems(): void {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(c =>
      c.numero_bc.toLowerCase().includes(term) || (c.fournisseur?.nom?.toLowerCase().includes(term) ?? false)
    );
  }

  deleteItem(id: number): void {
    if (confirm('Supprimer ce bon de commande ?')) {
      this.service.deleteBonDeCommande(id).subscribe({
        next: () => {
          this.toastService.success('Bon de commande supprimé.');
          this.items = this.items.filter(i => i.id !== id);
          this.filteredItems = this.filteredItems.filter(i => i.id !== id);
        },
        error: (err) => {
          const msg = err.error?.message || err.statusText || 'Erreur lors de la suppression';
          this.toastService.error(msg);
        }
      });
    }
  }
}
