import { Product } from "@/types/ProductType";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useAppDispatch } from "@/lib/hook";
import { addToCart } from "@/lib/features/cartSlice";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add wishlist functionality here
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      {/* Product Image Section */}
      <Link
        href={`/product/${product.id}`}
        className="block relative overflow-hidden"
      >
        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            src={product.images[0]}
            alt={product.title}
            unoptimized
            priority
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Sale Badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            SALE
          </div>

          {/* Quick Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
            >
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            </button>
            <Link
              href={`/product/${product.id}`}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
            >
              <Eye className="w-4 h-4 text-gray-600 hover:text-blue-500" />
            </Link>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
              {product.category.name}
            </span>
          </div>
        </div>
      </Link>

      {/* Product Info Section */}
      <div className="p-6">
        <Link href={`/product/${product.id}`} className="block">
          {/* Rating Stars */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">(4.5)</span>
          </div>

          {/* Product Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
            {product.title}
          </h3>

          {/* Product Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              <span className="text-lg text-gray-400 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-green-600 font-medium">20% OFF</div>
          </div>
        </Link>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingCart className="w-5 h-5 group-hover/btn:animate-bounce" />
          Add to Cart
        </button>
      </div>

      {/* Loading State Overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 invisible transition-all duration-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
};

export default ProductCard;
