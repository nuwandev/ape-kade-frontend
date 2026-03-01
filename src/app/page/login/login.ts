import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth';
import { ToastService } from '@app/services/toast';
import { LoginRequest } from 'types/index';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  isLoading = signal(false);

  loginForm = this.fb.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);

    this.authService.login(this.loginForm.value as LoginRequest).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Login failed', 'error')
        this.isLoading.set(false);
      },
    });
  }
}
