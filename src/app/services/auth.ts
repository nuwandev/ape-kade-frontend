import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, AuthResponse, Credentials } from 'types/index';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/auth';

  currentUser = signal<AuthResponse | null>(null);

  register(credentials: Credentials) {
    return this.http
      .post<ApiResponse<void>>(`${this.API_URL}/register`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          if (res.success) {
            this.login({
              identifier: credentials.identifier,
              password: credentials.password,
            }).subscribe();
          }
        }),
      );
  }

  login(credentials: Credentials): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.API_URL}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.currentUser.set(res.data);
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
