"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import offersData from "@/data/data.json";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function GlowUpDiariesSection() {
  // Cast offersData to any to bypass stale type definition for the new global key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { glowUpDiaries } = offersData as any;

  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const updateCount = () => setVisibleCount(media.matches ? 2 : 1);
    updateCount();
    media.addEventListener("change", updateCount);
    return () => media.removeEventListener("change", updateCount);
  }, []);

  if (!glowUpDiaries) {
    return null;
  }

  const totalDiaries = glowUpDiaries.diaries.length;

  const handlePrev = () => {
    if (totalDiaries === 0) return;
    setActiveIndex((prev) => (prev - 1 + totalDiaries) % totalDiaries);
  };

  const handleNext = () => {
    if (totalDiaries === 0) return;
    setActiveIndex((prev) => (prev + 1) % totalDiaries);
  };

  const getDiaryAt = (index: number) => {
    if (totalDiaries === 0) return null;
    const normalized = ((index % totalDiaries) + totalDiaries) % totalDiaries;
    return glowUpDiaries.diaries[normalized];
  };

  const visibleDiaries = Array.from({ length: visibleCount }, (_, i) =>
    getDiaryAt(activeIndex + i),
  ).filter(Boolean);

  // For now, we display all items (2 items), but we keep the structure ready for carousel if needed.
  // The design shows header, then a bordered box with arrows and content inside.

  return (
    <section className="w-full py-12 md:py-20 px-4 bg-[#FFEDFA] relative overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 md:gap-4 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full bg-[#ffeaf5] text-[#c61a6b] text-xs md:text-sm font-medium px-6 py-2"
          >
            {glowUpDiaries?.subtitle}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <SectionTitle
              title={glowUpDiaries?.title}
              // className="text-center mb-6 md:mb-12"
            />
          </motion.div>
        </div>

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-white border border-[#ffb6c1] rounded-2xl p-6 md:p-12 hover:shadow-lg transition-shadow duration-300"
        >
          {/* Navigation Arrows */}
          {/* Positioned absolute related to the container */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-1/2 z-10">
            <button
              onClick={handlePrev}
              className="h-10 w-10 bg-[#eebcd4] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#c61a6b] transition-colors focus:outline-none"
              aria-label="Previous diary"
            >
              <FaChevronLeft size={14} />
            </button>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-1/2 z-10">
            <button
              onClick={handleNext}
              className="h-10 w-10 bg-[#eebcd4] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#c61a6b] transition-colors focus:outline-none"
              aria-label="Next diary"
            >
              <FaChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-2 md:px-8">
            {visibleDiaries.map((diary) => (
              <div
                key={diary.id}
                className="flex flex-col items-center text-center h-full"
              >
                <div className="w-full aspect-[1.6] relative rounded-lg overflow-hidden mb-6 bg-gray-100">
                  <Image
                    src={diary.image}
                    alt={diary.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="text-[#c61a6b] font-semibold text-base md:text-lg mb-2">
                  {diary.title}
                </h3>

                <p className="text-[#c61a6b] mb-6 text-xs md:text-sm leading-relaxed max-w-[320px] grow">
                  {diary.description}
                </p>

                <button className="px-10 py-2.5 bg-[#ffeaf5] text-[#c61a6b] rounded-lg font-medium hover:bg-[#c61a6b] hover:text-white transition-all duration-300 shadow-sm mt-auto">
                  {diary.cta}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
