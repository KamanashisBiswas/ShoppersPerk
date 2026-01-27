"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface OfferCardProps {
  id: number;
  image: string;
  price: string | number;
  originalPrice: string | number;
  endTime: string; // e.g. "1d 6h 43m"
  bgColor: string; // e.g. "#ffeaf2" or "bg-pink-100"
  onView?: () => void;
  onBuy?: () => void;
}

export default function OfferCard({
  
  image,
  price,
  originalPrice,
  endTime,
  bgColor,
  onView,
  onBuy,
}: OfferCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="relative w-full aspect-3/5 md:aspect-[3/4.5] rounded-[30px] overflow-hidden shadow-lg group"
    >
      {/* Top Image Section - Takes up full height initially, background for bottom */}
      <div className="absolute top-0 left-0 w-full h-[75%] bg-gray-100">
        <Image
          src={image}
          alt="Offer Product"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Bottom Info Section - Overlaps with Custom Curved Top */}
      <div
        className="absolute bottom-0 left-0 w-full h-[35%] flex flex-col pt-8 md:pt-10 pb-4 px-4 z-10 rounded-t-[30px]"
        style={{
          backgroundColor: bgColor,
        }}
      >
        {/* Buy Button - Positioned at the intersection */}
        <div className="absolute -top-8 left-8 z-20">
          <button
            onClick={onBuy}
            className="w-16 h-16 rounded-full bg-[#FF9ABE] hover:bg-[#eb5e8d] text-white flex items-center justify-center font-medium text-[16px] shadow-md transition-all duration-300 hover:scale-110"
          >
            BUY
          </button>
        </div>

        {/* End Time */}
        <div className="text-right text-[#E53888] text-[14px] md:text-sm font-normal mb-1 md:mb-2">
          End in - <span className="text-pink-600">{endTime}</span>
        </div>

        <div className="flex flex-col items-center mt-auto">
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#F37199] font-medium text-lg md:text-2xl">
              TK {price}
            </span>
            <span className="text-gray-400 text-xs md:text-sm line-through">
              TK {originalPrice}
            </span>
          </div>

          {/* View Button */}
          <button
            onClick={onView}
            className="bg-white/80 hover:bg-white text-gray-700 hover:text-pink-600 text-xs md:text-sm font-medium py-1.5 px-8 rounded-full shadow-sm transition-all duration-300"
          >
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
}
