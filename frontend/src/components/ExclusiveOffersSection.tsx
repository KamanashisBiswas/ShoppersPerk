"use client";

import CommonProductCard from "./CommonProductCard";
import offersData from "@/data/data.json";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

export default function ExclusiveOffersSection() {
  const { exclusiveOffers } = offersData;

  return (
    <section className="w-full py-16 px-4 bg-[#FFEDFA] relative overflow-hidden">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-[18px] font-normal md:mt-10 mb-5"
        >
          Exclusive Products
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SectionTitle title="Don't Miss Out Exclusive" className="mb-12" />
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 mb-10"
        >
          {exclusiveOffers.products?.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <CommonProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>

        {/* More Button */}
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
      </div>
    </section>
  );
}
