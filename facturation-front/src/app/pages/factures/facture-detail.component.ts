import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FactureService } from '../../services/facture.service';
import { ConversionService } from '../../services/conversion.service';
import { TimelineComponent } from '../../components/timeline.component';
import { Facture } from '../../models/facture.model';

@Component({
  selector: 'app-facture-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TimelineComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Facture {{ facture?.numero_facture }}</h2>
        <div class="header-actions">
          <button (click)="telechargerPdf()" class="btn btn-pdf">Télécharger PDF</button>
          <button (click)="envoyerEmail()" class="btn btn-email">Envoyer par email</button>
          <button (click)="marquerPayee()" class="btn btn-pay" *ngIf="facture?.statut !== 'payee'">Marquer comme payée</button>
          @if (facture?.statut !== 'payee') {
            <a [routerLink]="['/paiements/new']" [queryParams]="{facture_id: facture?.id}" class="btn btn-payment">Enregistrer un paiement</a>
          }
          <a [routerLink]="['/factures', facture?.id, 'edit']" class="btn btn-edit">Modifier</a>
          <a routerLink="/factures" class="btn btn-secondary">Retour</a>
        </div>
      </div>
      @if (facture) {
        <div class="detail-card">
          <div class="detail-grid">
            <div class="detail-group"><label>Numéro</label><span>{{ facture.numero_facture }}</span></div>
            <div class="detail-group"><label>Client</label><span>{{ facture.client?.nom || '—' }}</span></div>
            <div class="detail-group"><label>Date</label><span>{{ facture.date_facture | date:'dd-MM-yyyy' }}</span></div>
            <div class="detail-group"><label>Échéance</label><span>{{ facture.date_echeance | date:'dd-MM-yyyy' }}</span></div>
            <div class="detail-group"><label>Statut</label><span class="badge" [class]="'badge-' + facture.statut">{{ getStatutLabel(facture.statut) }}</span></div>
            <div class="detail-group"><label>Commande liée</label><span>{{ facture.commande?.numero_commande || '—' }}</span></div>
            <div class="detail-group"><label>Devis lié</label><span>{{ facture.devis?.numero_devis || '—' }}</span></div>
            <div class="detail-group"><label>Montant HT</label><span>{{ facture.montant_ht | number:'1.2-2' }} DH</span></div>
            <div class="detail-group"><label>TVA</label><span>{{ facture.montant_tva | number:'1.2-2' }} DH</span></div>
            <div class="detail-group"><label>Montant TTC</label><span class="total">{{ facture.montant_ttc | number:'1.2-2' }} DH</span></div>
            @if (facture.montant_paye != null) {
              <div class="detail-group"><label>Montant payé</label><span class="paid">{{ facture.montant_paye | number:'1.2-2' }} DH</span></div>
              <div class="detail-group"><label>Reste dû</label><span class="due">{{ (facture.montant_ttc - facture.montant_paye) | number:'1.2-2' }} DH</span></div>
            }
          </div>
          @if (facture.notes) {
            <div class="detail-notes"><label>Notes</label><p>{{ facture.notes }}</p></div>
          }
        </div>
        <h3>Lignes de la facture</h3>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Description</th><th>Quantité</th><th>Prix unitaire HT</th><th>Montant HT</th></tr></thead>
            <tbody>
              @for (ligne of facture.lignes; track ligne.id) {
                <tr>
                  <td>{{ ligne.description }}</td>
                  <td>{{ ligne.quantite }}</td>
                  <td>{{ ligne.prix_unitaire_ht | number:'1.2-2' }} DH</td>
                  <td>{{ (ligne.montant_ht ?? (ligne.quantite * ligne.prix_unitaire_ht)) | number:'1.2-2' }} DH</td>
                </tr>
              }
              @empty { <tr><td colspan="4" class="empty">Aucune ligne</td></tr> }
            </tbody>
          </table>
        </div>

        <app-timeline documentType="facture" [documentId]="facture.id!"></app-timeline>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .page-header h2 { margin: 0; color: #1e293b; }
    .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .detail-card { background: #fff; padding: 25px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 30px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .detail-group { display: flex; flex-direction: column; gap: 4px; }
    .detail-group label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .detail-group span { font-size: 1rem; color: #1e293b; }
    .total { font-weight: 700; color: #059669; font-size: 1.1rem !important; }
    .paid { font-weight: 600; color: #059669; }
    .due { font-weight: 600; color: #ef4444; }
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
    .badge-en_attente { background: #dbeafe; color: #1d4ed8; }
    .badge-payee { background: #dcfce7; color: #15803d; }
    .badge-impayee { background: #fee2e2; color: #b91c1c; }
    .badge-annulee { background: #f1f5f9; color: #64748b; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; text-decoration: none; display: inline-block; }
    .btn-edit { background: #f59e0b; color: #fff; }
    .btn-edit:hover { background: #d97706; }
    .btn-secondary { background: #e2e8f0; color: #475569; }
    .btn-secondary:hover { background: #cbd5e1; }
    .btn-pdf { background: #ef4444; color: #fff; }
    .btn-pdf:hover { background: #dc2626; }
    .btn-email { background: #3b82f6; color: #fff; }
    .btn-email:hover { background: #2563eb; }
    .btn-pay { background: #10b981; color: #fff; }
    .btn-pay:hover { background: #059669; }
    .btn-payment { background: #8b5cf6; color: #fff; }
    .btn-payment:hover { background: #7c3aed; }
  `]
})
export class FactureDetailComponent implements OnInit {
  facture?: Facture;

  constructor(
    private route: ActivatedRoute,
    private service: FactureService,
    private conversionService: ConversionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.service.getFacture(id).subscribe(data => this.facture = data);
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      brouillon: 'Brouillon',
      en_attente: 'En attente',
      payee: 'Payée',
      impayee: 'Impayée',
      annulee: 'Annulée'
    };
    return labels[statut] || statut;
  }

  telechargerPdf(): void {
    if (!this.facture?.id) return;
    this.service.exportPdf(this.facture.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture_${this.facture!.numero_facture}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  envoyerEmail(): void {
    if (!this.facture?.id) return;
    this.service.envoyerEmail(this.facture.id).subscribe(() => {
      alert('Email envoyé avec succès');
    });
  }

  marquerPayee(): void {
    if (!this.facture?.id) return;
    this.conversionService.marquerPayee(this.facture.id).subscribe(() => {
      this.ngOnInit();
    });
  }
}
