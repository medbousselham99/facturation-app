import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>Page non trouvée</p>
      <a routerLink="/dashboard" class="btn btn-primary">Retour au dashboard</a>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
    .not-found h1 {
      font-size: 6rem;
      margin: 0;
      color: #3b82f6;
    }
    .not-found p {
      font-size: 1.3rem;
      color: #64748b;
      margin: 10px 0 30px;
    }
    .btn-primary {
      padding: 10px 24px;
      background: #3b82f6;
      color: #fff;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.95rem;
      transition: background 0.2s;
    }
    .btn-primary:hover { background: #2563eb; }
  `]
})
export class NotFoundComponent {}
