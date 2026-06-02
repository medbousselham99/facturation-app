import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriqueService } from '../services/historique.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline">
      <h4>Historique</h4>
      @if (loading) {
        <div class="loading">Chargement...</div>
      }
      @if (items.length === 0 && !loading) {
        <div class="empty">Aucun historique</div>
      }
      <div class="timeline-list">
        @for (item of items; track item.id) {
          <div class="timeline-item">
            <div class="timeline-dot" [class]="'dot-' + item.action"></div>
            <div class="timeline-content">
              <div class="timeline-action">{{ getActionLabel(item.action) }}</div>
              @if (item.description) {
                <div class="timeline-desc">{{ item.description }}</div>
              }
              <div class="timeline-date">{{ item.created_at | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .timeline { margin-top: 25px; }
    .timeline h4 { margin: 0 0 15px 0; color: #1e293b; font-size: 1rem; }
    .loading { color: #64748b; padding: 10px; }
    .empty { color: #94a3b8; padding: 10px; font-style: italic; }
    .timeline-list { position: relative; padding-left: 25px; }
    .timeline-list::before {
      content: '';
      position: absolute; left: 8px; top: 0; bottom: 0;
      width: 2px; background: #e2e8f0;
    }
    .timeline-item { position: relative; margin-bottom: 16px; }
    .timeline-dot {
      position: absolute; left: -21px; top: 4px;
      width: 14px; height: 14px; border-radius: 50%;
      background: #3b82f6; border: 2px solid #fff; box-shadow: 0 0 0 2px #3b82f6;
    }
    .dot-cree { background: #3b82f6; box-shadow: 0 0 0 2px #3b82f6; }
    .dot-envoye { background: #f59e0b; box-shadow: 0 0 0 2px #f59e0b; }
    .dot-accepte { background: #10b981; box-shadow: 0 0 0 2px #10b981; }
    .dot-refuse { background: #ef4444; box-shadow: 0 0 0 2px #ef4444; }
    .dot-converti { background: #8b5cf6; box-shadow: 0 0 0 2px #8b5cf6; }
    .dot-paye { background: #10b981; box-shadow: 0 0 0 2px #10b981; }
    .dot-relance { background: #f59e0b; box-shadow: 0 0 0 2px #f59e0b; }
    .timeline-content { background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #f1f5f9; }
    .timeline-action { font-weight: 600; font-size: 0.85rem; color: #1e293b; }
    .timeline-desc { font-size: 0.8rem; color: #64748b; margin-top: 3px; }
    .timeline-date { font-size: 0.75rem; color: #94a3b8; margin-top: 4px; }
  `]
})
export class TimelineComponent implements OnInit {
  @Input() documentType = '';
  @Input() documentId = 0;
  items: any[] = [];
  loading = true;

  constructor(private historiqueService: HistoriqueService) {}

  ngOnInit(): void {
    if (this.documentType && this.documentId) {
      this.historiqueService.getByDocument(this.documentType, this.documentId).subscribe(data => {
        this.items = data;
        this.loading = false;
      });
    }
  }

  getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      cree: 'Document créé',
      envoye: 'Document envoyé',
      accepte: 'Document accepté',
      refuse: 'Document refusé',
      converti: 'Document converti',
      paye: 'Paiement enregistré',
      relance: 'Relance envoyée',
      expire: 'Document expiré'
    };
    return labels[action] || action;
  }
}
