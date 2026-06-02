import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaiementService } from '../../services/paiement.service';
import { FactureService } from '../../services/facture.service';
import { Facture } from '../../models/facture.model';

function maxMontantValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null || control.value === '') return null;
    return +control.value > max ? { max: { max, actual: control.value } } : null;
  };
}

@Component({
  selector: 'app-paiement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>{{ isEdit ? 'Modifier' : 'Nouveau' }} Paiement</h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <div class="form-grid">
          <div class="form-group">
            <label>Facture</label>
            <select formControlName="facture_id" class="form-control" (change)="onFactureChange()">
              <option [value]="null">Sélectionner une facture</option>
              @for (f of factures; track f.id) {
                <option [value]="f.id">{{ f.numero_facture }} — {{ f.client?.nom }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label>Montant</label>
            <input type="number" step="0.01" formControlName="montant" class="form-control" [class.is-invalid]="form.get('montant')?.errors?.['max']">
            @if (resteDu != null) {
              <small class="hint">Reste dû : <strong>{{ resteDu }} DH</strong></small>
            }
            @if (form.get('montant')?.errors?.['max']) {
              <small class="error">Le montant ne peut pas dépasser {{ resteDu }} DH</small>
            }
          </div>
          <div class="form-group">
            <label>Date paiement</label>
            <input type="date" formControlName="date_paiement" class="form-control">
          </div>
          <div class="form-group">
            <label>Mode de paiement</label>
            <select formControlName="mode_paiement" class="form-control">
              <option value="virement">Virement</option>
              <option value="carte">Carte</option>
              <option value="chèque">Chèque</option>
              <option value="espèces">Espèces</option>
            </select>
          </div>
          <div class="form-group">
            <label>Référence</label>
            <input type="text" formControlName="reference" class="form-control">
          </div>
          <div class="form-group full-width">
            <label>Notes</label>
            <textarea formControlName="notes" class="form-control" rows="2"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
            {{ isEdit ? 'Mettre à jour' : 'Créer' }}
          </button>
          <a routerLink="/paiements" class="btn btn-secondary">Annuler</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; max-width: 750px; }
    .page-header { margin-bottom: 25px; }
    .page-header h2 { margin: 0; color: #1e293b; }
    .form { background: #fff; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    .full-width { grid-column: 1 / -1; }
    label { font-size: 0.85rem; font-weight: 500; color: #374151; }
    .form-control { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; }
    .form-control:focus { outline: none; border-color: #3b82f6; }
    .form-control.is-invalid { border-color: #ef4444; }
    .hint { font-size: 0.75rem; color: #64748b; margin-top: 2px; }
    .hint strong { color: #059669; }
    .error { font-size: 0.75rem; color: #ef4444; margin-top: 2px; }
    .form-actions { margin-top: 25px; display: flex; gap: 10px; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; text-decoration: none; display: inline-block; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: #e2e8f0; color: #475569; }
    .btn-secondary:hover { background: #cbd5e1; }
  `]
})
export class PaiementFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  itemId?: number;
  factures: Facture[] = [];
  resteDu: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: PaiementService,
    private factureService: FactureService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const today = new Date().toISOString().slice(0, 10);
    this.form = this.fb.group({
      facture_id: [null, Validators.required],
      montant: [0, [Validators.required, Validators.min(0.01)]],
      date_paiement: [today, Validators.required],
      mode_paiement: ['virement'],
      reference: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.factureService.getFactures().subscribe(data => this.factures = data);
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.itemId = +this.route.snapshot.params['id'];
      this.service.getPaiement(this.itemId).subscribe(data => {
        this.form.patchValue(data);
        this.onFactureChange();
      });
    }
    if (this.route.snapshot.queryParams['facture_id']) {
      const fid = +this.route.snapshot.queryParams['facture_id'];
      this.form.patchValue({ facture_id: fid });
      this.onFactureChange();
    }
  }

  onFactureChange(): void {
    const fid = this.form.get('facture_id')?.value;
    if (!fid) { this.resteDu = null; return; }
    this.factureService.getFacture(fid).subscribe(f => {
      this.service.getPaiementsByFacture(fid).subscribe(paiements => {
        const totalPaye = paiements.reduce((sum, p) => sum + (+p.montant || 0), 0);
        this.resteDu = f.montant_ttc - totalPaye;
        this.form.get('montant')?.setValidators([
          Validators.required, Validators.min(0.01), maxMontantValidator(this.resteDu)
        ]);
        this.form.get('montant')?.updateValueAndValidity();
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const obs = this.isEdit
      ? this.service.updatePaiement(this.itemId!, this.form.value)
      : this.service.createPaiement(this.form.value);
    obs.subscribe({
      next: () => this.router.navigate(['/paiements']),
      error: (err) => {
        const msg = err.error?.message || 'Erreur lors de la création du paiement';
        alert(msg);
      }
    });
  }
}
