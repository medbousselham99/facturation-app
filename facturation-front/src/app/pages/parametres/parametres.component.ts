import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ParametreService, CompanySettings } from '../../services/parametre.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Paramètres</h2>
      </div>

      <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="settings-form">
        <div class="section">
          <h3>Informations de l'entreprise</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Nom entreprise *</label>
              <input type="text" formControlName="nom_entreprise" class="form-control">
            </div>
            <div class="form-group">
              <label>Logo (URL)</label>
              <input type="text" formControlName="logo" class="form-control" placeholder="https://...">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Adresse</label>
              <input type="text" formControlName="adresse" class="form-control">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Ville</label>
              <input type="text" formControlName="ville" class="form-control">
            </div>
            <div class="form-group">
              <label>Code postal</label>
              <input type="text" formControlName="code_postal" class="form-control">
            </div>
            <div class="form-group">
              <label>Pays</label>
              <input type="text" formControlName="pays" class="form-control">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>SIRET</label>
              <input type="text" formControlName="siret" class="form-control">
            </div>
            <div class="form-group">
              <label>ICE</label>
              <input type="text" formControlName="ice" class="form-control">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" class="form-control">
            </div>
            <div class="form-group">
              <label>Téléphone</label>
              <input type="tel" formControlName="telephone" class="form-control">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>RIB</label>
              <input type="text" formControlName="rib" class="form-control">
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Configuration financière</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Taux TVA par défaut (%)</label>
              <input type="number" formControlName="tva_taux_defaut" class="form-control">
            </div>
            <div class="form-group">
              <label>Délai de paiement (jours)</label>
              <input type="number" formControlName="delai_paiement_jours" class="form-control">
            </div>
          </div>
        </div>

        <div class="section">
          <h3>E-mail</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Adresse expéditeur</label>
              <input type="email" formControlName="email_expediteur" class="form-control">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Objet devis</label>
              <input type="text" formControlName="objet_devis" class="form-control">
            </div>
            <div class="form-group">
              <label>Objet facture</label>
              <input type="text" formControlName="objet_facture" class="form-control">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Corps devis</label>
              <textarea formControlName="corps_devis" class="form-control" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label>Corps facture</label>
              <textarea formControlName="corps_facture" class="form-control" rows="4"></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="settingsForm.invalid">Enregistrer</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; max-width: 900px; }
    .page-header { margin-bottom: 25px; }
    .page-header h2 { margin: 0; color: #1e293b; font-size: 1.5rem; }
    .settings-form { display: flex; flex-direction: column; gap: 30px; }
    .section { background: #fff; border-radius: 10px; padding: 25px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .section h3 { margin: 0 0 20px 0; font-size: 1.05rem; color: #1e293b; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
    .form-row { display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; }
    .form-group { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 5px; }
    .form-group label { font-size: 0.85rem; color: #64748b; font-weight: 500; }
    .form-control { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; transition: border-color 0.2s; }
    .form-control:focus { outline: none; border-color: #3b82f6; }
    textarea.form-control { resize: vertical; font-family: inherit; }
    .form-actions { display: flex; justify-content: flex-end; }
    .btn { padding: 10px 24px; border: none; border-radius: 6px; font-size: 0.9rem; cursor: pointer; font-weight: 500; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class ParametresComponent implements OnInit {
  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private parametreService: ParametreService,
    private toastService: ToastService
  ) {
    this.settingsForm = this.fb.group({
      nom_entreprise: [''],
      logo: [''],
      adresse: [''],
      ville: [''],
      code_postal: [''],
      pays: [''],
      siret: [''],
      ice: [''],
      email: [''],
      telephone: [''],
      rib: [''],
      tva_taux_defaut: [20],
      delai_paiement_jours: [30],
      email_expediteur: [''],
      objet_devis: [''],
      objet_facture: [''],
      corps_devis: [''],
      corps_facture: ['']
    });
  }

  ngOnInit(): void {
    this.parametreService.getSettings().subscribe({
      next: (data) => this.settingsForm.patchValue(data),
      error: () => this.toastService.error('Erreur lors du chargement des paramètres')
    });
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) return;
    this.parametreService.saveSettings(this.settingsForm.value).subscribe({
      next: () => this.toastService.success('Paramètres enregistrés'),
      error: () => this.toastService.error('Erreur lors de l\'enregistrement')
    });
  }
}
