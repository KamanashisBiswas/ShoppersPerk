"use client";

import Image from "next/image";
import { FaHeart, FaStar } from "react-icons/fa";

interface BuzzProductCardProps {
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

export default function BuzzProductCard({
  id,
  image,
  name,
  variant,
  price,
  discount,
  rating,
  onAddToCart,
  onWishlist,
}: BuzzProductCardProps) {
  return (
    <div className="flex flex-col items-center group">
      {/* Image Container */}
      <div className="relative bg-white w-45 h-52.5 mb-4 p-4 shadow-sm overflow-hidden">
        {/* Discount Badge */}
        <div className="absolute top-2 right-2 bg-[#FFDAE7] text-black px-1.5 py-0.5 text-[10px] font-light z-10">
          {discount}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={onWishlist}
          className="absolute top-8 right-3 text-[#FF8AB3] hover:text-pink-500 transition-colors z-10"
        >
          <FaHeart size={16} />
        </button>

        {/* Image */}
        <div className="relative w-full h-full transition-transform duration-300 hover:scale-110">
          <Image src={image} alt={name} fill className="object-contain" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-[#EC7FA9] font-medium text-sm md:text-base text-center mb-1 transition-transform duration-300 hover:scale-110 cursor-pointer">
        {name}
      </h3>
      <p className="text-[#AC1754] text-xs font-medium mb-2">{variant}</p>

      {/* Rating */}
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            size={10}
            className={i < rating ? "text-[#FF8A65]" : "text-gray-300"}
          />
        ))}
      </div>

      {/* Price */}
      <p className="text-[#B7B1F2] font-medium text-sm md:text-base mb-3">
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
