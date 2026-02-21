export type TCustomer = {
  id: string;
  title: string;
  name: string;
  dob: Date;
  salary: number;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};

export type TCategory = {
  id: string;
  name: string;
  slug: string;
  subHeader?: string;
  description?: string;
  icon?: string;
  visibility: 'PUBLIC' | 'HIDDEN' | 'ARCHIVED';
  itemCount: number;
};

export type TInventoryItem = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  alertLevel: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type TOrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'SHIPPED';

export type TOrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type TOrder = {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string | Date;
  status: TOrderStatus;
  items: TOrderItem[];
  totalAmount: number;
  source: string;
};
