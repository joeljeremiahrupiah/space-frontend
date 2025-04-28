import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'coworking-frontend-angular';

  // Inject services
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn$: Observable<boolean>;

  constructor() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  logout(): void {
    this.authService.logout();
  }
}
