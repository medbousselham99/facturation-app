import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AvoirService } from '../../services/avoir.service';
import { Avoir } from '../../models/avoir.model';

@Component({
  selector: 'app-avoir-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Avoir {{ avoir?.numero_avoir }}</h2>
        <div class="header-actions">
          <a [routerLink]="['/avoirs', avoir?.id, 'edit']" class="btn btn-edit">Modifier</a>
          <a routerLink="/avoirs" class="btn btn-secondary">Retour</a>
        </div>
      </div>

      @if (avoir) {
        <div class="detail-card">
          <div class="detail-grid">
            <div class="detail-group"><label>Numéro</label><span>{{ avoir.numero_avoir }}</span></div>
            <div class="detail-group"><label>Client</label><span>{{ avoir.client?.nom || '—' }}</span></div>
            <div class="detail-group"><label>Date</label><span>{{ avoir.date_avoir | date:'dd-MM-yyyy' }}</span></div>
            <div class="detail-group"><label>Statut</label><span class="badge" [class]="'badge-' + avoir.statut">{{ avoir.statut }}</span></div>
            <div class="detail-group"><label>Montant HT</label><span>{{ avoir.montant_ht | number:'1.2-2' }} DH</span></div>
            <div class="detail-group"><label>TVA</label><span>{{ avoir.montant_tva | number:'1.2-2' }} DH</span></div>
            <div class="detail-group"><label>Montant TTC</label><span class="total">{{ avoir.montant_ttc | number:'1.2-2' }} DH</span></div>
          </div>
          @if (avoir.motif) {
            <div class="detail-notes"><label>Motif</label><p>{{ avoir.motif }}</p></div>
          }
        </div>

        <h3>Lignes de l'avoir</h3>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire HT</th>
                <th>Montant HT</th>
              </tr>
            </thead>
            <tbody>
              @for (ligne of avoir.lignes; track ligne.id) {
                <tr>
                  <td>{{ ligne.description }}</td>
                  <td>{{ ligne.quantite }}</td>
                  <td>{{ ligne.prix_unitaire_ht | number:'1.2-2' }} DH</td>
                  <td>{{ (ligne.montant_ht ?? (ligne.quantite * ligne.prix_unitaire_ht)) | number:'1.2-2' }} DH</td>
                </tr>
              }
              @empty {
                <tr><td colspan="4" class="empty">Aucune ligne</td></tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .page-header h2 { margin: 0; color: #1e293b; }
    .header-actions { display: flex; gap: 10px; }
    .detail-card { background: #fff; padding: 25px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 30px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .detail-group { display: flex; flex-direction: column; gap: 4px; }
    .detail-group label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .detail-group span { font-size: 1rem; color: #1e293b; }
    .total { font-weight: 700; color: #059669; font-size: 1.1rem !important; }
    .detail-notes { margin-top: 20px; }
    .detail-notes label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: 600; display: block; margin-bottom: 5px; }
    .detail-notes p { margin: 0; color: #334155; }
    h3 { color: #1e293b; margin: 0 0 15px 0; }
    .table-container { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #f8fafc; text-align: left; padding: 12px 15px; font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
    .table td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9rem; }
    .empty { text-align: center; color: #94a3b8; padding: 40px !important; }
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; display: inline-block; }
    .badge-brouillon { background: #fef9c3; color: #a16207; }
    .badge-emis { background: #dbeafe; color: #1d4ed8; }
    .badge-utilise { background: #dcfce7; color: #15803d; }
    .badge-annule { background: #f1f5f9; color: #64748b; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; text-decoration: none; display: inline-block; }
    .btn-edit { background: #f59e0b; color: #fff; }
    .btn-edit:hover { background: #d97706; }
    .btn-secondary { background: #e2e8f0; color: #475569; }
    .btn-secondary:hover { background: #cbd5e1; }
  `]
})
export class AvoirDetailComponent implements OnInit {
  avoir?: Avoir;

  constructor(
    private route: ActivatedRoute,
    private service: AvoirService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.service.getAvoir(id).subscribe(data => this.avoir = data);
  }
}
