import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PaiementService } from '../../services/paiement.service';
import { Paiement } from '../../models/paiement.model';
import { PaginationComponent } from '../../components/pagination.component';

@Component({
  selector: 'app-paiement-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Paiements</h2>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Facture N°</th>
              <th>Client</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Mode</th>
              <th>Référence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of paginatedItems; track item.id) {
              <tr>
                <td>{{ item.id }}</td>
                <td>{{ item.facture?.numero_facture || '—' }}</td>
                <td>{{ item.facture?.client?.nom || '—' }}</td>
                <td>{{ item.montant | number:'1.2-2' }} DH</td>
                <td>{{ item.date_paiement | date:'dd-MM-yyyy' }}</td>
                <td>{{ item.mode_paiement }}</td>
                <td>{{ item.reference || '—' }}</td>
                <td class="actions">
                  <button (click)="deleteItem(item.id!)" class="btn btn-sm btn-delete">Supprimer</button>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="8" class="empty">Aucun paiement trouvé</td></tr>
            }
          </tbody>
        </table>
      </div>
      <app-pagination [currentPage]="currentPage" [pageSize]="pageSize" [totalItems]="items.length" (pageChange)="currentPage = $event"></app-pagination>
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-header h2 { margin: 0; color: #1e293b; }
    .table-container { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #f8fafc; text-align: left; padding: 12px 15px; font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
    .table td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9rem; }
    .table tr:hover td { background: #f8fafc; }
    .empty { text-align: center; color: #94a3b8; padding: 40px !important; }
    .actions { display: flex; gap: 8px; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; text-decoration: none; display: inline-block; }
    .btn-sm { padding: 5px 12px; font-size: 0.8rem; }
    .btn-delete { background: #ef4444; color: #fff; }
    .btn-delete:hover { background: #dc2626; }
  `]
})
export class PaiementListComponent implements OnInit {
  items: Paiement[] = [];
  currentPage = 1;
  pageSize = 10;

  get paginatedItems(): Paiement[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  }

  constructor(
    private service: PaiementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentPage = 1;
    const factureId = this.route.snapshot.queryParams['facture_id'];
    if (factureId) {
      this.service.getPaiementsByFacture(+factureId).subscribe(data => this.items = data);
    } else {
      this.service.getPaiements().subscribe(data => this.items = data);
    }
  }

  deleteItem(id: number): void {
    if (confirm('Supprimer ce paiement ?')) {
      this.service.deletePaiement(id).subscribe(() => this.ngOnInit());
    }
  }
}
