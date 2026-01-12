"use client";

import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";

interface WeddingProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    discount: string;
    image: string;
  };
}

export default function WeddingProductCard({
  product,
}: WeddingProductCardProps) {
  return (
    <div
      className="relative bg-white group flex flex-col h-full overflow-hidden"
      style={{
        borderRadius: "20px",
        boxShadow: "0 8px 25px rgba(233, 30, 99, 0.1)", // Soft pink shadow
        border: "1px solid #FCE4EC",
        padding: "16px",
      }}
    >
      {/* Discount Badge */}
      <div
        className="absolute top-6 left-6 z-10 text-xs font-semibold"
        style={{
          backgroundColor: "#FCE4EC", // Very light pink
          color: "#C2185B", // Dark pink text
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        {product.discount}
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow px-1">
        <h3 className="text-[#EC407A] font-medium text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-6">
          <p className="text-[#D81B60] font-bold text-xl">TK {product.price}</p>
          <button className="text-[#F48FB1] hover:text-[#D81B60] transition-colors">
            <FaRegHeart size={24} />
          </button>
        </div>

        {/* Add to Cart Button - Centered Pill Shape */}
        <div className="mt-auto flex justify-center w-full">
          <button
            className="font-semibold transition-all hover:shadow-md transform active:scale-95"
            style={{
              backgroundColor: "#ffadd6", // Matching the specific pink from image
              color: "#880E4F",
              padding: "12px 36px",
              borderRadius: "50px",
              border: "none",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
