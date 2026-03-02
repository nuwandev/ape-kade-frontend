import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from 'types/index';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = 'http://localhost:8080/auth';

  currentUser = signal<AuthResponse | null>(null);

  userInitials = computed(() => {
    const name = this.currentUser()?.fullName;
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  });

  register(data: RegisterRequest): Observable<ApiResponse<void>> {
    return this.http
      .post<ApiResponse<void>>(`${this.API_URL}/register`, data, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          if (res.success) {
            this.login({
              identifier: data.username,
              password: data.password,
            }).subscribe();
          }
        }),
      );
  }

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.API_URL}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.currentUser.set(res.data);
            this.router.navigate(['/dashboard']);
          }
        }),
      );
  }

  logout(): Observable<ApiResponse<void>> {
    return this.http
      .post<ApiResponse<void>>(`${this.API_URL}/logout`, null, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUser.set(null);
        }),
      );
  }

  me(): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .get<ApiResponse<AuthResponse>>(`${this.API_URL}/me`, { withCredentials: true })
      .pipe(
        tap({
          next: (res) => this.currentUser.set(res.data),
          error: () => this.currentUser.set(null),
        }),
      );
  }
}
