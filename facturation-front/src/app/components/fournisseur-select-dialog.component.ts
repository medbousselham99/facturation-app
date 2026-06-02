import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FournisseurService } from '../services/fournisseur.service';
import { BonDeCommandeService } from '../services/bon-de-commande.service';

@Component({
  selector: 'app-fournisseur-select-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Sélectionner un fournisseur</h2>
        <button class="close-btn" (click)="dialogRef.close()" aria-label="Fermer">&times;</button>
      </div>
      <div class="dialog-search">
        <div class="search-wrapper">
          <span class="search-icon">search</span>
          <input
            type="text"
            placeholder="Rechercher un fournisseur..."
            [(ngModel)]="search"
            (input)="filterFournisseurs()"
            class="search-input"
            autofocus
          />
        </div>
      </div>
      <div class="dialog-list">
        @if (filtered.length === 0) {
          <div class="empty-state">
            <span class="empty-icon">business</span>
            <p>{{ search ? 'Aucun résultat trouvé' : 'Aucun fournisseur disponible' }}</p>
            <p class="empty-hint">Créez un fournisseur depuis le menu Fournisseurs.</p>
          </div>
        }
        @for (f of filtered; track f.id) {
          <div class="fournisseur-item" (click)="select(f)" [class.selected]="selectedId === f.id" [class.disabled]="assignedIds.has(f.id)">
            <div class="item-avatar" [class.assigned]="assignedIds.has(f.id)">{{ f.nom.charAt(0).toUpperCase() }}</div>
            <div class="item-info">
              <div class="item-name">{{ f.nom }}</div>
              <div class="item-detail">{{ f.email || '—' }} &middot; {{ f.telephone || '—' }}</div>
            </div>
            @if (assignedIds.has(f.id)) {
              <span class="item-taken" title="Déjà sélectionné">check_circle</span>
            } @else {
              <span class="item-check" [class.visible]="selectedId === f.id">check_circle</span>
            }
          </div>
        }
      </div>
      <div class="dialog-footer">
        <button class="btn btn-cancel" (click)="dialogRef.close()">Annuler</button>
        <button class="btn btn-confirm" [disabled]="!selectedId || assignedIds.has(selectedId)" (click)="confirm()">
          <span class="btn-icon">assignment</span>
          Créer le bon de commande
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container { width: 100%; max-height: 440px; display: flex; flex-direction: column; }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px 0; }
    .dialog-header h2 { margin: 0; font-size: 0.95rem; font-weight: 600; color: #1e293b; }
    .close-btn { background: none; border: none; font-size: 1.3rem; color: #94a3b8; cursor: pointer; padding: 0; line-height: 1; }
    .close-btn:hover { color: #475569; }
    .dialog-search { padding: 8px 18px; }
    .search-wrapper { display: flex; align-items: center; background: #f1f5f9; border-radius: 6px; padding: 0 10px; border: 1px solid #e2e8f0; transition: border-color 0.2s; }
    .search-wrapper:focus-within { border-color: #3b82f6; background: #fff; }
    .search-icon { font-family: 'Material Icons'; font-size: 16px; color: #94a3b8; margin-right: 6px; }
    .search-input { flex: 1; border: none; background: transparent; padding: 7px 0; font-size: 0.8rem; outline: none; }
    .dialog-list { flex: 1; overflow-y: auto; padding: 0 18px; min-height: 0; }
    .empty-state { text-align: center; padding: 24px 0; color: #94a3b8; }
    .empty-icon { font-family: 'Material Icons'; font-size: 36px; display: block; margin-bottom: 8px; }
    .empty-state p { margin: 0 0 2px; font-size: 0.8rem; }
    .empty-hint { font-size: 0.75rem !important; color: #b0bcc9; }
    .fournisseur-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: all 0.15s; margin-bottom: 2px; }
    .fournisseur-item:hover { background: #f8fafc; }
    .fournisseur-item.selected { background: #eff6ff; outline: 1px solid #3b82f6; }
    .fournisseur-item.disabled { opacity: 0.55; cursor: not-allowed; }
    .fournisseur-item.disabled:hover { background: transparent; }
    .item-avatar { width: 32px; height: 32px; border-radius: 50%; background: #dbeafe; color: #1d4ed8; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0; }
    .item-avatar.assigned { background: #e2e8f0; color: #94a3b8; }
    .item-info { flex: 1; min-width: 0; }
    .item-name { font-weight: 600; color: #1e293b; font-size: 0.85rem; }
    .fournisseur-item.disabled .item-name { color: #94a3b8; }
    .item-detail { font-size: 0.75rem; color: #94a3b8; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .item-check { font-family: 'Material Icons'; font-size: 18px; color: #3b82f6; opacity: 0; transition: opacity 0.15s; }
    .item-check.visible { opacity: 1; }
    .item-taken { font-family: 'Material Icons'; font-size: 18px; color: #94a3b8; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 6px; padding: 10px 18px; border-top: 1px solid #e2e8f0; }
    .btn { padding: 7px 14px; border: none; border-radius: 5px; cursor: pointer; font-size: 0.8rem; font-weight: 500; display: flex; align-items: center; gap: 4px; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-cancel { background: #f1f5f9; color: #64748b; }
    .btn-cancel:hover { background: #e2e8f0; }
    .btn-confirm { background: #3b82f6; color: #fff; }
    .btn-confirm:hover:not(:disabled) { background: #2563eb; }
    .btn-icon { font-family: 'Material Icons'; font-size: 16px; }
  `]
})
export class FournisseurSelectDialogComponent implements OnInit {
  search = '';
  fournisseurs: any[] = [];
  filtered: any[] = [];
  selectedId: number | null = null;
  assignedIds: Set<number> = new Set();

  constructor(
    public dialogRef: MatDialogRef<FournisseurSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { commande_id: number },
    private fournisseurService: FournisseurService,
    private bcService: BonDeCommandeService
  ) {}

  ngOnInit(): void {
    this.fournisseurService.getFournisseurs().subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : (res as any).data || [];
        this.fournisseurs = list;
        this.filtered = [...list];
        this.loadAssigned();
      },
      error: () => {
        this.filtered = [];
      }
    });
  }

  private loadAssigned(): void {
    if (!this.data?.commande_id) return;
    this.bcService.getBonsDeCommande().subscribe({
      next: (bcs) => {
        const taken = bcs
          .filter((b: any) => b.commande_id === this.data.commande_id && b.fournisseur_id)
          .map((b: any) => b.fournisseur_id);
        this.assignedIds = new Set(taken);
        this.filtered = this.fournisseurs.filter(f => !this.assignedIds.has(f.id) || f.id === this.selectedId);
      }
    });
  }

  filterFournisseurs(): void {
    const q = this.search.toLowerCase().trim();
    this.filtered = this.fournisseurs.filter(f =>
      (!q || f.nom.toLowerCase().includes(q) || (f.email || '').toLowerCase().includes(q))
    );
  }

  select(f: any): void {
    if (this.assignedIds.has(f.id)) return;
    this.selectedId = f.id;
  }

  confirm(): void {
    const f = this.fournisseurs.find(x => x.id === this.selectedId);
    if (f && !this.assignedIds.has(f.id)) this.dialogRef.close(f);
  }
}
