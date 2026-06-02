import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DevisService } from '../../services/devis.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { ProduitService } from '../../services/produit.service';
import { Produit } from '../../models/produit.model';

@Component({
  selector: 'app-devis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>{{ isEdit ? 'Modifier' : 'Nouveau' }} Devis</h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <div class="form-grid">
          <div class="form-group">
            <label>Numéro Devis</label>
            <input type="text" formControlName="numero_devis" class="form-control">
          </div>
          <div class="form-group">
            <label>Client</label>
            <select formControlName="client_id" class="form-control">
              <option [value]="null">Sélectionner un client</option>
              @for (c of clients; track c.id) {
                <option [value]="c.id">{{ c.nom }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" formControlName="date_devis" class="form-control">
          </div>
          <div class="form-group">
            <label>Validité</label>
            <input type="date" formControlName="date_validite" class="form-control">
          </div>
          <div class="form-group">
            <label>Statut</label>
            <select formControlName="statut" class="form-control">
              <option value="brouillon">Brouillon</option>
              <option value="en_attente">En attente</option>
              <option value="valide">Validé</option>
              <option value="refuse">Refusé</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label>Notes</label>
            <textarea formControlName="notes" class="form-control" rows="2"></textarea>
          </div>
        </div>

        <div class="lignes-section">
          <h3>Lignes du devis</h3>
          <div formArrayName="lignes">
            @for (ligne of lignes.controls; track $index) {
              <div [formGroupName]="$index" class="ligne-row">
                <div class="ligne-field" style="flex:0.7">
                  <label>Produit</label>
                  <select class="form-control" formControlName="produit_id" (change)="onProductSelect($index)">
                    <option [value]="null">—</option>
                    @for (p of produits; track p.id) {
                      <option [value]="p.id">{{ p.nom }}</option>
                    }
                  </select>
                </div>
                <div class="ligne-field">
                  <label>Description</label>
                  <input type="text" formControlName="description" class="form-control">
                </div>
                <div class="ligne-field">
                  <label>Quantité</label>
                  <input type="number" formControlName="quantite" class="form-control" (input)="calcLigneMontant($index)">
                </div>
                <div class="ligne-field">
                  <label>Prix unitaire HT</label>
                  <input type="number" step="0.01" formControlName="prix_unitaire_ht" class="form-control" (input)="calcLigneMontant($index)">
                </div>
                <div class="ligne-field">
                  <label>Montant HT</label>
                  <input type="number" step="0.01" formControlName="montant_ht" class="form-control" readonly>
                </div>
                <button type="button" class="btn btn-sm btn-delete" (click)="removeLigne($index)">×</button>
              </div>
            }
          </div>
          <button type="button" class="btn btn-add" (click)="addLigne()">+ Ajouter une ligne</button>
        </div>

        <div class="totals-section">
          <div class="total-line">Total HT: <strong>{{ getTotalHT() | number:'1.2-2' }} DH</strong></div>
          <div class="total-line">TVA (20%): <strong>{{ getTotalTVA() | number:'1.2-2' }} DH</strong></div>
          <div class="total-line total-ttc">Total TTC: <strong>{{ getTotalTTC() | number:'1.2-2' }} DH</strong></div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">{{ isEdit ? 'Mettre à jour' : 'Créer' }}</button>
          <a routerLink="/devis" class="btn btn-secondary">Annuler</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; max-width: 900px; }
    .page-header { margin-bottom: 25px; }
    .page-header h2 { margin: 0; color: #1e293b; }
    .form { background: #fff; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    .full-width { grid-column: 1 / -1; }
    label { font-size: 0.85rem; font-weight: 500; color: #374151; }
    .form-control { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; }
    .form-control:focus { outline: none; border-color: #3b82f6; }
    .form-control[readonly] { background: #f8fafc; }
    .lignes-section { margin-top: 30px; padding-top: 25px; border-top: 1px solid #e2e8f0; }
    .lignes-section h3 { margin: 0 0 15px 0; color: #1e293b; }
    .ligne-row { display: flex; gap: 12px; align-items: flex-end; margin-bottom: 12px; padding: 15px; background: #f8fafc; border-radius: 8px; }
    .ligne-field { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .ligne-field label { font-size: 0.75rem; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; text-decoration: none; display: inline-block; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: #e2e8f0; color: #475569; }
    .btn-secondary:hover { background: #cbd5e1; }
    .btn-add { background: #10b981; color: #fff; margin-top: 5px; }
    .btn-add:hover { background: #059669; }
    .btn-sm { padding: 8px 12px; font-size: 1rem; }
    .btn-delete { background: #ef4444; color: #fff; }
    .btn-delete:hover { background: #dc2626; }
    .form-actions { margin-top: 25px; display: flex; gap: 10px; }
    .totals-section { margin-top: 25px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
    .total-line { font-size: 1rem; margin-bottom: 6px; color: #374151; }
    .total-line strong { font-weight: 600; }
    .total-ttc { font-size: 1.15rem; margin-top: 6px; color: #1e293b; }
    .total-ttc strong { color: #059669; }
  `]
})
export class DevisFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  itemId?: number;
  clients: Client[] = [];
  produits: Produit[] = [];

  constructor(
    private fb: FormBuilder,
    private service: DevisService,
    private clientService: ClientService,
    private produitService: ProduitService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      numero_devis: ['', Validators.required],
      client_id: [null, Validators.required],
      date_devis: ['', Validators.required],
      date_validite: [''],
      statut: ['brouillon'],
      montant_ht: [0],
      montant_tva: [0],
      montant_ttc: [0],
      notes: [''],
      lignes: this.fb.array([])
    });
  }

  get lignes(): FormArray {
    return this.form.get('lignes') as FormArray;
  }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(data => this.clients = data);
    this.produitService.getProduits().subscribe(data => this.produits = data.filter(p => p.actif));
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.itemId = +this.route.snapshot.params['id'];
      this.service.getDevis(this.itemId).subscribe(data => {
        this.form.patchValue(data);
        if (data.lignes) {
          data.lignes.forEach(l => this.addLigneFromData(l));
        }
      });
    }
  }

  addLigne(): void {
    this.lignes.push(this.fb.group({
      produit_id: [null],
      description: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      prix_unitaire_ht: [0, [Validators.required, Validators.min(0)]],
      montant_ht: [{ value: 0, disabled: false }]
    }));
  }

  addLigneFromData(l: any): void {
    this.lignes.push(this.fb.group({
      produit_id: [l.produit_id || null],
      description: [l.description, Validators.required],
      quantite: [l.quantite, [Validators.required, Validators.min(1)]],
      prix_unitaire_ht: [l.prix_unitaire_ht, [Validators.required, Validators.min(0)]],
      montant_ht: [l.montant_ht ?? (l.quantite * l.prix_unitaire_ht)]
    }));
  }

  removeLigne(index: number): void {
    this.lignes.removeAt(index);
  }

  onProductSelect(index: number): void {
    const ligne = this.lignes.at(index);
    const produitId = ligne.get('produit_id')?.value;
    if (!produitId) return;
    const produit = this.produits.find(p => p.id === +produitId);
    if (produit) {
      ligne.get('description')?.setValue(produit.nom);
      ligne.get('prix_unitaire_ht')?.setValue(produit.prix_unitaire_ht);
      this.calcLigneMontant(index);
    }
  }

  getTotalHT(): number {
    return this.lignes.controls.reduce((sum, c) => sum + (+c.get('montant_ht')?.value || 0), 0);
  }

  getTotalTVA(): number {
    return this.getTotalHT() * 0.20;
  }

  getTotalTTC(): number {
    return this.getTotalHT() + this.getTotalTVA();
  }

  calcLigneMontant(index: number): void {
    const ligne = this.lignes.at(index);
    const qte = +ligne.get('quantite')?.value || 0;
    const pu = +ligne.get('prix_unitaire_ht')?.value || 0;
    ligne.get('montant_ht')?.setValue(qte * pu);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.form.value.lignes.forEach((l: any, i: number) => {
      l.montant_ht = (+l.quantite || 0) * (+l.prix_unitaire_ht || 0);
    });
    const obs = this.isEdit
      ? this.service.updateDevis(this.itemId!, this.form.value)
      : this.service.createDevis(this.form.value);
    obs.subscribe(() => this.router.navigate(['/devis']));
  }
}
