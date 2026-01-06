"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import SocialMedia from "./SocialMedia";
import Navbar from "./Navbar";
import carouselData from "@/data/data.json";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slides = carouselData.carouselSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const currentData = slides[currentSlide];

  interface CarouselSlide {
    image: string;
    title: string;
    subtitle: string;
    description: string;
    href?: string;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={currentData.image}
          alt="Carousel Slide"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Navbar */}
      <div className="relative z-30 pt-6 flex justify-center w-full lg:block">
        <Navbar onMenuToggle={setIsMenuOpen} />
      </div>

      {/* Search and Icons */}
      <div
        className={`relative z-30 flex justify-center lg:justify-end px-4 lg:px-12 mt-6 lg:mt-6 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder=""
              className="w-48 lg:w-64 py-2 pl-10 pr-4 rounded-full bg-white border-none focus:ring-2 focus:ring-pink-400 outline-none text-gray-700 shadow-sm"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#a91d5b] flex items-center justify-center text-white hover:bg-pink-700 transition-colors shadow-sm">
              <FaUser />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#a91d5b] flex items-center justify-center text-white hover:bg-pink-700 transition-colors shadow-sm">
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="absolute top-1/2 right-4 lg:right-20 -translate-y-1/2 z-20 text-right text-white w-full px-4 lg:w-auto lg:max-w-2xl font-fredoka pointer-events-none">
        <div className="pointer-events-auto">
          <h2 className="text-2xl md:text-5xl lg:text-[4rem] font-light leading-tight opacity-90 wrap-break-word mt-25 md:mt-40">
            {currentData.title}
          </h2>
          <h3 className="text-3xl md:text-6xl lg:text-[5rem] font-medium leading-none mb-2 md:mb-6 italic wrap-break-word">
            {currentData.subtitle}
          </h3>
          <p className="text-white text-xs md:text-lg leading-relaxed mb-4 md:mb-10 ml-auto max-w-[200px] md:max-w-sm">
            {currentData.description}
          </p>

          <div className="flex justify-end">
            <SocialMedia />
          </div>
        </div>
        <div className="flex justify-end mt-6 md:mt-12 mb-4 md:mb-8 pointer-events-auto">
          <Link
            href={(currentData as CarouselSlide).href || "/"}
            className="bg-[#F37199] text-white px-6 py-1.5 md:px-8 md:py-2 rounded-md shadow-md hover:bg-[#d65d83] transition-colors font-medium text-sm md:text-lg"
          >
            Explore
          </Link>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index ? "w-8 bg-[#E53888]" : "w-2 bg-[#F37199]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
