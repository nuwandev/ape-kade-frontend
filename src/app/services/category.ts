import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, CategoryResponse } from 'models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8080/categories';
  private readonly http = inject(HttpClient);

  getCategories() {
    return this.http.get<ApiResponse<CategoryResponse[]>>(this.apiUrl, { withCredentials: true });
  }
}
