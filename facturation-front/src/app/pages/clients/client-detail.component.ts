import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>{{ client?.nom }}</h2>
        <div class="header-actions">
          <a [routerLink]="['/clients', client?.id, 'edit']" class="btn btn-edit">Modifier</a>
          <a [routerLink]="['/devis/new']" [queryParams]="{client_id: client?.id}" class="btn btn-primary">Nouveau devis</a>
          <a [routerLink]="['/factures/new']" [queryParams]="{client_id: client?.id}" class="btn btn-primary">Nouvelle facture</a>
          <a routerLink="/clients" class="btn btn-secondary">Retour</a>
        </div>
      </div>

      @if (client) {
        <div class="detail-grid">
          <div class="detail-card contact-card">
            <h3>Informations de contact</h3>
            <div class="info-row"><label>Nom</label><span>{{ client.nom }}</span></div>
            <div class="info-row"><label>Email</label><span>{{ client.email }}</span></div>
            <div class="info-row"><label>Téléphone</label><span>{{ client.telephone || '—' }}</span></div>
            <div class="info-row"><label>Adresse</label><span>{{ client.adresse || '—' }}</span></div>
            <div class="info-row"><label>Ville</label><span>{{ client.ville || '—' }}</span></div>
            <div class="info-row"><label>Code postal</label><span>{{ client.code_postal || '—' }}</span></div>
            <div class="info-row"><label>Pays</label><span>{{ client.pays || '—' }}</span></div>
            <div class="info-row"><label>SIRET</label><span>{{ client.siret || '—' }}</span></div>
            <div class="info-row"><label>Statut</label><span class="badge" [class]="'badge-' + (client.statut || 'actif')">{{ (client.statut || 'actif') === 'actif' ? 'Actif' : 'Inactif' }}</span></div>
            @if (client.notes) {
              <div class="info-row"><label>Notes</label><span>{{ client.notes }}</span></div>
            }
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ client.stats?.devis_count ?? '—' }}</div>
              <div class="stat-label">Devis</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ client.stats?.commandes_count ?? '—' }}</div>
              <div class="stat-label">Commandes</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ client.stats?.factures_count ?? '—' }}</div>
              <div class="stat-label">Factures</div>
            </div>
            @if (client.total_du != null) {
              <div class="stat-card highlight">
                <div class="stat-value">{{ client.total_du | number:'1.2-2' }} DH</div>
                <div class="stat-label">Total dû</div>
              </div>
            }
          </div>
        </div>

        @if (client.factures && client.factures.length > 0) {
          <h3>Dernières factures</h3>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr><th>N°</th><th>Date</th><th>Échéance</th><th>Statut</th><th>Montant TTC</th><th>Actions</th></tr>
              </thead>
              <tbody>
                @for (f of client.factures; track f.id) {
                  <tr>
                    <td>{{ f.numero_facture }}</td>
                    <td>{{ f.date_facture | date:'dd-MM-yyyy' }}</td>
                    <td>{{ f.date_echeance | date:'dd-MM-yyyy' }}</td>
                    <td><span class="badge" [class]="'badge-' + f.statut">{{ f.statut }}</span></td>
                    <td>{{ f.montant_ttc | number:'1.2-2' }} DH</td>
                    <td><a [routerLink]="['/factures', f.id]" class="btn btn-sm btn-view">Voir</a></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (client.devis && client.devis.length > 0) {
          <h3>Derniers devis</h3>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr><th>N°</th><th>Date</th><th>Date validité</th><th>Statut</th><th>Montant TTC</th><th>Actions</th></tr>
              </thead>
              <tbody>
                @for (d of client.devis; track d.id) {
                  <tr>
                    <td>{{ d.numero_devis }}</td>
                    <td>{{ d.date_devis | date:'dd-MM-yyyy' }}</td>
                    <td>{{ d.date_validite | date:'dd-MM-yyyy' }}</td>
                    <td><span class="badge" [class]="'badge-' + d.statut">{{ d.statut }}</span></td>
                    <td>{{ d.montant_ttc | number:'1.2-2' }} DH</td>
                    <td><a [routerLink]="['/devis', d.id]" class="btn btn-sm btn-view">Voir</a></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .page-header h2 { margin: 0; color: #1e293b; }
    .header-actions { display: flex; gap: 10px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 30px; }
    .detail-card { background: #fff; padding: 25px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .detail-card h3 { margin: 0 0 20px 0; color: #1e293b; font-size: 1rem; }
    .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .info-row:last-child { border-bottom: none; }
    .info-row label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: 600; width: 130px; flex-shrink: 0; }
    .info-row span { font-size: 0.9rem; color: #1e293b; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-content: start; }
    .stat-card { background: #fff; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center; }
    .stat-card.highlight { background: #fef9c3; border-color: #fde68a; }
    .stat-value { font-size: 1.8rem; font-weight: 700; color: #1e293b; }
    .stat-label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; margin-top: 5px; }
    h3 { color: #1e293b; margin: 0 0 15px 0; }
    .table-container { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 30px; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #f8fafc; text-align: left; padding: 12px 15px; font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
    .table td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9rem; }
    .table tr:hover td { background: #f8fafc; }
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; display: inline-block; }
    .badge-actif { background: #dcfce7; color: #15803d; }
    .badge-inactif { background: #fee2e2; color: #b91c1c; }
    .badge-brouillon { background: #fef9c3; color: #a16207; }
    .badge-en_attente { background: #dbeafe; color: #1d4ed8; }
    .badge-valide { background: #dcfce7; color: #15803d; }
    .badge-refuse { background: #fee2e2; color: #b91c1c; }
    .badge-validee { background: #dcfce7; color: #15803d; }
    .badge-annulee { background: #f1f5f9; color: #64748b; }
    .badge-payee { background: #dcfce7; color: #15803d; }
    .badge-impayee { background: #fee2e2; color: #b91c1c; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; text-decoration: none; display: inline-block; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-edit { background: #f59e0b; color: #fff; }
    .btn-edit:hover { background: #d97706; }
    .btn-secondary { background: #e2e8f0; color: #475569; }
    .btn-secondary:hover { background: #cbd5e1; }
    .btn-sm { padding: 5px 12px; font-size: 0.8rem; }
    .btn-view { background: #6366f1; color: #fff; }
    .btn-view:hover { background: #4f46e5; }
  `]
})
export class ClientDetailComponent implements OnInit {
  client?: Client;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.clientService.getClientWithDetails(id).subscribe(data => {
      this.client = data;
    });
  }
}
