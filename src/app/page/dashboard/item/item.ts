import { DecimalPipe, NgClass } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginatorComponent } from '@app/component/paginator/paginator';
import { CategoryService } from '@app/services/category';
import { ItemService } from '@app/services/item';
import { ToastService } from '@app/services/toast';
import { CategoryResponse, ItemRequest, ItemResponse } from 'models';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-item',
  imports: [NgClass, DecimalPipe, ReactiveFormsModule, PaginatorComponent],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly itemService = inject(ItemService);
  private readonly toast = inject(ToastService);
  private readonly categoryService = inject(CategoryService);

  isModelOpen = signal(false);
  isEditing = signal(false);
  isLoading = signal(false);
  editingItemId = signal<string | null>(null);

  itemForm = this.fb.group({
    sku: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    currentStock: [0, [Validators.required, Validators.min(0)]],
    alertLevel: [0, [Validators.required, Validators.min(0)]],
    categoryId: ['', Validators.required],
  });

  items = signal<ItemResponse[]>([]);
  totalElements = signal(0);
  page = signal(0);
  size = signal(10);
  categories = signal<CategoryResponse[]>([]);
  searchQuery = signal('');

  constructor() {
    toObservable(
      computed(() => ({
        page: this.page(),
        query: this.searchQuery(),
        size: this.size(),
      })),
    )
      .pipe(
        debounceTime(400),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap(() => this.isLoading.set(true)),
        takeUntilDestroyed(),
        switchMap((params) => this.itemService.getItems(params.page, params.size, params.query)),
      )
      .subscribe({
        next: (res) => {
          this.items.set(res.data.content);
          this.totalElements.set(res.data.totalElements);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toast.show('Error fetching items', 'error');
          this.isLoading.set(false);
        },
      });
  }

  ngOnInit(): void {
    this.getCategories();
  }
  onSearch(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.page.set(0);
  }

  onEdit(item: ItemResponse) {
    this.isEditing.set(true);
    this.editingItemId.set(item.id);
    this.itemForm.patchValue({
      sku: item.sku,
      name: item.name,
      description: item.description,
      price: item.price,
      currentStock: item.currentStock,
      alertLevel: item.alertLevel,
      categoryId: item.category.id,
    });
    this.openModel();
  }

  onDelete(id: string) {
    confirm('Are you sure you want to delete this item?') &&
      this.itemService.deleteItem(id).subscribe({
        next: () => {
          this.toast.show('Item deleted successfully', 'success');
          this.getItems();
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Error deleting item', 'error');
        },
      });
  }

  onModelSubmit() {
    if (this.itemForm.invalid) {
      this.toast.show('Please fill all required fields correctly', 'error');
      return;
    }

    const request: ItemRequest = {
      sku: this.itemForm.value.sku!,
      name: this.itemForm.value.name!,
      description: this.itemForm.value.description || '',
      price: this.itemForm.value.price!,
      currentStock: this.itemForm.value.currentStock!,
      alertLevel: this.itemForm.value.alertLevel!,
      categoryId: this.itemForm.value.categoryId!,
    };

    if (this.isEditing()) {
      this.itemService.updateItem(this.editingItemId()!, request).subscribe({
        next: () => {
          this.toast.show('Item updated successfully', 'success');
          this.getItems();
          this.closeModel();
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Error updating item', 'error');
        },
      });
      return;
    }

    this.itemService.addItem(request).subscribe({
      next: () => {
        this.toast.show('Item added successfully', 'success');
        this.getItems();
        this.closeModel();
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Error adding item', 'error');
      },
    });
  }

  getItems() {
    this.isLoading.set(true);
    this.itemService.getItems(this.page(), this.size(), this.searchQuery()).subscribe({
      next: (res) => {
        this.items.set(res.data.content);
        this.totalElements.set(res.data.totalElements);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Error fetching items', 'error');
        this.isLoading.set(false);
      },
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Error fetching categories', 'error');
      },
    });
  }

  openModel() {
    this.isModelOpen.set(true);
  }

  closeModel() {
    this.itemForm.reset();
    this.isModelOpen.set(false);
  }
}
