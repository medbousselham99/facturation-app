import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RapportService, RapportVentes, RapportTVA, TopClient } from '../../services/rapport.service';

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Rapports</h2>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>Du</label>
          <input type="month" [(ngModel)]="dateDebut" class="form-control">
        </div>
        <div class="filter-group">
          <label>Au</label>
          <input type="month" [(ngModel)]="dateFin" class="form-control">
        </div>
        <button class="btn btn-primary" (click)="loadReports()">Appliquer</button>
      </div>

      <div class="reports-grid">
        <div class="report-card">
          <h3>Rapport de ventes</h3>
          <div class="report-stats">
            <div class="stat"><label>Total ventes</label><span class="value">{{ ventes?.total_ventes | number:'1.2-2' }} DH</span></div>
            <div class="stat"><label>Nombre factures</label><span class="value">{{ ventes?.nombre_factures }}</span></div>
          </div>
        </div>

        <div class="report-card">
          <h3>TVA collectée</h3>
          <div class="report-stats">
            <div class="stat"><label>Total TVA</label><span class="value">{{ tva?.total_tva_collectee | number:'1.2-2' }} DH</span></div>
          </div>
        </div>

        <div class="report-card full-width">
          <h3>Top 5 Clients</h3>
          <table class="table">
            <thead><tr><th>Client</th><th>Total HT</th><th>Total TTC</th><th>Factures</th></tr></thead>
            <tbody>
              @for (c of topClients; track c.client_id) {
                <tr>
                  <td>{{ c.client_nom }}</td>
                  <td>{{ c.total_ht | number:'1.2-2' }} DH</td>
                  <td>{{ c.total_ttc | number:'1.2-2' }} DH</td>
                  <td>{{ c.nombre_factures }}</td>
                </tr>
              } @empty { <tr><td colspan="4" class="empty">Aucune donnée</td></tr> }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; }
    .page-header { margin-bottom: 25px; }
    .page-header h2 { margin: 0; color: #1e293b; font-size: 1.5rem; }
    .filters { display: flex; gap: 15px; align-items: flex-end; margin-bottom: 30px; flex-wrap: wrap; }
    .filter-group { display: flex; flex-direction: column; gap: 5px; }
    .filter-group label { font-size: 0.85rem; color: #64748b; font-weight: 500; }
    .form-control { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; }
    .btn { padding: 9px 20px; border: none; border-radius: 6px; font-size: 0.9rem; cursor: pointer; font-weight: 500; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .report-card { background: #fff; border-radius: 10px; padding: 25px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .report-card h3 { margin: 0 0 20px 0; font-size: 1rem; color: #1e293b; }
    .report-stats { display: flex; flex-direction: column; gap: 15px; }
    .stat { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .stat:last-child { border-bottom: none; }
    .stat label { font-size: 0.85rem; color: #64748b; }
    .stat .value { font-size: 1.2rem; font-weight: 600; color: #1e293b; }
    .full-width { grid-column: 1 / -1; }
    .table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .table th { text-align: left; padding: 10px 12px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
    .empty { text-align: center; color: #94a3b8; padding: 30px !important; }
  `]
})
export class RapportsComponent implements OnInit {
  dateDebut = '';
  dateFin = '';
  ventes?: RapportVentes;
  tva?: RapportTVA;
  topClients: TopClient[] = [];

  constructor(private rapportService: RapportService) {}

  ngOnInit(): void {
    const now = new Date();
    this.dateDebut = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`;
    this.dateFin = this.dateDebut;
    this.loadReports();
  }

  loadReports(): void {
    const [anneeDebut, moisDebut] = this.dateDebut.split('-');
    const [anneeFin, moisFin] = this.dateFin.split('-');
    const dateDebutStr = `${anneeDebut}-${moisDebut}-01`;
    const lastDay = new Date(Number(anneeFin), Number(moisFin), 0).getDate();
    const dateFinStr = `${anneeFin}-${moisFin}-${String(lastDay).padStart(2, '0')}`;

    this.rapportService.getVentes(dateDebutStr, dateFinStr).subscribe(data => this.ventes = data);
    this.rapportService.getTVA(dateDebutStr, dateFinStr).subscribe(data => this.tva = data);
    this.rapportService.getTopClients(dateDebutStr, dateFinStr).subscribe(data => this.topClients = data);
  }
}
