import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth';
import { Credentials } from 'types/index';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);

    this.authService.login(this.loginForm.value as Credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.route.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
        this.isLoading.set(false);
      },
    });
  }
}
