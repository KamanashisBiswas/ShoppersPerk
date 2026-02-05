
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialMedia from "./SocialMedia";
import Navbar from "./Navbar";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import api from "@/utils/api";

interface CarouselSlide {
    _id: string;
    carouselId?: string; // Optional custom ID from backend
    image: string;
    title: string;
    subtitle: string;
    description: string;
    href?: string;
}

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const res = await api.get('/carousel');
              if (Array.isArray(res.data)) {
                  const activeSlides = res.data.filter((slide: any) => slide.isActive !== false);
                  setSlides(activeSlides);
              }
          } catch (error) {
              console.error("Failed to fetch carousel data:", error);
          } finally {
              setLoading(false);
          }
      };
      
      fetchData();
  }, []);

  const nextSlide = useCallback(() => {
     if (slides.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
     }
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return; // Don't set interval if no slides
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  const currentData = slides.length > 0 ? slides[currentSlide] : null;

  if (loading) {
      return (
          <div className="w-full h-[600px] lg:h-[750px] bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
          </div>
      );
  }

  if (!currentData) {
      return null; // Or return a default empty state
  }

  return (
    <div className="relative w-full h-[600px] lg:h-[750px] overflow-hidden bg-gray-900">
          
      {/* Full Screen Background Image */}
      <AnimatePresence>
        {currentData && (
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={currentData.image}
            alt="Carousel Slide"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-black/20" /> 
        </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar & Top UI - Absolutely positioned over the SLIDER */}
      <div className="absolute top-0 left-0 w-full z-40">
            <div className="relative pt-6 flex justify-center w-full lg:block">
                <Navbar onMenuToggle={setIsMenuOpen} />
            </div>
            {/* Search and Icons */}
            <div
                className={`relative flex justify-center lg:justify-end px-4 lg:px-12 mt-6 lg:mt-6 transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            >
                <div className="flex items-center gap-4 flex-wrap justify-center">
                <div className="relative hidden lg:block">
                    <input
                    type="text"
                    placeholder=""
                    className="w-48 lg:w-64 py-2 pl-10 pr-4 rounded-full bg-white/90 border-none focus:ring-2 focus:ring-pink-400 outline-none text-gray-700 shadow-sm backdrop-blur-sm"
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
      </div>

        {/* Text Content */}
        {currentData && (
      <div className="absolute top-1/2 right-4 lg:right-20 -translate-y-1/2 z-30 text-right text-white w-full px-4 lg:w-auto lg:max-w-2xl font-fredoka pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentData.title + currentSlide}
            className="pointer-events-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-5xl lg:text-[4rem] font-light leading-tight opacity-90 wrap-break-word mt-25 md:mt-40 drop-shadow-lg"
            >
              {currentData.title}
            </motion.h2>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-6xl lg:text-[5rem] font-medium leading-none mb-2 md:mb-6 italic wrap-break-word drop-shadow-lg"
            >
              {currentData.subtitle}
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white text-xs md:text-lg leading-relaxed mb-4 md:mb-10 ml-auto max-w-50 md:max-w-sm drop-shadow-md"
            >
              {currentData.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-end"
            >
              <SocialMedia />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end mt-6 md:mt-12 mb-4 md:mb-8"
            >
              <Link
                href={currentData.href || "/"}
                className="bg-[#F37199] text-white px-6 py-1.5 md:px-8 md:py-2 rounded-md shadow-md hover:bg-[#d65d83] transition-colors font-medium text-sm md:text-lg"
              >
                Explore
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
        )}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all shadow-sm ${
              currentSlide === index ? "w-8 bg-[#E53888]" : "w-2 bg-[#F37199]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
