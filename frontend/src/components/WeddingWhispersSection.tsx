"use client";

import Image from "next/image";
import WeddingProductCard from "./WeddingProductCard";
import offersData from "@/data/data.json";
import { motion } from "framer-motion";

export default function WeddingWhispersSection() {
  const { weddingWhispers } = offersData;

  return (
    <section className="w-full py-20 px-4 bg-[#fff9fb] relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* --- Header Section --- */}
        <div className="flex flex-row items-end gap-6 mb-14 pl-2">
          {/* Logo */}
          <div className="w-16 md:w-24 flex-shrink-0">
            <Image
              src="/images/elegant/logo.png"
              alt="Wedding Icon"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col items-start gap-3 pb-2">
            <span className=" text-[#be185d]rounded-full text-sm font-bold tracking-wide">
              {weddingWhispers.subtitle}
            </span>
            <h2 className="text-[#be185d] text-3xl md:text-5xl lg:text-5xl font-bold leading-tight">
              {weddingWhispers.title}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative mt-8 lg:mt-24"
          >
            <div className="relative w-full aspect-[3.2/4] rounded-[30px] p-2">
              {/* Double Border Frame */}
              <div
                className="absolute inset-0 border-[3px] border-white z-20 rounded-[30px]"
                style={{
                  boxShadow:
                    "inset 0 0 0 2px #f472b6, 0 10px 40px rgba(244, 114, 182, 0.25)",
                }}
              />

              {/* --- Ring Decoration: Top Right (Pair) --- */}
              <div className="absolute -top-12 -right-10 z-30 w-32 h-32">
                <Image
                  src="/images/elegant/ringright.png"
                  alt="Wedding Rings"
                  width={140}
                  height={140}
                  className="object-contain drop-shadow-md"
                />
              </div>

              {/* --- Ring Decoration: Bottom Left (Single) --- */}
              <div className="absolute -bottom-10 -left-10 z-30 w-32 h-32">
                <Image
                  src="/images/elegant/ringleft.png"
                  alt="Diamond Ring"
                  width={130}
                  height={130}
                  className="object-contain drop-shadow-md -rotate-12"
                />
              </div>

              {/* Main Image */}
              <div className="relative w-full h-full rounded-[25px] overflow-hidden">
                <Image
                  src={weddingWhispers.heroImage}
                  alt="Bridal Beauty"
                  fill
                  className="object-cover"
                  priority
                />

                {/* 'View yours' Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-[#881337]/75 backdrop-blur-[2px] py-3 rounded-lg text-center shadow-lg">
                  <p className="text-white text-lg font-medium tracking-wide">
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
              className="mb-8 w-full flex justify-center h-[60px]"
            >
              <Image
                src="/images/elegant/logo2.png"
                alt="Decorative Divider"
                width={380}
                height={60}
                className="object-contain opacity-70"
              />
            </motion.div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {weddingWhispers.products.map((product, index) => (
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
              <button className="bg-[#fce7f3] text-[#be185d] px-14 py-3 rounded-[12px] font-bold text-lg hover:shadow-lg hover:bg-[#fbcfe8] hover:-translate-y-1 transition-all duration-300">
                More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
