import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth';
import { ToastService } from '@app/services/toast';
import { RegisterRequest } from 'models/index';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  isLoading = signal(false);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]], // business identity
    username: ['', [Validators.required, Validators.minLength(3)]], // terminal id
    email: ['', [Validators.required, Validators.email]], // communication
    password: ['', [Validators.required, Validators.minLength(8)]], // security key
  });
  onRegister() {
    this.isLoading.set(true);
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value as RegisterRequest).subscribe({
        next: () => {
          this.toast.show('Registration successful! Logging you in...', 'success');
          this.isLoading.set(false);
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Registration failed. Please try again.';
          this.toast.show(errorMsg, 'error');
          this.isLoading.set(false);
        },
      });
    }
  }
}
