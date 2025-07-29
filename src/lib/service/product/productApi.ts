import {
  Category,
  Product,
  ProductsQueryParams,
  CreateProductRequest,
} from "@/types/ProductType";
import { apiSlide } from "../apislice/apiSlice";

// Add interface for upload response
interface UploadResponse {
  originalname: string;
  filename: string;
  location: string;
}

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
      providesTags: ["Product"],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Fix: Change this to getCategories instead of getCategoryProducts
    getCategories: builder.query<Category[], void>({
      query: () => `categories`,
      providesTags: ["Category"],
    }),

    getCategoryById: builder.query<Category, number>({
      query: (id) => `categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // Fix: Ensure proper create product mutation
    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (newProduct) => ({
        url: "products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
      transformResponse: (response: Product) => {
        console.log("Product created successfully:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("Error creating product:", response);
        return response;
      },
    }),

    updateProduct: builder.mutation<
      Product,
      { id: number; data: Partial<CreateProductRequest> }
    >({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "Product",
      ],
    }),

    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        "Product",
      ],
    }),

    // Add image upload mutation
    uploadImage: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "files/upload",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: UploadResponse) => {
        console.log("Image uploaded successfully:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("Error uploading image:", response);
        return response;
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery, // Fixed: Export the correct hook
  useGetCategoryByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation, // Export the upload image hook
} = productApi;

export default productApi;
