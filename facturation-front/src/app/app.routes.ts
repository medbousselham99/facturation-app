import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientListComponent } from './pages/clients/client-list.component';
import { ClientFormComponent } from './pages/clients/client-form.component';
import { ClientDetailComponent } from './pages/clients/client-detail.component';
import { FournisseurListComponent } from './pages/fournisseurs/fournisseur-list.component';
import { FournisseurFormComponent } from './pages/fournisseurs/fournisseur-form.component';
import { DevisListComponent } from './pages/devis/devis-list.component';
import { DevisFormComponent } from './pages/devis/devis-form.component';
import { DevisDetailComponent } from './pages/devis/devis-detail.component';
import { CommandeListComponent } from './pages/commandes/commande-list.component';
import { CommandeFormComponent } from './pages/commandes/commande-form.component';
import { CommandeDetailComponent } from './pages/commandes/commande-detail.component';
import { BonDeCommandeListComponent } from './pages/bons-de-commande/bon-de-commande-list.component';
import { BonDeCommandeFormComponent } from './pages/bons-de-commande/bon-de-commande-form.component';
import { BonDeCommandeDetailComponent } from './pages/bons-de-commande/bon-de-commande-detail.component';
import { FactureListComponent } from './pages/factures/facture-list.component';
import { FactureFormComponent } from './pages/factures/facture-form.component';
import { FactureDetailComponent } from './pages/factures/facture-detail.component';
import { ProduitListComponent } from './pages/produits/produit-list.component';
import { ProduitFormComponent } from './pages/produits/produit-form.component';
import { PaiementListComponent } from './pages/paiements/paiement-list.component';
import { PaiementFormComponent } from './pages/paiements/paiement-form.component';
import { AvoirListComponent } from './pages/avoirs/avoir-list.component';
import { AvoirFormComponent } from './pages/avoirs/avoir-form.component';
import { AvoirDetailComponent } from './pages/avoirs/avoir-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'clients', component: ClientListComponent, canActivate: [authGuard] },
  { path: 'clients/new', component: ClientFormComponent, canActivate: [authGuard] },
  { path: 'clients/:id', component: ClientDetailComponent, canActivate: [authGuard] },
  { path: 'clients/:id/edit', component: ClientFormComponent, canActivate: [authGuard] },
  { path: 'fournisseurs', component: FournisseurListComponent, canActivate: [authGuard] },
  { path: 'fournisseurs/new', component: FournisseurFormComponent, canActivate: [authGuard] },
  { path: 'fournisseurs/:id/edit', component: FournisseurFormComponent, canActivate: [authGuard] },
  { path: 'devis', component: DevisListComponent, canActivate: [authGuard] },
  { path: 'devis/new', component: DevisFormComponent, canActivate: [authGuard] },
  { path: 'devis/:id', component: DevisDetailComponent, canActivate: [authGuard] },
  { path: 'devis/:id/edit', component: DevisFormComponent, canActivate: [authGuard] },
  { path: 'commandes', component: CommandeListComponent, canActivate: [authGuard] },
  { path: 'commandes/new', component: CommandeFormComponent, canActivate: [authGuard] },
  { path: 'commandes/:id', component: CommandeDetailComponent, canActivate: [authGuard] },
  { path: 'commandes/:id/edit', component: CommandeFormComponent, canActivate: [authGuard] },
  { path: 'bons-de-commande', component: BonDeCommandeListComponent, canActivate: [authGuard] },
  { path: 'bons-de-commande/new', component: BonDeCommandeFormComponent, canActivate: [authGuard] },
  { path: 'bons-de-commande/:id', component: BonDeCommandeDetailComponent, canActivate: [authGuard] },
  { path: 'bons-de-commande/:id/edit', component: BonDeCommandeFormComponent, canActivate: [authGuard] },
  { path: 'factures', component: FactureListComponent, canActivate: [authGuard] },
  { path: 'factures/new', component: FactureFormComponent, canActivate: [authGuard] },
  { path: 'factures/:id', component: FactureDetailComponent, canActivate: [authGuard] },
  { path: 'factures/:id/edit', component: FactureFormComponent, canActivate: [authGuard] },
  { path: 'produits', component: ProduitListComponent, canActivate: [authGuard] },
  { path: 'produits/new', component: ProduitFormComponent, canActivate: [authGuard] },
  { path: 'produits/:id/edit', component: ProduitFormComponent, canActivate: [authGuard] },
  { path: 'paiements', component: PaiementListComponent, canActivate: [authGuard] },
  { path: 'paiements/new', component: PaiementFormComponent, canActivate: [authGuard] },
  { path: 'paiements/:id/edit', component: PaiementFormComponent, canActivate: [authGuard] },
  { path: 'avoirs', component: AvoirListComponent, canActivate: [authGuard] },
  { path: 'avoirs/new', component: AvoirFormComponent, canActivate: [authGuard] },
  { path: 'avoirs/:id', component: AvoirDetailComponent, canActivate: [authGuard] },
  { path: 'avoirs/:id/edit', component: AvoirFormComponent, canActivate: [authGuard] },
];
