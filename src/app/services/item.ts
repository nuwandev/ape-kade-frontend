import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, ItemRequest, ItemResponse, PageResponse } from 'models';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/items';

  getItems(page: number, size: number, search?: string) {
    return this.http.get<ApiResponse<PageResponse<ItemResponse>>>(this.apiUrl, {
      params: {
        page: page.toString(),
        size: size.toString(),
        search: search || '',
      },
      withCredentials: true,
    });
  }

  addItem(request: ItemRequest) {
    return this.http.post<ApiResponse<ItemResponse>>(this.apiUrl, request, {
      withCredentials: true,
    });
  }

  updateItem(id: string, request: ItemRequest) {
    return this.http.put<ApiResponse<ItemRequest>>(this.apiUrl + `/${id}`, request, {
      withCredentials: true,
    });
  }

  deleteItem(id: string) {
    return this.http.delete<ApiResponse<void>>(this.apiUrl + `/${id}`, { withCredentials: true });
  }
}
