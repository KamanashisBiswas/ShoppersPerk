"use client";

import Image from "next/image";
import SectionTitle from "./SectionTitle";
import offersData from "@/data/data.json";
import { motion } from "framer-motion";

export default function SoftCareSection() {
  const { softCare } = offersData;

  const topProducts = softCare.products.slice(0, 4);
  const bottomProducts = softCare.products.slice(4, 6);

  return (
    <section className="w-full py-12 md:py-20 px-4 bg-[#FFEDFA] relative overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-[#f7a1c4] bg-white text-[#c61a6b] text-xs md:text-sm font-medium px-6 py-1.5"
          >
            {softCare.subtitle}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <SectionTitle
              title={softCare.title}
              className="text-center mt-4 mb-10 md:mb-14 [&>h2]:text-2xl [&>h2]:md:text-4xl [&>h2]:leading-tight"
            />
          </motion.div>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          {/* Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 md:gap-8">
            {/* Left Column - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-full"
            >
              <div className="relative w-full h-full rounded-[26px] p-2 min-h-75">
                <div
                  className="absolute inset-0 border-2 border-white z-20 rounded-[26px]"
                  style={{
                    boxShadow:
                      "inset 0 0 0 2px #f9cde1, 0 10px 35px rgba(244, 114, 182, 0.2)",
                  }}
                />

                <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-white">
                  <Image
                    src={softCare.heroImage}
                    alt="Soft care hero"
                    fill
                    className="object-cover"
                    priority
                  />

                  <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-[#881337]/75 backdrop-blur-[2px] py-2 md:py-3 rounded-lg text-center shadow-lg">
                    <p className="text-white text-sm md:text-lg font-medium tracking-wide">
                      View yours
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - 2x2 Products */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="soft-care-card h-full"
                >
                  <div className="relative bg-white rounded-[18px] border border-[#FCE4EC] shadow-[0_8px_20px_rgba(233,30,99,0.08)] overflow-hidden h-full flex flex-col">
                    <span className="absolute top-3 left-3 bg-[#FCE4EC] text-[#C2185B] text-[10px] font-semibold px-2 py-0.5 rounded z-10">
                      {product.discount}
                    </span>

                    <div className="relative w-full aspect-4/3 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.showAddToCart ? (
                        <div className="absolute inset-x-0 bottom-0 top-0 bg-linear-to-t from-[#F06292]/60 via-transparent to-transparent" />
                      ) : null}
                    </div>

                    {product.showAddToCart ? (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full px-4 flex justify-center">
                        <button className="bg-[#F8BBD0] text-[#880E4F] text-xs md:text-sm font-bold py-2.5 px-8 rounded-xl shadow-lg hover:bg-[#F48FB1] hover:text-white transition-all w-fit whitespace-nowrap">
                          Add to Cart
                        </button>
                      </div>
                    ) : null}

                    {!product.showAddToCart && (
                      <div className="p-3 text-center flex-1 flex flex-col justify-center">
                        <p className="text-[#EC7FA9] text-xs md:text-sm font-medium">
                          {product.name}
                        </p>
                        <p className="text-[#E53888] text-xs md:text-sm font-semibold">
                          TK {product.price}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Row - 2 Columns (Aligned with Top) + Absolute Button between them */}
          <div className="relative grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative bg-white rounded-[18px] border border-[#FCE4EC] shadow-[0_8px_20px_rgba(233,30,99,0.08)] overflow-hidden">
                <span className="absolute top-2 left-2 bg-[#FCE4EC] text-[#C2185B] text-[10px] font-semibold px-2 py-0.5 rounded z-10">
                  {bottomProducts[0].discount}
                </span>

                <div className="relative w-full aspect-5/2 overflow-hidden">
                  <Image
                    src={bottomProducts[0].image}
                    alt={bottomProducts[0].name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-3 text-center">
                  <p className="text-[#EC7FA9] text-xs md:text-sm font-medium">
                    {bottomProducts[0].name}
                  </p>
                  <p className="text-[#E53888] text-xs md:text-sm font-semibold">
                    TK {bottomProducts[0].price}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-full"
            >
              <div className="relative bg-white rounded-[18px] border border-[#FCE4EC] shadow-[0_8px_20px_rgba(233,30,99,0.08)] overflow-hidden w-[70%] ml-auto h-full flex flex-col">
                <span className="absolute top-2 left-2 bg-[#FCE4EC] text-[#C2185B] text-[10px] font-semibold px-2 py-0.5 rounded z-10">
                  {bottomProducts[1].discount}
                </span>

                <div className="relative w-full flex-1 overflow-hidden">
                  <Image
                    src={bottomProducts[1].image}
                    alt={bottomProducts[1].name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-3 text-center">
                  <p className="text-[#EC7FA9] text-xs md:text-sm font-medium">
                    {bottomProducts[1].name}
                  </p>
                  <p className="text-[#E53888] text-xs md:text-sm font-semibold">
                    TK {bottomProducts[1].price}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Centered Absolute Button */}
            <div className="absolute top-1/2 left-[49%] -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="flex items-center justify-center w-40 h-40 md:w-64 md:h-64 transition-transform hover:scale-105">
                <Image
                  src="/images/softCare/logo.png"
                  alt="Logo"
                  width={250}
                  height={250}
                  className="object-contain w-36 h-36 md:w-60 md:h-60"
                />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mt-10 md:mt-14"
        >
          <button className="bg-[#ffeaf5] cursor-pointer hover:bg-[#ffcce6] text-[#c61a6b] font-medium py-3 px-12 rounded-lg shadow-sm hover:shadow-md transition-all">
            More
          </button>
        </motion.div>
      </div>
    </section>
  );
}
