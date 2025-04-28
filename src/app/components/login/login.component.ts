import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  credentials = {
    username: '',
    password: ''
  };
  isLoggingIn = false;
  errorMessage: string | null = null;

  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() { }

  onSubmit(): void {
    console.log('Login form submitted:', this.credentials);
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }

    this.isLoggingIn = true;
    this.errorMessage = null;

    this.authService.login(this.credentials).subscribe({
      next: (data) => {
        console.log('Login successful:', data);
        this.isLoggingIn = false;
        // Check for returnUrl
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        console.log('Login successful, navigating to:', returnUrl);
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoggingIn = false;
        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Login failed. Please try again later.';
        }
      }
    });
  }

}
