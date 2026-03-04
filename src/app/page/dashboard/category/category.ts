import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '@app/services/category';
import { ToastService } from '@app/services/toast';
import { CategoryRequest, CategoryResponse } from 'models';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-category',
  imports: [ReactiveFormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly toast = inject(ToastService);

  isModelOpen = signal(false);
  isLoading = signal(false);
  editingCategoryId = signal<string | null>(null);
  isEditing = computed(() => !!this.editingCategoryId());

  categoryForm = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    tagline: ['', [Validators.maxLength(255)]],
    slug: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern('^[a-z0-9]+(?:-[a-z0-9]+)*$'),
      ],
    ],
    visibility: ['PUBLIC', [Validators.required]],
    icon: ['', [Validators.maxLength(255)]],
    seoDescription: ['', [Validators.maxLength(160)]],
  });

  categories = signal<CategoryResponse[]>([]);
  totalCategories = computed(() => this.categories().length);
  searchQuery = signal('');

  constructor() {
    toObservable(
      computed(() => ({
        query: this.searchQuery(),
      })),
    )
      .pipe(
        debounceTime(400),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap(() => this.isLoading.set(true)),
        takeUntilDestroyed(),
        switchMap((params) => this.categoryService.getCategories(params.query)),
      )
      .subscribe({
        next: (res) => {
          this.categories.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toast.show(err?.error.message || 'Error fetching categories', 'error');
          this.isLoading.set(false);
        },
      });
  }

  loadCategories() {
    this.isLoading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.show(err?.error.message || 'Error fetching categories', 'error');
        this.isLoading.set(false);
      },
    });
  }

  onSearch($event: Event) {
    this.searchQuery.set(($event.target as HTMLInputElement).value);
  }

  onSubmit() {
    if (!this.categoryForm.valid) return;

    if (this.isEditing()) {
      this.categoryService
        .updateCategory(this.editingCategoryId()!, this.categoryForm.value as CategoryRequest)
        .subscribe({
          next: (res) => {
            this.toast.show('Category updated successfully!', 'success');
            this.loadCategories();
            this.editingCategoryId.set(null);
            this.closeModel();
          },
          error: (err) => {
            this.toast.show(err?.error.message || 'Error updating category', 'error');
          },
        });
      return;
    }

    this.categoryService.createCategory(this.categoryForm.value as CategoryRequest).subscribe({
      next: (res) => {
        this.toast.show('Category created successfully!', 'success');
        this.loadCategories();
        this.closeModel();
      },
      error: (err) => {
        this.toast.show(err?.error.message || 'Error creating category', 'success');
      },
    });
  }

  onUpdate(cat: CategoryResponse) {
    this.editingCategoryId.set(cat.id);
    this.categoryForm.patchValue({
      displayName: cat.displayName,
      icon: cat.icon,
      seoDescription: cat.seoDescription,
      slug: cat.slug,
      tagline: cat.tagline,
      visibility: cat.visibility,
    });
    this.openModel();
  }

  onDelete(id: string) {
    confirm('Are you sure you want to delete this category') &&
      this.categoryService.deleteCategory(id).subscribe({
        next: (res) => {
          this.toast.show('Category deleted successfully', 'success');
          this.loadCategories();
        },
        error: (err) => {
          this.toast.show(err?.error.message || 'Error deleting category', 'error');
        },
      });
  }

  openModel() {
    this.isModelOpen.set(true);
  }

  closeModel() {
    this.isModelOpen.set(false);
    this.editingCategoryId.set(null);
    this.categoryForm.reset({
      displayName: '',
      tagline: '',
      slug: '',
      visibility: 'PUBLIC',
      icon: '',
      seoDescription: '',
    });
  }
}
