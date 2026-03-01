export type Credentials = {
  identifier: string;
  password: string;
  email?: string;
  fullName?: string;
};
export interface CustomerResponse {
  id: string;
  title: string;
  name: string;
  dob: string;
  salary: number;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export type CategoryVisibility = 'PUBLIC' | 'HIDDEN' | 'ARCHIVED';

export interface CategoryResponse {
  id: string;
  displayName: string;
  tagline: string;
  slug: string;
  visibility: CategoryVisibility;
  icon: string;
  seoDescription: string;
  createdAt: string;
  itemCount: number;
}

export interface ItemResponse {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  currentStock: number;
  alertLevel: number;
  category: CategoryResponse;
  updatedAt: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
