"use client";

import SectionTitle from "./SectionTitle";
import CategoryTabs from "./CategoryTabs";
import offersData from "@/data/data.json";
import { motion } from "framer-motion";
import OfferCard from "./OfferCard";
import { useState } from "react";

export default function OffersSection() {
  const [selectedCategory, setSelectedCategory] = useState(
    offersData.offerCategories[0]?.id || 1
  );

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  const filteredOffers = offersData.offers
    .filter((offer) => offer.categoryId === selectedCategory)
    .slice(0, 4);

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

        {/* Offers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 px-2 md:px-0">
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              id={offer.id}
              image={offer.image}
              price={offer.price}
              originalPrice={offer.originalPrice}
              endTime={offer.endTime}
              bgColor={offer.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
