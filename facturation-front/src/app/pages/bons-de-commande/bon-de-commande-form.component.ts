import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BonDeCommandeService } from '../../services/bon-de-commande.service';
import { FournisseurService } from '../../services/fournisseur.service';
import { Fournisseur } from '../../models/fournisseur.model';

@Component({
  selector: 'app-bon-de-commande-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>{{ isEdit ? 'Modifier' : 'Nouveau' }} Bon de Commande</h2>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <div class="form-grid">
          <div class="form-group">
            <label>Numéro BC</label>
            <input type="text" formControlName="numero_bc" class="form-control">
          </div>
          <div class="form-group">
            <label>Fournisseur</label>
            <select formControlName="fournisseur_id" class="form-control">
              <option [value]="null">Sélectionner un fournisseur</option>
              @for (f of fournisseurs; track f.id) { <option [value]="f.id">{{ f.nom }}</option> }
            </select>
          </div>
          <div class="form-group">
            <label>Date BC</label>
            <input type="date" formControlName="date_bc" class="form-control">
          </div>
          <div class="form-group">
            <label>Livraison prévue</label>
            <input type="date" formControlName="date_livraison_prevue" class="form-control">
          </div>
          <div class="form-group">
            <label>Statut</label>
            <select formControlName="statut" class="form-control">
              <option value="brouillon">Brouillon</option>
              <option value="en_cours">En cours</option>
              <option value="livre">Livré</option>
              <option value="annule">Annulé</option>
            </select>
          </div>
          <div class="form-group">
            <label>Montant HT</label>
            <input type="number" step="0.01" formControlName="montant_ht" class="form-control">
          </div>
          <div class="form-group">
            <label>Montant TVA</label>
            <input type="number" step="0.01" formControlName="montant_tva" class="form-control">
          </div>
          <div class="form-group">
            <label>Montant TTC</label>
            <input type="number" step="0.01" formControlName="montant_ttc" class="form-control">
          </div>
          <div class="form-group full-width">
            <label>Notes</label>
            <textarea formControlName="notes" class="form-control" rows="2"></textarea>
          </div>
        </div>

        <div class="lignes-section">
          <h3>Lignes du bon de commande</h3>
          <div formArrayName="lignes">
            @for (ligne of lignes.controls; track $index) {
              <div [formGroupName]="$index" class="ligne-row">
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

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">{{ isEdit ? 'Mettre à jour' : 'Créer' }}</button>
          <a routerLink="/bons-de-commande" class="btn btn-secondary">Annuler</a>
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
  `]
})
export class BonDeCommandeFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  itemId?: number;
  fournisseurs: Fournisseur[] = [];

  constructor(
    private fb: FormBuilder,
    private service: BonDeCommandeService,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      numero_bc: ['', Validators.required],
      fournisseur_id: [null, Validators.required],
      date_bc: ['', Validators.required],
      date_livraison_prevue: [''],
      statut: ['brouillon'],
      montant_ht: [0],
      montant_tva: [0],
      montant_ttc: [0],
      notes: [''],
      lignes: this.fb.array([])
    });
  }

  get lignes(): FormArray { return this.form.get('lignes') as FormArray; }

  ngOnInit(): void {
    this.fournisseurService.getFournisseurs().subscribe(data => this.fournisseurs = data);
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.itemId = +this.route.snapshot.params['id'];
      this.service.getBonDeCommande(this.itemId).subscribe(data => {
        this.form.patchValue(data);
        if (data.lignes) data.lignes.forEach(l => this.addLigneFromData(l));
      });
    }
  }

  addLigne(): void {
    this.lignes.push(this.fb.group({
      description: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      prix_unitaire_ht: [0, [Validators.required, Validators.min(0)]],
      montant_ht: [{ value: 0, disabled: false }]
    }));
  }

  addLigneFromData(l: any): void {
    this.lignes.push(this.fb.group({
      description: [l.description, Validators.required],
      quantite: [l.quantite, [Validators.required, Validators.min(1)]],
      prix_unitaire_ht: [l.prix_unitaire_ht, [Validators.required, Validators.min(0)]],
      montant_ht: [l.montant_ht ?? (l.quantite * l.prix_unitaire_ht)]
    }));
  }

  removeLigne(index: number): void { this.lignes.removeAt(index); }

  calcLigneMontant(index: number): void {
    const ligne = this.lignes.at(index);
    const qte = +ligne.get('quantite')?.value || 0;
    const pu = +ligne.get('prix_unitaire_ht')?.value || 0;
    ligne.get('montant_ht')?.setValue(qte * pu);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.form.value.lignes.forEach((l: any) => { l.montant_ht = (+l.quantite || 0) * (+l.prix_unitaire_ht || 0); });
    const obs = this.isEdit
      ? this.service.updateBonDeCommande(this.itemId!, this.form.value)
      : this.service.createBonDeCommande(this.form.value);
    obs.subscribe(() => this.router.navigate(['/bons-de-commande']));
  }
}
