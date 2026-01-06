"use client";

import SectionTitle from "./SectionTitle";
import CategoryTabs from "./CategoryTabs";
import offersData from "@/data/data.json";

export default function OffersSection() {
  const handleCategoryChange = (categoryId: number) => {
    console.log("Selected category:", categoryId);
    // Handle category change logic here
  };

  return (
    <section className="w-full py-16 px-4 bg-linear-to-b from-white to-pink-50">
      <div className="container mx-auto">
        <p className="text-center text-[18px] font-normal mt-10 mb-5">Offer</p>
        <SectionTitle title="Today's Best Offers Inside" className="mb-12" />
        <CategoryTabs
          categories={offersData.offerCategories}
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </section>
  );
}
