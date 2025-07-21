export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  creationAt: string;
  updatedAt: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
};

export type ProductsQueryParams = {
  title?: string           // Search by product title
  price?: number           // Exact price
  price_min?: number       // Minimum price range
  price_max?: number       // Maximum price range
  categoryId?: number      // Filter by category ID
  categorySlug?: string    // Filter by category slug
  limit?: number           // Pagination - number of items
  offset?: number          // Pagination - starting index
}
