"use client";

import SectionTitle from "./SectionTitle";
import CategoryTabs from "./CategoryTabs";
import offersData from "@/data/data.json";
import { motion } from "framer-motion";

export default function OffersSection() {
  const handleCategoryChange = (categoryId: number) => {
    console.log("Selected category:", categoryId);
    // Handle category change logic here
  };

  return (
    <section className="w-full py-16 px-4 bg-linear-to-b from-white to-pink-50">
      <div className="container mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-[18px] font-normal md:mt-10 mb-5"
        >
          Offers
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SectionTitle title="Today's Best Offers Inside" className="mb-12" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CategoryTabs
            categories={offersData.offerCategories}
            onCategoryChange={handleCategoryChange}
          />
        </motion.div>
      </div>
    </section>
  );
}
