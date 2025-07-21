import { Product, ProductsQueryParams } from "@/types/ProductType";
import { apiSlide } from "../apislice/apiSlice";

const productApi = apiSlide.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductsQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        if (params.title) {
          searchParams.append("title", params.title);
        }
        if (params.price !== undefined) {
          searchParams.append("price", params.price.toString());
        }
        if (params.price_min !== undefined) {
          searchParams.append("price_min", params.price_min.toString());
        }
        if (params.price_max !== undefined) {
          searchParams.append("price_max", params.price_max.toString());
        }
        if (params.categoryId !== undefined) {
          searchParams.append("categoryId", params.categoryId.toString());
        }
        if (params.categorySlug) {
          searchParams.append("categorySlug", params.categorySlug);
        }
        if (params.limit !== undefined) {
          searchParams.append("limit", params.limit.toString());
        }
        if (params.offset !== undefined) {
          searchParams.append("offset", params.offset.toString());
        }

        return `products?${searchParams.toString()}`;
      },
    }),
    getProductById: builder.query<Product, number>({
      // Get Product By ID
      query: (id) => `products/${id}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;

export default productApi;