import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardData } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <h2>Tableau de bord</h2>
      </div>

      @if (loading) {
        <div class="loading-indicator">Chargement...</div>
      } @else if (error) {
        <div class="error-indicator">{{ error }}</div>
      } @else if (data) {
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Chiffre d'affaires (mois)</div>
            <div class="kpi-value">{{ data.chiffre_affaires_mois | number:'1.2-2' }} DH</div>
          </div>
          <div class="kpi-card card-green">
            <div class="kpi-label">Factures payées</div>
            <div class="kpi-value">{{ data.factures_payees.nombre }} ({{ data.factures_payees.montant | number:'1.2-2' }} DH)</div>
          </div>
          <div class="kpi-card card-blue">
            <div class="kpi-label">Factures en attente</div>
            <div class="kpi-value">{{ data.factures_en_attente.nombre }} ({{ data.factures_en_attente.montant | number:'1.2-2' }} DH)</div>
          </div>
          <div class="kpi-card card-red">
            <div class="kpi-label">Factures en retard</div>
            <div class="kpi-value">{{ data.factures_en_retard.nombre }} ({{ data.factures_en_retard.montant | number:'1.2-2' }} DH)</div>
          </div>
          <div class="kpi-card card-orange">
            <div class="kpi-label">Devis en cours</div>
            <div class="kpi-value">{{ data.devis_en_cours.nombre }} (taux: {{ data.devis_en_cours.taux_conversion }})</div>
          </div>
          <div class="kpi-card card-purple">
            <div class="kpi-label">Nouveaux clients</div>
            <div class="kpi-value">{{ data.nouveaux_clients_mois }}</div>
          </div>
        </div>

        <div class="charts-grid">
          <div class="chart-card">
            <h3>CA mensuel (12 mois)</h3>
            <div class="bar-chart">
              @for (m of data.ca_mensuel; track $index) {
                <div class="bar-item">
                  <div class="bar" [style.height.%]="getBarHeight(m.total, data.ca_mensuel)"></div>
                  <div class="bar-label">{{ m.mois }} {{ m.annee }}</div>
                </div>
              }
            </div>
          </div>
          <div class="chart-card">
            <h3>Statuts des factures</h3>
            <div class="donut-container">
              <svg viewBox="0 0 100 100" class="donut-svg">
                @for (seg of getDonutSegments(); track $index) {
                  <circle cx="50" cy="50" r="40" fill="none" [attr.stroke]="seg.color" [attr.stroke-width]="12"
                    [attr.stroke-dasharray]="seg.dasharray" [attr.stroke-dashoffset]="seg.dashoffset"
                    transform="rotate(-90 50 50)" />
                }
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" stroke-width="12"
                  stroke-dasharray="251.2" stroke-dashoffset="0" />
              </svg>
            </div>
            <div class="donut-legend">
              @for (seg of statutsFacturesArray; track $index) {
                <div class="legend-item">
                  <span class="legend-dot" [style.background]="donutColors[$index]"></span>
                  <span>{{ getStatutLabel(seg.statut) }} ({{ seg.count }})</span>
                </div>
              }
            </div>
          </div>
          <div class="chart-card">
            <h3>Évolution devis vs factures (6 mois)</h3>
            <div class="line-chart-container">
              <svg viewBox="0 0 300 150" class="line-chart-svg">
                <polyline [attr.points]="getDevisLinePoints()" fill="none" stroke="#f59e0b" stroke-width="2" />
                <polyline [attr.points]="getFactureLinePoints()" fill="none" stroke="#3b82f6" stroke-width="2" />
                @for (pt of data.evolution_devis_factures; track $index) {
                  <text [attr.x]="25 + $index * 50" y="140" font-size="8" text-anchor="middle" fill="#64748b">{{ pt.mois_annee.slice(0,3) }}</text>
                }
              </svg>
              <div class="line-legend">
                <span class="legend-line" style="color:#f59e0b;">■ Devis</span>
                <span class="legend-line" style="color:#3b82f6;">■ Factures</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Activité récente</h3>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Numéro</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                @for (act of data.activite_recente; track act.id) {
                  <tr>
                    <td><span class="type-badge" [class]="'type-' + act.type">{{ act.type }}</span></td>
                    <td>{{ act.numero }}</td>
                    <td>{{ act.client || '—' }}</td>
                    <td>{{ act.montant | number:'1.2-2' }} DH</td>
                    <td><span class="badge" [class]="'badge-' + act.statut">{{ act.statut }}</span></td>
                    <td>{{ act.created_at | date:'dd-MM-yyyy' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="section">
          <h3>Alertes</h3>
          <div class="alertes-grid">
            @for (alert of data.alertes.factures_en_retard; track alert.id) {
              <div class="alert-box alert-red">
                <strong>Facture en retard</strong> — {{ alert.numero_facture }} — {{ alert.client?.nom || '—' }} — {{ alert.montant_ttc | number:'1.2-2' }} DH
              </div>
            }
            @for (alert of data.alertes.devis_expires; track alert.id) {
              <div class="alert-box alert-orange">
                <strong>Devis expiré</strong> — {{ alert.numero_devis }} — {{ alert.client?.nom || '—' }} — {{ alert.montant_ttc | number:'1.2-2' }} DH
              </div>
            }
            @for (alert of data.alertes.bons_commande_non_traites; track alert.id) {
              <div class="alert-box alert-yellow">
                <strong>Bon de commande non traité</strong> — {{ alert.numero_bc }} — {{ alert.fournisseur?.nom || '—' }} — {{ alert.montant_ttc | number:'1.2-2' }} DH
              </div>
            }
            @if (!data.alertes.factures_en_retard.length && !data.alertes.devis_expires.length && !data.alertes.bons_commande_non_traites.length) {
              <div class="alert-box alert-clean">Aucune alerte</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard { padding: 30px; }
    .page-header { margin-bottom: 25px; }
    .page-header h2 { margin: 0; color: #1e293b; }
    .loading-indicator { text-align: center; padding: 60px; color: #64748b; font-size: 1.1rem; }
    .error-indicator { text-align: center; padding: 60px; color: #ef4444; font-size: 1.1rem; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 18px; margin-bottom: 30px; }
    .kpi-card { background: #fff; border-radius: 10px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .kpi-label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.03em; margin-bottom: 8px; }
    .kpi-value { font-size: 1.25rem; font-weight: 700; color: #1e293b; }
    .card-green { border-left: 4px solid #10b981; }
    .card-blue { border-left: 4px solid #3b82f6; }
    .card-red { border-left: 4px solid #ef4444; }
    .card-orange { border-left: 4px solid #f59e0b; }
    .card-purple { border-left: 4px solid #8b5cf6; }
    .charts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .chart-card { background: #fff; border-radius: 10px; padding: 20px; border: 1px solid #e2e8f0; }
    .chart-card h3 { margin: 0 0 15px 0; font-size: 0.95rem; color: #1e293b; }
    .bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 160px; padding-top: 10px; }
    .bar-item { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
    .bar { width: 100%; max-width: 30px; background: #3b82f6; border-radius: 4px 4px 0 0; min-height: 4px; transition: height 0.3s; }
    .bar-label { font-size: 0.6rem; color: #64748b; margin-top: 5px; text-align: center; white-space: nowrap; }
    .donut-container { display: flex; justify-content: center; }
    .donut-svg { width: 120px; height: 120px; }
    .donut-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; justify-content: center; }
    .legend-item { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; color: #334155; }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .line-chart-container { }
    .line-chart-svg { width: 100%; height: 150px; }
    .line-legend { display: flex; gap: 15px; justify-content: center; margin-top: 5px; font-size: 0.8rem; }
    .section { margin-bottom: 30px; }
    .section h3 { color: #1e293b; margin: 0 0 15px 0; }
    .table-container { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #f8fafc; text-align: left; padding: 12px 15px; font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
    .table td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9rem; }
    .table tr:hover td { background: #f8fafc; }
    .type-badge { padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: 500; }
    .type-facture { background: #dbeafe; color: #1d4ed8; }
    .type-devis { background: #fef9c3; color: #a16207; }
    .type-paiement { background: #dcfce7; color: #15803d; }
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; display: inline-block; }
    .badge-brouillon { background: #fef9c3; color: #a16207; }
    .badge-en_attente { background: #dbeafe; color: #1d4ed8; }
    .badge-payee { background: #dcfce7; color: #15803d; }
    .badge-impayee { background: #fee2e2; color: #b91c1c; }
    .badge-annulee { background: #f1f5f9; color: #64748b; }
    .badge-valide { background: #dcfce7; color: #15803d; }
    .badge-refuse { background: #fee2e2; color: #b91c1c; }
    .badge-traite { background: #dcfce7; color: #15803d; }
    .badge-non_traite { background: #fee2e2; color: #b91c1c; }
    .badge-expire { background: #fee2e2; color: #b91c1c; }
    .alertes-grid { display: flex; flex-direction: column; gap: 8px; }
    .alert-box { padding: 12px 16px; border-radius: 8px; font-size: 0.9rem; border: 1px solid; }
    .alert-red { background: #fef2f2; border-color: #fecaca; color: #b91c1c; }
    .alert-orange { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }
    .alert-yellow { background: #fefce8; border-color: #fef08a; color: #a16207; }
    .alert-clean { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
  `]
})
export class DashboardComponent implements OnInit {
  data?: DashboardData;
  loading = true;
  error = '';

  statutsFacturesArray: { statut: string; count: number; total: number }[] = [];
  donutColors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (d) => {
        this.data = d;
        this.statutsFacturesArray = Object.entries(d.statuts_factures).map(([statut, val]) => ({
          statut,
          count: val.count,
          total: val.total,
        }));
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Dashboard API error:', err);
        if (err.status === 0) {
          this.error = 'API inaccessible. Lancez "php artisan serve" dans le dossier facturation-api.';
        } else if (err.status === 401) {
          this.error = 'Session expirée. Veuillez vous reconnecter.';
        } else if (err.status === 500) {
          this.error = 'Erreur serveur (500). Vérifiez les logs Laravel dans storage/logs/.';
        } else {
          this.error = `Erreur ${err.status || 'inconnue'}: ${err.statusText || 'Vérifiez que l\'API est démarrée.'}`;
        }
      }
    });
  }

  getBarHeight(value: number, all: { total: number }[]): number {
    const max = Math.max(...all.map(m => m.total), 1);
    return (value / max) * 100;
  }

  getDonutSegments(): { dasharray: string; dashoffset: string; color: string }[] {
    if (this.statutsFacturesArray.length === 0) return [];
    const total = this.statutsFacturesArray.reduce((s, x) => s + x.count, 0);
    const circumference = 2 * Math.PI * 40;
    let offset = 0;
    return this.statutsFacturesArray.map((seg, i) => {
      const length = total > 0 ? (seg.count / total) * circumference : 0;
      const segData = {
        dasharray: `${length} ${circumference - length}`,
        dashoffset: `${-offset}`,
        color: this.donutColors[i]
      };
      offset += length;
      return segData;
    });
  }

  getDevisLinePoints(): string {
    if (!this.data) return '';
    return this.data.evolution_devis_factures.map((e, i) => {
      const x = 25 + i * 50;
      const max = Math.max(...this.data!.evolution_devis_factures.map(d => Math.max(d.devis_count, d.facture_count)), 1);
      const y = 130 - (e.devis_count / max) * 100;
      return `${x},${y}`;
    }).join(' ');
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      brouillon: 'Brouillon',
      en_attente: 'En attente',
      payee: 'Payée',
      partiellement_payee: 'Partielle',
      impayee: 'Impayée',
      annulee: 'Annulée',
      valide: 'Validé',
      refuse: 'Refusé',
      expire: 'Expiré',
    };
    return labels[statut] || statut;
  }

  getFactureLinePoints(): string {
    if (!this.data) return '';
    return this.data.evolution_devis_factures.map((e, i) => {
      const x = 25 + i * 50;
      const max = Math.max(...this.data!.evolution_devis_factures.map(d => Math.max(d.devis_count, d.facture_count)), 1);
      const y = 130 - (e.facture_count / max) * 100;
      return `${x},${y}`;
    }).join(' ');
  }
}
