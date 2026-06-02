import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AvoirService } from '../../services/avoir.service';
import { Avoir } from '../../models/avoir.model';
import { PaginationComponent } from '../../components/pagination.component';

@Component({
  selector: 'app-avoir-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Avoirs</h2>
        <a routerLink="/avoirs/new" class="btn btn-primary">+ Nouveau</a>
      </div>

      <div class="search-bar">
        <input type="text" [(ngModel)]="searchTerm" (input)="filterItems()" placeholder="Rechercher un avoir..." class="search-input">
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Facture</th>
              <th>Client</th>
              <th>Date</th>
              <th>Montant TTC</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of paginatedItems; track item.id) {
              <tr>
                <td>{{ item.numero_avoir }}</td>
                <td>{{ item.facture_id }}</td>
                <td>{{ item.client?.nom || '—' }}</td>
                <td>{{ item.date_avoir | date:'dd-MM-yyyy' }}</td>
                <td>{{ item.montant_ttc | number:'1.2-2' }} DH</td>
                <td><span class="badge" [class]="'badge-' + item.statut">{{ item.statut }}</span></td>
                <td class="actions">
                  <a [routerLink]="['/avoirs', item.id]" class="btn btn-sm btn-view">Voir</a>
                  <button (click)="deleteItem(item.id!)" class="btn btn-sm btn-delete">Supprimer</button>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="7" class="empty">Aucun avoir trouvé</td></tr>
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
    .badge-emis { background: #dbeafe; color: #1d4ed8; }
    .badge-utilise { background: #dcfce7; color: #15803d; }
    .badge-annule { background: #f1f5f9; color: #64748b; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; text-decoration: none; display: inline-block; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-sm { padding: 5px 12px; font-size: 0.8rem; }
    .btn-view { background: #6366f1; color: #fff; }
    .btn-view:hover { background: #4f46e5; }
    .btn-delete { background: #ef4444; color: #fff; }
    .btn-delete:hover { background: #dc2626; }
  `]
})
export class AvoirListComponent implements OnInit {
  items: Avoir[] = [];
  filteredItems: Avoir[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  get paginatedItems(): Avoir[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  constructor(private service: AvoirService) {}

  ngOnInit(): void { this.loadItems(); }

  loadItems(): void {
    this.service.getAvoirs().subscribe(data => { this.items = data; this.filteredItems = data; });
  }

  filterItems(): void {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(c =>
      c.numero_avoir.toLowerCase().includes(term) || (c.client?.nom?.toLowerCase().includes(term) ?? false)
    );
  }

  deleteItem(id: number): void {
    if (confirm('Supprimer cet avoir ?')) {
      this.service.deleteAvoir(id).subscribe(() => this.loadItems());
    }
  }
}
