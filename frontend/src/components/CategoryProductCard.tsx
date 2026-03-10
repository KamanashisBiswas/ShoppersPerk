"use client";

import Image from "next/image";
import { FaHeart, FaStar } from "react-icons/fa";
import { useState } from "react";

export interface Product {
  id: number | string;
  name: string;
  variant?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  rating?: number;
}

interface CategoryProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
}

export default function CategoryProductCard({
  product,
  onAddToCart,
  onWishlist,
}: CategoryProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="flex flex-col items-center group">
      {/* Image Container */}
      <div className="relative bg-white w-full aspect-4/5 mb-4 p-4 shadow-sm overflow-hidden">
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 right-2 bg-[#FFDAE7] text-black px-1.5 py-0.5 text-[10px] font-light z-10">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => {
            setWishlisted((prev) => !prev);
            onWishlist?.(product);
          }}
          className={`absolute top-8 right-3 transition-colors z-10 ${
            wishlisted ? "text-pink-500" : "text-[#FF8AB3]"
          } hover:text-pink-500`}
        >
          <FaHeart size={16} />
        </button>

        {/* Image */}
        <div className="relative w-full h-full transition-transform duration-300 hover:scale-110">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-[#EC7FA9] font-medium text-sm md:text-base text-center mb-1 transition-transform duration-300 hover:scale-105 cursor-pointer">
        {product.name}
      </h3>

      {/* Variant */}
      {product.variant && (
        <p className="text-[#AC1754] text-xs font-medium mb-2">
          {product.variant}
        </p>
      )}

      {/* Rating Stars */}
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            size={10}
            className={
              i < (product.rating ?? 5) ? "text-[#FF8A65]" : "text-gray-300"
            }
          />
        ))}
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mb-3">
        <p className="text-[#B7B1F2] font-medium text-sm md:text-base">
          TK {product.price.toLocaleString()}
        </p>
        {product.oldPrice && (
          <p className="text-gray-400 text-xs line-through">
            TK {product.oldPrice.toLocaleString()}
          </p>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart?.(product)}
        className="bg-[#FFB8E0] hover:bg-[#fa86ae] text-[#AC1754] hover:text-white text-[10px] md:text-xs font-medium py-2 px-6 rounded-md shadow-sm transition-all duration-300 cursor-pointer"
      >
        Add to Cart
      </button>
    </div>
  );
}
