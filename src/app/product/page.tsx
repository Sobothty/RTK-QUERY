"use client";

import { useGetProductsQuery } from "@/lib/service/product/productApi";
import React from "react";
import LoadingPage from "../loading";
import { Product } from "@/types/ProductType";
import ProductCard from "@/components/ProductCard";

const page = () => {
  const { data, error, isLoading } = useGetProductsQuery({});

  if (isLoading) {
    return <LoadingPage />;
  }
  if (error) {
    return <div>Error</div>;
  }

  const products = data as Product[];

  return (
    <section className="w-[90%] mx-auto my-10">
      <h2 className="font-bold text-[24px] text-blue-500 uppercase">
        Product Page
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {products.map((product: Product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
};

export default page;
