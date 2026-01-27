"use client";

import Image from "next/image";
import WeddingProductCard from "./WeddingProductCard";
import SectionTitle from "./SectionTitle";
import offersData from "@/data/data.json";
import { motion } from "framer-motion";

export default function VibrantFestivalSection() {
  const { vibrantLooks } = offersData;

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

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {vibrantLooks.products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="h-full"
                >
                  <WeddingProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* More Button */}
            <div className="mt-12">
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
    </section>
  );
}
