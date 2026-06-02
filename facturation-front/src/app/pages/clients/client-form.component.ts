import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>{{ isEdit ? 'Modifier' : 'Nouveau' }} Client</h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <div class="form-grid">
          <div class="form-group">
            <label>Nom</label>
            <input type="text" formControlName="nom" class="form-control">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control">
          </div>
          <div class="form-group">
            <label>Téléphone</label>
            <input type="text" formControlName="telephone" class="form-control">
          </div>
          <div class="form-group">
            <label>Adresse</label>
            <input type="text" formControlName="adresse" class="form-control">
          </div>
          <div class="form-group">
            <label>Ville</label>
            <input type="text" formControlName="ville" class="form-control">
          </div>
          <div class="form-group">
            <label>Code Postal</label>
            <input type="text" formControlName="code_postal" class="form-control">
          </div>
          <div class="form-group">
            <label>Pays</label>
            <input type="text" formControlName="pays" class="form-control">
          </div>
          <div class="form-group">
            <label>SIRET</label>
            <input type="text" formControlName="siret" class="form-control">
          </div>
          <div class="form-group full-width">
            <label>Notes</label>
            <textarea formControlName="notes" class="form-control" rows="3"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
            {{ isEdit ? 'Mettre à jour' : 'Créer' }}
          </button>
          <a routerLink="/clients" class="btn btn-secondary">Annuler</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { padding: 30px; max-width: 800px; }
    .page-header { margin-bottom: 30px; }
    .page-header h2 { margin: 0; color: #1e293b; }
    .form { background: #fff; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    .full-width { grid-column: 1 / -1; }
    label { font-size: 0.85rem; font-weight: 500; color: #374151; }
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
export class ClientFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  clientId?: number;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      adresse: [''],
      ville: [''],
      code_postal: [''],
      pays: [''],
      siret: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.clientId = +this.route.snapshot.params['id'];
      this.clientService.getClient(this.clientId).subscribe(client => {
        this.form.patchValue(client);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (this.isEdit) {
      this.clientService.updateClient(this.clientId!, this.form.value).subscribe(() => {
        this.router.navigate(['/clients']);
      });
    } else {
      this.clientService.createClient(this.form.value).subscribe(() => {
        this.router.navigate(['/clients']);
      });
    }
  }
}
