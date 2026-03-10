"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronRight, FaStar } from "react-icons/fa";

export interface Category {
  id: string;
  name: string;
  count: number;
  subCategories?: { id: string; name: string; count: number }[];
}

export interface FilterOptions {
  ratingCounts: { value: number; count: number }[];
  brands: { id: string; name: string; count: number }[];
  skinConcerns: { id: string; name: string; count: number }[];
  colors: { id: string; name: string; count: number }[];
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategories: string[];
  selectedSubCategories: string[];
  priceRange: [number, number];
  maxPrice: number;
  onCategoryToggle: (id: string) => void;
  onSubCategoryToggle: (id: string) => void;
  onPriceChange: (range: [number, number]) => void;
  filterOptions: FilterOptions;
  selectedRatings: number[];
  selectedBrand: string | null;
  selectedConcern: string | null;
  selectedColor: string | null;
  onRatingToggle: (value: number) => void;
  onBrandSelect: (id: string) => void;
  onConcernSelect: (id: string) => void;
  onColorSelect: (id: string) => void;
}

export default function CategorySidebar({
  categories,
  selectedCategories,
  selectedSubCategories,
  priceRange,
  maxPrice,
  onCategoryToggle,
  onSubCategoryToggle,
  onPriceChange,
  filterOptions,
  selectedRatings,
  selectedBrand,
  selectedConcern,
  selectedColor,
  onRatingToggle,
  onBrandSelect,
  onConcernSelect,
  onColorSelect,
}: CategorySidebarProps) {
  // Tracks which sub-category accordions are open
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories
      .filter((c) => c.subCategories)
      .map((c) => c.id)
      .slice(0, 1),
  );

  // Tracks which filter sections are collapsed (closed)
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  };

  const isOpen = (key: string) => !collapsedSections.includes(key);

  // Reusable section header with collapse toggle
  const renderHeader = (label: string, sectionKey: string) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between mb-3 group"
    >
      <h3 className="text-[#C84B8E] font-semibold text-sm">{label}</h3>
      <span className="text-[#C84B8E] text-[11px] transition-transform duration-200">
        {isOpen(sectionKey) ? <FaChevronDown /> : <FaChevronRight />}
      </span>
    </button>
  );

  return (
    <div className="w-full space-y-4">
      {/* ── 1. Filter Price ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        {renderHeader("Filter Price", "price")}
        {isOpen("price") && (
          <>
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) =>
                onPriceChange([priceRange[0], Number(e.target.value)])
              }
              className="w-full accent-[#C84B8E] mb-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span className="bg-[#FFEDFA] border border-pink-200 px-2 py-0.5 rounded">
                TK {priceRange[0]}
              </span>
              <span className="bg-[#FFEDFA] border border-pink-200 px-2 py-0.5 rounded">
                TK {priceRange[1].toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── 2. Category ───────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        {renderHeader("Category", "category")}
        {isOpen("category") && (
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    onCategoryToggle(cat.id);
                    if (cat.subCategories) toggleExpand(cat.id);
                  }}
                  className="w-full flex items-center justify-between py-1.5 px-1 rounded hover:bg-pink-50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    {cat.subCategories ? (
                      <span className="text-[#C84B8E] text-[10px]">
                        {expandedCategories.includes(cat.id) ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </span>
                    ) : (
                      <span className="w-3" />
                    )}
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => onCategoryToggle(cat.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-[#C84B8E] w-3 h-3 shrink-0"
                    />
                    <span
                      className={`text-sm ${
                        selectedCategories.includes(cat.id)
                          ? "text-[#C84B8E] font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#FFD6EC] text-[#C84B8E] px-2 py-0.5 rounded-full font-medium">
                    {cat.count}
                  </span>
                </button>

                {cat.subCategories && expandedCategories.includes(cat.id) && (
                  <ul className="ml-5 mt-1 space-y-1">
                    {cat.subCategories.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => onSubCategoryToggle(sub.id)}
                          className="w-full flex items-center justify-between py-1 px-1 rounded hover:bg-pink-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedSubCategories.includes(sub.id)}
                              onChange={() => onSubCategoryToggle(sub.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="accent-[#C84B8E] w-3 h-3"
                            />
                            <span
                              className={`text-xs ${
                                selectedSubCategories.includes(sub.id)
                                  ? "text-[#C84B8E] font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {sub.name}
                            </span>
                          </div>
                          <span className="text-[10px] bg-[#FFD6EC] text-[#C84B8E] px-1.5 py-0.5 rounded-full font-medium">
                            {sub.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Sort by Rating ────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        {renderHeader("Sort by Rating", "rating")}
        {isOpen("rating") && (
          <ul className="space-y-2">
            {filterOptions.ratingCounts.map((r) => (
              <li key={r.value}>
                <button
                  onClick={() => onRatingToggle(r.value)}
                  className="w-full flex items-center justify-between py-1 px-1 rounded hover:bg-pink-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(r.value)}
                      onChange={() => onRatingToggle(r.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-[#C84B8E] w-3.5 h-3.5 shrink-0"
                    />
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={11}
                          className={
                            i < r.value ? "text-[#FF8A65]" : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#FFD6EC] text-[#C84B8E] px-2 py-0.5 rounded-full font-medium">
                    {r.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Brand ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        {renderHeader("Brand", "brand")}
        {isOpen("brand") && (
          <ul className="space-y-2">
            {filterOptions.brands.map((brand) => (
              <li key={brand.id}>
                <button
                  onClick={() => onBrandSelect(brand.id)}
                  className="w-full flex items-center justify-between py-1 px-1 rounded hover:bg-pink-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedBrand === brand.id}
                      onChange={() => onBrandSelect(brand.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-[#C84B8E] w-3.5 h-3.5 shrink-0"
                    />
                    <span
                      className={`text-sm ${
                        selectedBrand === brand.id
                          ? "text-[#C84B8E] font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {brand.name}
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#FFD6EC] text-[#C84B8E] px-2 py-0.5 rounded-full font-medium">
                    {brand.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Skin Concerns ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        {renderHeader("Skin Concerns", "concern")}
        {isOpen("concern") && (
          <ul className="space-y-2">
            {filterOptions.skinConcerns.map((concern) => (
              <li key={concern.id}>
                <button
                  onClick={() => onConcernSelect(concern.id)}
                  className="w-full flex items-center justify-between py-1 px-1 rounded hover:bg-pink-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedConcern === concern.id}
                      onChange={() => onConcernSelect(concern.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-[#C84B8E] w-3.5 h-3.5 shrink-0"
                    />
                    <span
                      className={`text-sm ${
                        selectedConcern === concern.id
                          ? "text-[#C84B8E] font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {concern.name}
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#FFD6EC] text-[#C84B8E] px-2 py-0.5 rounded-full font-medium">
                    {concern.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Color ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        {renderHeader("Color", "color")}
        {isOpen("color") && (
          <ul className="space-y-2">
            {filterOptions.colors.map((color) => (
              <li key={color.id}>
                <button
                  onClick={() => onColorSelect(color.id)}
                  className="w-full flex items-center justify-between py-1 px-1 rounded hover:bg-pink-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedColor === color.id}
                      onChange={() => onColorSelect(color.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-[#C84B8E] w-3.5 h-3.5 shrink-0"
                    />
                    <span
                      className={`text-sm ${
                        selectedColor === color.id
                          ? "text-[#C84B8E] font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {color.name}
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#FFD6EC] text-[#C84B8E] px-2 py-0.5 rounded-full font-medium">
                    {color.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
