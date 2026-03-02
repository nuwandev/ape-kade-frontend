import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@app/services/auth';
import { ToastService } from '@app/services/toast';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  onLogout() {
    this.auth.logout().subscribe({
      next: () => {
        this.toast.show('Logged out successfully', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast.show('Logout failed', 'error');
      },
    });
  }
}
