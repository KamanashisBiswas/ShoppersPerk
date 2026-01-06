"use client";

import { useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  onCategoryChange?: (categoryId: number) => void;
  className?: string;
}

export default function CategoryTabs({
  categories,
  onCategoryChange,
  className = "",
}: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 1);

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <div
      className={`flex flex-nowrap overflow-x-auto lg:flex-wrap lg:justify-center gap-3 lg:gap-4 px-2 md:px-4 lg:px-0 pb-4 lg:pb-0 ${className}`}
    >
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`px-2 md:px-5 py-2 lg:px-8 lg:py-3 rounded-full text-sm lg:text-lg font-medium transition-all duration-300 font-fredoka whitespace-nowrap shrink-0 ${
            activeCategory === category.id
              ? "bg-[#f8b4d9] text-[#a91d5b] shadow-md"
              : "bg-transparent text-gray-600 hover:bg-pink-100"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
