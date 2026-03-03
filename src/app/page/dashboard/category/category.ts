import { PageResponse } from 'models/index';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '@app/services/category';
import { ToastService } from '@app/services/toast';
import { CategoryResponse } from 'models';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-category',
  imports: [],
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
