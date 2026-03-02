import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/services/auth';
import { ToastService } from '@app/services/toast';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
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
