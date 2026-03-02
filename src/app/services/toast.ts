import { Injectable, signal } from '@angular/core';

type ToastType = 'success' | 'error' | 'info';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  message = signal<string | null>(null);
  type = signal<ToastType>('info');

  show(message: string, type: ToastType = 'info') {
    this.message.set(message);
    this.type.set(type);

    setTimeout(() => {
      this.message.set(null);
    }, 5000);
  }

  clear() {
    this.message.set(null);
  }
}
