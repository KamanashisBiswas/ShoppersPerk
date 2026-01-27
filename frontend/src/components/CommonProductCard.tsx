"use client";

import Image from "next/image";
import { FaHeart, FaStar } from "react-icons/fa";

interface ExclusiveProductCardProps {
  id: number;
  image: string;
  name: string;
  variant: string;
  price: string | number;
  discount: string;
  rating: number;
  onAddToCart?: () => void;
  onWishlist?: () => void;
}

export default function ExclusiveProductCard({
  
  image,
  name,
  variant,
  price,
  discount,
  rating,
  onAddToCart,
  onWishlist,
}: ExclusiveProductCardProps) {
  return (
    <div className="flex flex-col items-center group">
      {/* Image Container - Bigger */}
      <div className="relative bg-white w-full h-64 md:h-72 mb-5 p-5 shadow-md overflow-hidden">
        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-[#FFDAE7] text-black px-2 py-1 text-xs font-light z-10">
          {discount}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={onWishlist}
          className="absolute top-10 right-3 text-[#FF8AB3] hover:text-pink-500 transition-colors z-10"
        >
          <FaHeart size={18} />
        </button>

        {/* Image */}
        <div className="relative w-full h-full transition-transform duration-300 hover:scale-110">
          <Image src={image} alt={name} fill className="object-contain" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-[#EC7FA9] font-medium text-base md:text-lg text-center mb-1.5 transition-transform duration-300 hover:scale-110 cursor-pointer">
        {name}
      </h3>
      <p className="text-[#AC1754] text-sm font-medium mb-2.5">{variant}</p>

      {/* Rating */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            size={12}
            className={i < rating ? "text-[#FF8A65]" : "text-gray-300"}
          />
        ))}
      </div>

      {/* Price - Bigger */}
      <p className="text-[#B7B1F2] font-medium text-lg md:text-xl mb-4">
        TK {price}
      </p>

      {/* Add To Cart Button */}
      <button
        onClick={onAddToCart}
        className="bg-[#FFB8E0] hover:bg-[#fa86ae] text-[#AC1754] hover:text-white text-[10px] md:text-xs font-medium py-2 px-6 rounded-md shadow-sm transition-all duration-300 cursor-pointer"
      >
        Add to Cart
      </button>
    </div>
  );
}
