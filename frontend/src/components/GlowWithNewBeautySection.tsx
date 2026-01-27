"use client";

import Image from "next/image";
import SectionTitle from "./SectionTitle";
import ProductCard from "./ProductCard";
import offersData from "@/data/data.json";
import { motion } from "framer-motion";
import SparkleIcon from "./SparkleIcon";

export default function GlowWithNewBeautySection() {
  const { glowWithNewBeauty } = offersData;

  return (
    <section className="w-full py-16 px-4 bg-[#FFEDFA] relative overflow-hidden">
      {/* Background gradient hint */}
      <div className="absolute left-0 top-0 w-1/2 h-full bg-linear-to-br from-pink-50/50 to-transparent -z-10 pointer-events-none" />

      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          {/* Left Column - Title & Products */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[50%] order-2 lg:order-1"
          >
            <div className="flex justify-start mb-8 md:mb-10">
              <div className="text-left">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center text-[18px] font-normal md:mt-10 mb-5"
                >
                  Hot & new
                </motion.p>
                <motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <SectionTitle
                      title="Glow with New Beauty"
                      className="text-left md:ml-0"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
              {glowWithNewBeauty.products?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center"
            >
              <button className="bg-[#ffeaf5] cursor-pointer hover:bg-[#ffcce6] text-[#c61a6b] font-medium py-3 px-12 rounded-lg shadow-sm hover:shadow-md transition-all">
                More
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-[50%] flex justify-center lg:justify-start relative order-1 lg:order-2"
          >
            <div className="relative w-full max-w-162.5 aspect-4/5">
              {/* Custom Sparkles */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-6 left-20 text-[#ff8ab3] z-20"
              >
                <SparkleIcon className="w-12 h-12" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-2 left-8 text-[#ff8ab3] z-20"
              >
                <SparkleIcon className="w-8 h-8" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 right-0 text-[#ff8ab3] z-20"
              >
                <SparkleIcon className="w-10 h-10" />
              </motion.div>

              {/* The main shape wrapper */}
              <div className="relative w-full h-full rounded-[45%] overflow-hidden border-2 border-white shadow-[0_0_0_1px_rgba(234,246,250,1),0_0_0_8px_rgba(234,246,250,0.5)]">
                <Image
                  src={glowWithNewBeauty.heroImage}
                  alt="Glow with New Beauty"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-1 rounded-[45%] border-2 border-[#FFFFFF] pointer-events-none" />
              </div>

              {/* Best Sells Badge */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-[#f8b4d9]/50 backdrop-blur-md px-6 py-2 rounded-lg border border-white/40 shadow-sm">
                <span className="text-[#a91d5b] font-medium text-lg whitespace-nowrap">
                  {glowWithNewBeauty.heroBadge}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
