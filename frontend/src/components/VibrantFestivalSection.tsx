"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import WeddingProductCard from "./WeddingProductCard";
import SectionTitle from "./SectionTitle";
import offersData from "@/data/data.json";
import { AnimatePresence, motion } from "framer-motion";

export default function VibrantFestivalSection() {
  const { vibrantLooks } = offersData;
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const totalProducts = vibrantLooks.products.length;
  const visibleCount = 2;
  type Product = (typeof offersData)["vibrantLooks"]["products"][number];

  const getProductAt = (index: number): Product | undefined => {
    if (totalProducts === 0) return undefined;
    const normalized =
      ((index % totalProducts) + totalProducts) % totalProducts;
    return vibrantLooks.products[normalized];
  };

  const visibleProducts = useMemo(() => {
    return Array.from({ length: visibleCount }, (_, i) =>
      getProductAt(startIndex + i),
    ).filter((item): item is Product => Boolean(item));
  }, [startIndex, totalProducts]);

  const handlePrev = () => {
    if (totalProducts === 0) return;
    setDirection(-1);
    setStartIndex((prev) => (prev - 1 + totalProducts) % totalProducts);
  };

  const handleNext = () => {
    if (totalProducts === 0) return;
    setDirection(1);
    setStartIndex((prev) => (prev + 1) % totalProducts);
  };

  const cardVariants = {
    enter: (dir: 1 | -1) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 1 | -1) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <section className="w-full py-12 md:py-20 px-4 bg-[#FFEDFA] relative overflow-hidden">
      <div className="container mx-auto">
        {/* --- Header Section --- */}
        <div className="flex flex-row-reverse items-end gap-2 md:gap-4 pl-0 md:pl-2 justify-end">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-20 h-28 md:w-32 md:h-36 relative shrink-0"
          >
            <Image
              src="/images/Vibrant/logo.png"
              alt="Festival Icon"
              fill
              className="object-contain"
            />
          </motion.div>

          {/* Title & Subtitle Container */}
          <div className="flex flex-col justify-end pb-1 w-full items-end text-right">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-sm md:text-[18px] font-normal mb-2 md:mb-5"
            >
              {vibrantLooks.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SectionTitle
                title={vibrantLooks.title}
                className="text-right mb-4 md:mb-12 [&>h2]:text-2xl [&>h2]:md:text-4xl [&>h2]:leading-tight"
              />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column - Product Grid */}
          <div className="lg:col-span-7 flex flex-col items-center order-2 lg:order-1">
            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 w-full flex justify-center h-15"
            >
              <Image
                src="/images/Vibrant/logo2.png"
                alt="Decorative Divider"
                width={380}
                height={60}
                className="object-contain opacity-70"
              />
            </motion.div>

            {/* Product Area (stacked look) - Carousel */}
            <div className="relative w-full product-stack">
              {/* Back/peek cards - POSITION RIGHT */}
              <div className="peek-card first">
                <div className="peek-card-inner">
                  {getProductAt(startIndex - 1) && (
                    <Image
                      src={getProductAt(startIndex - 1)!.image}
                      alt="Festival Gift Pack Preview"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="peek-card second">
                <div className="peek-card-inner">
                  {getProductAt(startIndex - 2) && (
                    <Image
                      src={getProductAt(startIndex - 2)!.image}
                      alt="Festival Gift Pack Preview"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Main Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full relative z-10 overflow-hidden">
                <AnimatePresence
                  initial={false}
                  custom={direction}
                  mode="popLayout"
                >
                  {visibleProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      custom={direction}
                      variants={cardVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full"
                      layout
                    >
                      <WeddingProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Slider Buttons */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                aria-label="Previous"
                onClick={handlePrev}
                className="h-11 w-11 rounded-full border border-[#f7a1c4] bg-white text-[#c61a6b] shadow-sm hover:shadow-md transition-all"
              >
                &#8592;
              </button>
              <button
                aria-label="Next"
                onClick={handleNext}
                className="h-11 w-11 rounded-full border border-[#f7a1c4] bg-white text-[#c61a6b] shadow-sm hover:shadow-md transition-all"
              >
                &#8594;
              </button>
            </div>

            {/* More Button */}
            <div className="mt-6">
              <button className="bg-[#ffeaf5] cursor-pointer hover:bg-[#ffcce6] text-[#c61a6b] font-medium py-3 px-12 rounded-lg shadow-sm hover:shadow-md transition-all">
                More
              </button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative mt-4 md:mt-8 lg:mt-24 px-4 md:px-0 order-1 lg:order-2"
          >
            <div className="relative w-full aspect-[3.2/4] rounded-[20px] md:rounded-[30px] p-2">
              {/* Double Border Frame */}
              <div
                className="absolute inset-0 border-2 md:border-[3px] border-white z-20 rounded-[20px] md:rounded-[30px]"
                style={{
                  boxShadow:
                    "inset 0 0 0 2px #f472b6, 0 10px 40px rgba(244, 114, 182, 0.25)",
                }}
              />

              {/* Main Image */}
              <div className="relative w-full h-full rounded-[15px] md:rounded-[25px] overflow-hidden">
                <Image
                  src={vibrantLooks.heroImage}
                  alt="Festival Look"
                  fill
                  className="object-cover"
                  priority
                />

                {/* 'View yours' Overlay */}
                <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-[#881337]/75 backdrop-blur-[2px] py-2 md:py-3 rounded-lg text-center shadow-lg">
                  <p className="text-white text-sm md:text-lg font-medium tracking-wide">
                    View yours
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <style jsx>{`
        .product-stack {
          padding-right: 24px;
        }
        .peek-card {
          position: absolute;
          right: -28px;
          top: 50%;
          transform: translateY(-50%);
          width: 160px;
          height: 220px;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 10px 25px rgba(244, 114, 182, 0.2);
          border: 1px solid #fce4ec;
          z-index: 1;
          overflow: hidden;
          opacity: 0.6;
        }
        .peek-card.second {
          right: -14px;
          top: 50%;
          transform: translateY(calc(-50% + 16px));
          opacity: 0.45;
          z-index: 0;
        }
        .peek-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 18px;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .peek-card {
            right: -36px;
            width: 190px;
            height: 250px;
          }
          .peek-card.second {
            right: -20px;
            transform: translateY(calc(-50% + 20px));
          }
        }
        @media (min-width: 1024px) {
          .peek-card {
            right: -48px;
            width: 210px;
            height: 280px;
          }
          .peek-card.second {
            right: -28px;
            transform: translateY(calc(-50% + 24px));
          }
        }
      `}</style>
    </section>
  );
}
