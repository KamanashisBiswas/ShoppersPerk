"use client";

import Image from "next/image";
import WeddingProductCard from "./WeddingProductCard";
import SectionTitle from "./SectionTitle";
import offersData from "@/data/data.json";
import { motion } from "framer-motion";

export default function BirthdayGlamSection() {
  const { birthdayGlam } = offersData;

  return (
    <section className="w-full py-12 md:py-20 px-4 bg-[#FFEDFA] relative overflow-hidden">
      <div className="container mx-auto">
        {/* --- Header Section --- */}
        <div className="flex flex-col items-start gap-3 md:gap-4 pl-0 md:pl-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full border border-[#f7a1c4] bg-[#ffeaf5] text-[#c61a6b] text-xs md:text-sm font-medium px-5 py-1.5"
          >
            {birthdayGlam.subtitle}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SectionTitle
              title={birthdayGlam.title}
              className="text-left mb-4 md:mb-12 [&>h2]:text-2xl [&>h2]:md:text-4xl [&>h2]:leading-tight"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative mt-4 md:mt-8 lg:mt-24 px-4 md:px-0"
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
                  src={birthdayGlam.heroImage}
                  alt="Birthday Glam"
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

          {/* Right Column */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 w-full flex justify-center h-15"
            >
              <Image
                src="/images/birthday/logo2.png"
                alt="Decorative Divider"
                width={380}
                height={60}
                className="object-contain opacity-70"
              />
            </motion.div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {birthdayGlam.products.map((product, index) => (
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
        </div>
      </div>
    </section>
  );
}
