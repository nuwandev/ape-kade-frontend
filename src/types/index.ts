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

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};