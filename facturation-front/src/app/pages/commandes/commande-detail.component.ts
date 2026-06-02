import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommandeService } from '../../services/commande.service';
import { ConversionService } from '../../services/conversion.service';
import { BonDeCommandeService } from '../../services/bon-de-commande.service';
import { TimelineComponent } from '../../components/timeline.component';
import { ToastService } from '../../services/toast.service';
import { FournisseurSelectDialogComponent } from '../../components/fournisseur-select-dialog.component';
import { Commande } from '../../models/commande.model';

@Component({
  selector: 'app-commande-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TimelineComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Commande {{ commande?.numero_commande }}</h2>
        <div class="header-actions">
          <button (click)="genererFacture()" class="btn btn-invoice">Générer la facture</button>
          <button (click)="creerBonDeCommande()" class="btn btn-purchase">Générer Bon de commande</button>
          @if (bonCommandeId) {
            <a [routerLink]="['/bons-de-commande', bonCommandeId]" class="btn btn-view-bc">Voir bon de commande</a>
          }
          <a [routerLink]="['/commandes', commande?.id, 'edit']" class="btn btn-edit">Modifier</a>
          <a routerLink="/commandes" class="btn btn-secondary">Retour</a>
        </div>
      </div>
      @if (commande) {
        <div class="detail-card">
          <div class="detail-grid">
            <div class="detail-group"><label>Numéro</label><span>{{ commande.numero_commande }}</span></div>
            <div class="detail-group"><label>Client</label><span>{{ commande.client?.nom || '—' }}</span></div>
            <div class="detail-group"><label>Date</label><span>{{ commande.date_commande | date:'dd-MM-yyyy' }}</span></div>
            <div class="detail-group"><label>Statut</label><span class="badge" [class]="'badge-' + commande.statut">{{ getStatutLabel(commande.statut) }}</span></div>
            <div class="detail-group"><label>Montant HT</label><span>{{ commande.montant_ht | number:'1.2-2' }} DH</span></div>
            <div class="detail-group"><label>TVA</label><span>{{ commande.montant_tva | number:'1.2-2' }} DH</span></div>
            <div class="detail-group"><label>Montant TTC</label><span class="total">{{ commande.montant_ttc | number:'1.2-2' }} DH</span></div>
          </div>
          @if (commande.notes) {
            <div class="detail-notes"><label>Notes</label><p>{{ commande.notes }}</p></div>
          }
        </div>
        <h3>Lignes de la commande</h3>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Description</th><th>Quantité</th><th>Prix unitaire HT</th><th>Montant HT</th></tr></thead>
            <tbody>
              @for (ligne of commande.lignes; track ligne.id) {
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

        <app-timeline documentType="commande" [documentId]="commande.id!"></app-timeline>
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
    .badge-en_attente { background: #dbeafe; color: #1d4ed8; }
    .badge-validee { background: #dcfce7; color: #15803d; }
    .badge-annulee { background: #fee2e2; color: #b91c1c; }
    .badge-livree { background: #dcfce7; color: #15803d; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; text-decoration: none; display: inline-block; }
    .btn-edit { background: #f59e0b; color: #fff; }
    .btn-edit:hover { background: #d97706; }
    .btn-secondary { background: #e2e8f0; color: #475569; }
    .btn-secondary:hover { background: #cbd5e1; }
    .btn-invoice { background: #3b82f6; color: #fff; }
    .btn-invoice:hover { background: #2563eb; }
    .btn-purchase { background: #8b5cf6; color: #fff; }
    .btn-purchase:hover { background: #7c3aed; }
    .btn-view-bc { background: #0ea5e9; color: #fff; text-decoration: none; }
    .btn-view-bc:hover { background: #0284c7; }
  `]
})
export class CommandeDetailComponent implements OnInit {
  commande?: Commande;
  bonCommandeId: number | null = null;
  private dialogOpen = false;

  private dialog = inject(MatDialog);

  constructor(
    private route: ActivatedRoute,
    private service: CommandeService,
    private conversionService: ConversionService,
    private bcService: BonDeCommandeService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.service.getCommande(id).subscribe(data => {
      this.commande = data;
      this.chargerBc();
    });
  }

  private chargerBc(): void {
    if (!this.commande?.id) return;
    this.bcService.getBonsDeCommande().subscribe(bcs => {
      const found = bcs.find(b => b.commande_id === this.commande!.id);
      this.bonCommandeId = found?.id ?? null;
    });
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      brouillon: 'Brouillon',
      en_attente: 'En attente',
      validee: 'Validée',
      livree: 'Livrée',
      annulee: 'Annulée'
    };
    return labels[statut] || statut;
  }

  genererFacture(): void {
    if (!this.commande?.id) return;
    this.conversionService.commandeEnFacture(this.commande.id).subscribe((res: any) => {
      this.router.navigate(['/factures', res.id || res.facture_id]);
    });
  }

  creerBonDeCommande(): void {
    if (!this.commande?.id || this.dialogOpen) return;
    this.dialogOpen = true;
    const dialogRef = this.dialog.open(FournisseurSelectDialogComponent, {
      width: '380px',
      disableClose: true,
      panelClass: 'fournisseur-dialog-panel',
      data: { commande_id: this.commande.id },
    });
    dialogRef.afterClosed().subscribe((fournisseur: any) => {
      this.dialogOpen = false;
      if (!fournisseur) return;
      this.conversionService.commandeEnBonDeCommande(this.commande!.id!, { fournisseur_id: fournisseur.id }).subscribe({
        next: (res: any) => this.router.navigate(['/bons-de-commande', res.id || res.bon_commande_id]),
        error: (err) => {
          const msg = err.error?.message || err.statusText || 'Création impossible';
          this.toastService.error(msg);
        },
      });
    });
  }

  marquerLivree(): void {
    if (!this.commande?.id) return;
    this.service.marquerLivree(this.commande.id).subscribe(() => {
      this.ngOnInit();
    });
  }
}
