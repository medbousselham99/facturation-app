import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardData } from '../../models/dashboard.model';

interface StatutSegment {
  statut: string;
  count: number;
  total: number;
}

interface DonutSegment {
  dasharray: string;
  dashoffset: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  data?: DashboardData;
  loading = true;
  error = '';

  statutsFacturesArray: StatutSegment[] = [];
  donutColors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  private destroy$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = '';

    this.dashboardService.getDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
          if (err.status === 0) {
            this.error = 'API inaccessible. Vérifiez que le serveur Laravel est démarré.';
          } else if (err.status === 401) {
            this.error = 'Session expirée. Veuillez vous reconnecter.';
          } else if (err.status === 500) {
            this.error = 'Erreur serveur. Consultez les logs Laravel.';
          } else {
            this.error = `Erreur ${err.status || 'inconnue'}.`;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getBarHeight(value: number, all: { total: number }[]): number {
    const max = Math.max(...all.map(m => m.total), 1);
    return (value / max) * 100;
  }

  getDonutSegments(): DonutSegment[] {
    if (this.statutsFacturesArray.length === 0) return [];

    const total = this.statutsFacturesArray.reduce((s, x) => s + x.count, 0);
    const circumference = 2 * Math.PI * 40;
    let offset = 0;

    return this.statutsFacturesArray.map((seg, i) => {
      const length = total > 0 ? (seg.count / total) * circumference : 0;
      const segment = {
        dasharray: `${length} ${circumference - length}`,
        dashoffset: `${-offset}`,
        color: this.donutColors[i]
      };
      offset += length;
      return segment;
    });
  }

  getDevisLinePoints(): string {
    if (!this.data) return '';
    const max = Math.max(...this.data.evolution_devis_factures.map(d => Math.max(d.devis_count, d.facture_count)), 1);
    return this.data.evolution_devis_factures.map((e, i) => {
      const x = 25 + i * 50;
      const y = 130 - (e.devis_count / max) * 100;
      return `${x},${y}`;
    }).join(' ');
  }

  getFactureLinePoints(): string {
    if (!this.data) return '';
    const max = Math.max(...this.data.evolution_devis_factures.map(d => Math.max(d.devis_count, d.facture_count)), 1);
    return this.data.evolution_devis_factures.map((e, i) => {
      const x = 25 + i * 50;
      const y = 130 - (e.facture_count / max) * 100;
      return `${x},${y}`;
    }).join(' ');
  }

  getDevisPointY(value: number): number {
    if (!this.data) return 130;
    const max = Math.max(...this.data.evolution_devis_factures.map(d => Math.max(d.devis_count, d.facture_count)), 1);
    return 130 - (value / max) * 100;
  }

  getFacturePointY(value: number): number {
    if (!this.data) return 130;
    const max = Math.max(...this.data.evolution_devis_factures.map(d => Math.max(d.devis_count, d.facture_count)), 1);
    return 130 - (value / max) * 100;
  }

  getMonthAbbr(month: string): string {
    const months: Record<string, string> = {
      '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr',
      '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Aoû',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc',
    };
    return months[month] || month;
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
      envoye: 'Envoyé',
      livree: 'Livrée',
      converti: 'Converti',
      facturee: 'Facturée',
    };
    return labels[statut] || statut;
  }
}
