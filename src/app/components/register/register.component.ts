import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registrationData = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  isRegistering = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Inject services
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() { }

  onSubmit(): void {

    this.isRegistering = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.register(this.registrationData).subscribe({
      next: (response) => {
        this.isRegistering = false;
        this.successMessage = 'Registration successful! Please log in.';
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        setTimeout(() => {
          this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });
        }, 1500);
      },
      error: (err) => {
        console.log('err object', err);
        this.isRegistering = false;
        if (err.status === 400 && err.error) {
          this.errorMessage = err.error;
        } else if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        }
        else {
          this.errorMessage = 'Registration failed. Please check your details and try again.';
        }
      }
    });
  }

}
