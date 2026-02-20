import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PageResponse, TCustomer } from 'types/index';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe, DatePipe],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly API_URL = 'http://localhost:8080/customers';
  math = Math;

  page = signal(0);
  size = signal(10);
  searchQuery = signal('');
  showModal = signal(false);
  currentEditId = signal<string | null>(null);

  customerResponse = signal<PageResponse<TCustomer> | null>(null);

  isEditMode = computed(() => !!this.currentEditId());

  customerList = computed(() => this.customerResponse()?.content ?? []);
  totalElements = computed(() => this.customerResponse()?.totalElements ?? 0);
  totalPages = computed(() => this.customerResponse()?.totalPages ?? 0);

  customerForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    dob: [''],
    salary: [0, [Validators.min(0)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    province: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
  });

  constructor() {
    toObservable(computed(() => ({ page: this.page(), query: this.searchQuery() })))
      .pipe(
        debounceTime(400),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        switchMap(({ page, query }) => this.fetchData(page, query)),
      )
      .subscribe((res) => this.customerResponse.set(res));
  }

  private fetchData(page: number, query: string) {
    if (query.trim()) {
      return this.http.get<PageResponse<TCustomer>>(`${this.API_URL}/search`, {
        params: { q: query },
      });
    }

    return this.http.get<PageResponse<TCustomer>>(this.API_URL, {
      params: {
        page: page.toString(),
        size: this.size().toString(),
        sortBy: 'id',
        direction: 'asc',
      },
    });
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.page.set(0);
  }

  goToPage(p: number) {
    this.page.set(p);
  }

  openModal(customer?: TCustomer) {
    this.currentEditId.set(customer?.id || null);
    this.showModal.set(true);
    if (customer) {
      const formattedDate = customer.dob ? new Date(customer.dob).toISOString().split('T')[0] : '';
      this.customerForm.patchValue({ ...customer, dob: formattedDate });
    } else {
      this.customerForm.reset({ salary: 0 });
    }
  }

  closeModal() {
    this.showModal.set(false);
    this.customerForm.reset();
  }

  saveCustomer() {
    if (this.customerForm.invalid) return;
    const obs$ = this.isEditMode()
      ? this.http.put(`${this.API_URL}/${this.currentEditId()}`, this.customerForm.value)
      : this.http.post(this.API_URL, this.customerForm.value);

    obs$.subscribe(() => {
      this.refreshData();
      this.closeModal();
    });
  }

  deleteCustomer(id: string) {
    if (confirm('Delete?')) {
      this.http.delete(`${this.API_URL}/${id}`).subscribe(() => this.refreshData());
    }
  }

  private refreshData() {
    this.fetchData(this.page(), this.searchQuery()).subscribe((res) =>
      this.customerResponse.set(res),
    );
  }
}
