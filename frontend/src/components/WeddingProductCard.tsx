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
      }}
    >
      <div className="p-3 md:p-4 flex flex-col h-full">
        {/* Discount Badge */}
        <div
          className="absolute top-4 left-4 md:top-6 md:left-6 z-10 text-[10px] md:text-xs font-semibold"
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
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-grow px-0.5">
          <h3 className="text-[#EC7FA9] font-medium text-base md:text-lg mb-1 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-4 md:mb-6">
            <p className="text-[#E53888] font-medium text-lg md:text-xl">
              TK {product.price}
            </p>
            <button className="text-[#F48FB1] hover:text-[#D81B60] transition-colors p-1">
              <FaRegHeart className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Add to Cart Button - Centered Pill Shape */}
          <div className="mt-auto flex justify-center w-full">
            <button className="bg-[#FFB8E0] hover:bg-[#fa86ae] text-[#AC1754] hover:text-white text-[10px] md:text-xs font-medium py-2 px-6 rounded-md shadow-sm transition-all duration-300 cursor-pointer mb-1 w-auto">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
