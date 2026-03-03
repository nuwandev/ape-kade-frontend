import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, CategoryRequest, CategoryResponse } from 'models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8080/categories';
  private readonly http = inject(HttpClient);

  getCategories(q: string = '') {
    return this.http.get<ApiResponse<CategoryResponse[]>>(this.apiUrl, {
      params: { q: q },
      withCredentials: true,
    });
  }

  createCategory(request: CategoryRequest) {
    return this.http.post<ApiResponse<CategoryResponse>>(this.apiUrl, request, {
      withCredentials: true,
    });
  }

  updateCategory(id: string, request: CategoryRequest) {
    return this.http.put<ApiResponse<CategoryResponse>>(`${this.apiUrl}/${id}`, request, {
      withCredentials: true,
    });
  }

  deleteCategory(id: string) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  isSlugAvailable(slug: string, excludeId?: string) {
    const url = `${this.apiUrl}/check-slug/${encodeURIComponent(slug)}`;

    return this.http.get<ApiResponse<boolean>>(url, {
      params: excludeId ? { excludeId } : {},
      withCredentials: true,
    });
  }
}
