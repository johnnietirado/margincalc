export interface Product {
  id: string;
  image: string | undefined;
  name: string;
  status: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  nextCursor?: string;
}

// Remove or comment out the mock data if it exists
// export const data: Product[] = [ ... ];
