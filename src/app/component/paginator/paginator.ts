import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class PaginatorComponent {
  @Input() page = 0;
  @Input() size = 10;
  @Input() pageSizeOptions: number[] = [10, 25, 50];
  @Input() totalElements = 0;
  @Input() isLoading = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();

  get totalPages(): number {
    if (this.size === 0) {
      return 0;
    }
    return Math.ceil(this.totalElements / this.size);
  }

  get showingFrom(): number {
    if (this.totalElements === 0) {
      return 0;
    }
    return this.page * this.size + 1;
  }

  get showingTo(): number {
    if (this.totalElements === 0) {
      return 0;
    }
    const end = (this.page + 1) * this.size;
    return Math.min(end, this.totalElements);
  }

  onSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isNaN(value) && value > 0 && value !== this.size) {
      this.sizeChange.emit(value);
    }
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages || this.isLoading) {
      return;
    }
    this.pageChange.emit(page);
  }

  goToPreviousPage(): void {
    this.goToPage(this.page - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.page + 1);
  }
}
