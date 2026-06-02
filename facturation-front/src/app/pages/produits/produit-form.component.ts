import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProduitService } from '../../services/produit.service';
import { Produit } from '../../models/produit.model';

@Component({
  selector: 'app-produit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>{{ isEdit ? 'Modifier' : 'Nouveau' }} Produit / Service</h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <div class="form-grid">
          <div class="form-group">
            <label>Référence</label>
            <input type="text" formControlName="reference" class="form-control">
          </div>
          <div class="form-group">
            <label>Nom</label>
            <input type="text" formControlName="nom" class="form-control">
          </div>
          <div class="form-group">
            <label>Prix unitaire HT</label>
            <input type="number" step="0.01" formControlName="prix_unitaire_ht" class="form-control">
          </div>
          <div class="form-group">
            <label>TVA (%)</label>
            <input type="number" step="0.1" formControlName="tva_taux" class="form-control">
          </div>
          <div class="form-group">
            <label>Unité</label>
            <select formControlName="unite" class="form-control">
              <option value="pièce">Pièce</option>
              <option value="heure">Heure</option>
              <option value="forfait">Forfait</option>
              <option value="jour">Jour</option>
              <option value="mois">Mois</option>
            </select>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="actif"> Actif
            </label>
          </div>
          <div class="form-group full-width">
            <label>Description</label>
            <textarea formControlName="description" class="form-control" rows="3"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
            {{ isEdit ? 'Mettre à jour' : 'Créer' }}
          </button>
          <a routerLink="/produits" class="btn btn-secondary">Annuler</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; max-width: 700px; }
    .page-header { margin-bottom: 25px; }
    .page-header h2 { margin: 0; color: #1e293b; }
    .form { background: #fff; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    .full-width { grid-column: 1 / -1; }
    label { font-size: 0.85rem; font-weight: 500; color: #374151; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; margin-top: 25px; cursor: pointer; }
    .checkbox-label input { width: 16px; height: 16px; }
    .form-control { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; }
    .form-control:focus { outline: none; border-color: #3b82f6; }
    .form-actions { margin-top: 25px; display: flex; gap: 10px; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; text-decoration: none; display: inline-block; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: #e2e8f0; color: #475569; }
    .btn-secondary:hover { background: #cbd5e1; }
  `]
})
export class ProduitFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  itemId?: number;

  constructor(
    private fb: FormBuilder,
    private service: ProduitService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      reference: [''],
      nom: ['', Validators.required],
      description: [''],
      prix_unitaire_ht: [0, [Validators.required, Validators.min(0)]],
      tva_taux: [20, [Validators.required, Validators.min(0)]],
      unite: ['pièce', Validators.required],
      actif: [true]
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.itemId = +this.route.snapshot.params['id'];
      this.service.getProduit(this.itemId).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const obs = this.isEdit
      ? this.service.updateProduit(this.itemId!, this.form.value)
      : this.service.createProduit(this.form.value);
    obs.subscribe(() => this.router.navigate(['/produits']));
  }
}
