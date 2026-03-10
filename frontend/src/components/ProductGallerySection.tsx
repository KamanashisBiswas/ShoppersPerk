"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import CategorySidebar, { Category, FilterOptions } from "./CategorySidebar";
import TagSelector, { ActiveTag } from "./TagSelector";
import ProductCard from "./ProductCard";
import Navbar from "./Navbar";
import MarqueeHeader from "./MarqueeHeader";
import allData from "@/data/data.json";

// ─── Category Config ─────────────────────────────────────────────────────────

interface CategoryConfig {
  label: string;
  banner: string;
  categories: Category[];
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  skincare: {
    label: "Nourish your skin",
    banner: "/images/allProduct/image1.jpg",
    categories: [
      {
        id: "skincare",
        name: "Skin Care",
        count: 500,
        subCategories: [
          { id: "face-wash", name: "Face Wash", count: 120 },
          { id: "moisturizer", name: "Moisturizer", count: 95 },
          { id: "serum", name: "Serum", count: 80 },
          { id: "sunscreen", name: "Sunscreen", count: 75 },
          { id: "toner", name: "Toner", count: 60 },
        ],
      },
      { id: "makeup", name: "Makeup", count: 300 },
      { id: "haircare", name: "Hair Care", count: 200 },
    ],
  },
  makeup: {
    label: "Glow Up Your Look",
    banner: "/images/allProduct/image2.jpg",
    categories: [
      {
        id: "makeup",
        name: "Makeup",
        count: 300,
        subCategories: [
          { id: "foundation", name: "Foundation", count: 80 },
          { id: "lipstick", name: "Lipstick", count: 100 },
          { id: "eyeshadow", name: "Eye Shadow", count: 70 },
          { id: "blush", name: "Blush", count: 50 },
        ],
      },
      { id: "skincare", name: "Skin Care", count: 500 },
      { id: "fragrance", name: "Fragrance", count: 150 },
    ],
  },
  haircare: {
    label: "Love Your Hair",
    banner: "/images/allProduct/image3.jpg",
    categories: [
      {
        id: "haircare",
        name: "Hair Care",
        count: 200,
        subCategories: [
          { id: "shampoo", name: "Shampoo", count: 60 },
          { id: "conditioner", name: "Conditioner", count: 55 },
          { id: "hair-oil", name: "Hair Oil", count: 45 },
          { id: "hair-mask", name: "Hair Mask", count: 40 },
        ],
      },
      { id: "skincare", name: "Skin Care", count: 500 },
    ],
  },
  fragrance: {
    label: "Find Your Scent",
    banner: "/images/allProduct/image4.jpg",
    categories: [
      {
        id: "fragrance",
        name: "Fragrance",
        count: 150,
        subCategories: [
          { id: "perfume", name: "Perfume", count: 70 },
          { id: "body-mist", name: "Body Mist", count: 50 },
          { id: "deodorant", name: "Deodorant", count: 30 },
        ],
      },
      { id: "men", name: "Men", count: 180 },
    ],
  },
  wedding: {
    label: "Bridal Glow Collection",
    banner: "/images/allProduct/image5.jpg",
    categories: [
      {
        id: "wedding",
        name: "Wedding",
        count: 220,
        subCategories: [
          { id: "bridal-kit", name: "Bridal Kit", count: 60 },
          { id: "bridal-makeup", name: "Bridal Makeup", count: 80 },
          { id: "bridal-skincare", name: "Bridal Skin Care", count: 80 },
        ],
      },
      { id: "skincare", name: "Skin Care", count: 500 },
      { id: "makeup", name: "Makeup", count: 300 },
    ],
  },
  festival: {
    label: "Festival Vibrant Looks",
    banner: "/images/allProduct/image6.jpg",
    categories: [
      {
        id: "festival",
        name: "Festival",
        count: 180,
        subCategories: [
          { id: "face-glitter", name: "Face Glitter", count: 50 },
          { id: "bright-lipstick", name: "Bright Lipstick", count: 60 },
          { id: "bold-eyes", name: "Bold Eyes", count: 70 },
        ],
      },
      { id: "makeup", name: "Makeup", count: 300 },
    ],
  },
  birthday: {
    label: "Birthday Glam Specials",
    banner: "/images/allProduct/image1.jpg",
    categories: [
      {
        id: "birthday",
        name: "Birthday",
        count: 160,
        subCategories: [
          { id: "gift-sets", name: "Gift Sets", count: 70 },
          { id: "party-makeup", name: "Party Makeup", count: 90 },
        ],
      },
      { id: "fragrance", name: "Fragrance", count: 150 },
    ],
  },
  baby: {
    label: "Gentle Baby Care",
    banner: "/images/allProduct/image2.jpg",
    categories: [
      {
        id: "baby",
        name: "Baby",
        count: 140,
        subCategories: [
          { id: "baby-wash", name: "Baby Wash", count: 50 },
          { id: "baby-lotion", name: "Baby Lotion", count: 50 },
          { id: "baby-oil", name: "Baby Oil", count: 40 },
        ],
      },
    ],
  },
  men: {
    label: "Men's Grooming",
    banner: "/images/allProduct/image3.jpg",
    categories: [
      {
        id: "men",
        name: "Men",
        count: 180,
        subCategories: [
          { id: "face-wash-men", name: "Face Wash", count: 50 },
          { id: "shaving", name: "Shaving", count: 60 },
          { id: "deodorant-men", name: "Deodorant", count: 70 },
        ],
      },
      { id: "fragrance", name: "Fragrance", count: 150 },
    ],
  },
  clearance: {
    label: "Clearance Sale",
    banner: "/images/allProduct/image4.jpg",
    categories: [
      {
        id: "clearance",
        name: "Clearance",
        count: 400,
        subCategories: [
          { id: "clearance-skin", name: "Skin Care", count: 120 },
          { id: "clearance-makeup", name: "Makeup", count: 150 },
          { id: "clearance-hair", name: "Hair Care", count: 80 },
          { id: "clearance-fragrance", name: "Fragrance", count: 50 },
        ],
      },
    ],
  },
};

const DEFAULT_CONFIG: CategoryConfig = {
  label: "All Products",
  banner: "/images/allProduct/image1.jpg",
  categories: [
    { id: "skincare", name: "Skin Care", count: 500 },
    { id: "makeup", name: "Makeup", count: 300 },
    { id: "haircare", name: "Hair Care", count: 200 },
    { id: "fragrance", name: "Fragrance", count: 150 },
    { id: "men", name: "Men", count: 180 },
  ],
};

// Deterministic brand/color/concern assignment per product id (for demo filtering)
const BRAND_IDS = [
  "medicube",
  "cle-de-peau",
  "the-ordinary",
  "laneige",
  "innisfree",
];
const COLOR_IDS = ["gold", "pink", "white", "rose-gold", "nude"];
const CONCERN_IDS = ["oily", "dry", "combination", "sensitive"];

// ─── Component ───────────────────────────────────────────────────────────────

interface ProductGallerySectionProps {
  categorySlug?: string;
  showHeader?: boolean;
}

export default function ProductGallerySection({
  categorySlug,
  showHeader = false,
}: ProductGallerySectionProps) {
  const config =
    (categorySlug && CATEGORY_CONFIG[categorySlug]) || DEFAULT_CONFIG;
  const defaultCategoryId = config.categories[0]?.id ?? "";
  const products =
    (categorySlug &&
      (
        allData.categoryProducts as Record<
          string,
          typeof allData.categoryProducts.skincare
        >
      )[categorySlug]) ||
    allData.categoryProducts.skincare;
  const filterOptions =
    allData.sidebarFilterOptions as unknown as FilterOptions;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    defaultCategoryId ? [defaultCategoryId] : [],
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    [],
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([15, 10000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("default");
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Active filter tags derived from selections
  const tags: ActiveTag[] = useMemo(() => {
    const catTags = selectedCategories
      .map((id) => {
        const cat = config.categories.find((c) => c.id === id);
        return cat ? { id: cat.id, label: cat.name } : null;
      })
      .filter(Boolean) as ActiveTag[];

    const subTags = selectedSubCategories
      .map((id) => {
        for (const cat of config.categories) {
          const sub = cat.subCategories?.find((s) => s.id === id);
          if (sub) return { id: sub.id, label: sub.name };
        }
        return null;
      })
      .filter(Boolean) as ActiveTag[];

    const ratingTags: ActiveTag[] = selectedRatings.map((r) => ({
      id: `rating-${r}`,
      label: "★".repeat(r) + "☆".repeat(5 - r),
    }));

    const brandTag = selectedBrand
      ? [
          {
            id: selectedBrand,
            label:
              filterOptions.brands.find((b) => b.id === selectedBrand)?.name ??
              selectedBrand,
          },
        ]
      : [];

    const concernTag = selectedConcern
      ? [
          {
            id: selectedConcern,
            label:
              filterOptions.skinConcerns.find((c) => c.id === selectedConcern)
                ?.name ?? selectedConcern,
          },
        ]
      : [];

    const colorTag = selectedColor
      ? [
          {
            id: selectedColor,
            label:
              filterOptions.colors.find((c) => c.id === selectedColor)?.name ??
              selectedColor,
          },
        ]
      : [];

    return [
      ...catTags,
      ...subTags,
      ...ratingTags,
      ...brandTag,
      ...concernTag,
      ...colorTag,
    ];
  }, [
    selectedCategories,
    selectedSubCategories,
    config,
    selectedRatings,
    selectedBrand,
    selectedConcern,
    selectedColor,
    filterOptions,
  ]);

  // Toggle category
  const handleCategoryToggle = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  // Toggle sub-category
  const handleSubCategoryToggle = (id: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  // Remove a tag
  const handleRemoveTag = (id: string) => {
    if (id.startsWith("rating-")) {
      const value = parseInt(id.replace("rating-", ""), 10);
      setSelectedRatings((prev) => prev.filter((r) => r !== value));
    } else if (id === selectedBrand) {
      setSelectedBrand(null);
    } else if (id === selectedConcern) {
      setSelectedConcern(null);
    } else if (id === selectedColor) {
      setSelectedColor(null);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== id));
      setSelectedSubCategories((prev) => prev.filter((s) => s !== id));
    }
  };

  // Sort + filter products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating =
        selectedRatings.length === 0 || selectedRatings.includes(p.rating ?? 5);
      const matchBrand =
        !selectedBrand ||
        BRAND_IDS[Number(p.id) % BRAND_IDS.length] === selectedBrand;
      const matchColor =
        !selectedColor ||
        COLOR_IDS[Number(p.id) % COLOR_IDS.length] === selectedColor;
      const matchConcern =
        !selectedConcern ||
        CONCERN_IDS[Number(p.id) % CONCERN_IDS.length] === selectedConcern;
      return (
        matchSearch &&
        matchPrice &&
        matchRating &&
        matchBrand &&
        matchColor &&
        matchConcern
      );
    });
    if (sortValue === "price_asc")
      result = [...result].sort((a, b) => a.price - b.price);
    if (sortValue === "price_desc")
      result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [
    searchQuery,
    priceRange,
    sortValue,
    products,
    selectedRatings,
    selectedBrand,
    selectedColor,
    selectedConcern,
  ]);

  return (
    <section className="w-full bg-[#FFEDFA] min-h-screen">
      {showHeader && <MarqueeHeader />}

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div
        className={`relative w-full bg-[#FFEDFA] overflow-hidden mb-8 ${
          showHeader ? "h-72 md:h-80 lg:h-100" : "h-44 md:h-56 lg:h-64"
        }`}
      >
        <Image
          src={config.banner}
          alt={config.label}
          fill
          className="object-cover object-center opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#ffe0f4cc] via-[#ffd6ee88] to-transparent" />

        {/* Navbar overlaid — only in standalone / showHeader mode */}
        {showHeader && (
          <div className="absolute top-0 left-0 w-full z-40">
            <div className="relative pt-6 flex justify-center w-full lg:block">
              <Navbar onMenuToggle={setIsMenuOpen} />
            </div>
            <div
              className={`relative flex justify-center lg:justify-end px-4 lg:px-12 mt-4 transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative hidden lg:block">
                  <input
                    type="text"
                    placeholder=""
                    className="w-48 lg:w-64 py-2 pl-10 pr-4 rounded-full bg-white/90 border-none focus:ring-2 focus:ring-pink-400 outline-none text-gray-700 shadow-sm backdrop-blur-sm"
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
                </div>
                <div className="hidden lg:flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-[#a91d5b] flex items-center justify-center text-white hover:bg-pink-700 transition-colors shadow-sm">
                    <FaUser />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-[#a91d5b] flex items-center justify-center text-white hover:bg-pink-700 transition-colors shadow-sm">
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category title */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            showHeader ? "pt-32" : ""
          }`}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#8B1A4A] drop-shadow-sm"
            style={{ fontFamily: "Georgia, serif", letterSpacing: "0.02em" }}
          >
            {config.label}
          </motion.h1>
        </div>
      </div>

      {/* ── Mobile filter drawer overlay ──────────────────────────── */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 bg-[#FFEDFA] overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isFilterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-pink-200">
          <span className="text-[#C84B8E] font-semibold text-base">
            Filters
          </span>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-[#C84B8E] hover:text-[#AC1754] transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>
        <div className="p-4">
          <CategorySidebar
            categories={config.categories}
            selectedCategories={selectedCategories}
            selectedSubCategories={selectedSubCategories}
            priceRange={priceRange}
            maxPrice={10000}
            onCategoryToggle={handleCategoryToggle}
            onSubCategoryToggle={handleSubCategoryToggle}
            onPriceChange={setPriceRange}
            filterOptions={filterOptions}
            selectedRatings={selectedRatings}
            selectedBrand={selectedBrand}
            selectedConcern={selectedConcern}
            selectedColor={selectedColor}
            onRatingToggle={(v) =>
              setSelectedRatings((prev) =>
                prev.includes(v) ? prev.filter((r) => r !== v) : [...prev, v],
              )
            }
            onBrandSelect={(id) =>
              setSelectedBrand((prev) => (prev === id ? null : id))
            }
            onConcernSelect={(id) =>
              setSelectedConcern((prev) => (prev === id ? null : id))
            }
            onColorSelect={(id) =>
              setSelectedColor((prev) => (prev === id ? null : id))
            }
          />
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 pb-12">
        {/* ── Left Sidebar — desktop only ──────────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:block w-52 shrink-0"
        >
          <CategorySidebar
            categories={config.categories}
            selectedCategories={selectedCategories}
            selectedSubCategories={selectedSubCategories}
            priceRange={priceRange}
            maxPrice={10000}
            onCategoryToggle={handleCategoryToggle}
            onSubCategoryToggle={handleSubCategoryToggle}
            onPriceChange={setPriceRange}
            filterOptions={filterOptions}
            selectedRatings={selectedRatings}
            selectedBrand={selectedBrand}
            selectedConcern={selectedConcern}
            selectedColor={selectedColor}
            onRatingToggle={(v) =>
              setSelectedRatings((prev) =>
                prev.includes(v) ? prev.filter((r) => r !== v) : [...prev, v],
              )
            }
            onBrandSelect={(id) =>
              setSelectedBrand((prev) => (prev === id ? null : id))
            }
            onConcernSelect={(id) =>
              setSelectedConcern((prev) => (prev === id ? null : id))
            }
            onColorSelect={(id) =>
              setSelectedColor((prev) => (prev === id ? null : id))
            }
          />
        </motion.aside>

        {/* ── Main Content ──────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Search Bar + mobile filter toggle */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mb-4 flex gap-2"
          >
            <div className="relative flex-1">
              <IoSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white border border-pink-100 rounded-full pl-9 pr-4 py-2.5 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:border-[#C84B8E] shadow-sm transition"
              />
            </div>
            {/* Mobile filter button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-[#C84B8E] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm shrink-0"
            >
              <FaBars size={13} />
              Filter
            </button>
          </motion.div>

          {/* Tags + Sort Row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center flex-wrap gap-2 mb-6"
          >
            <TagSelector
              tags={tags}
              sortValue={sortValue}
              onRemoveTag={handleRemoveTag}
              onClearAll={() => {
                setSelectedCategories(
                  defaultCategoryId ? [defaultCategoryId] : [],
                );
                setSelectedSubCategories([]);
                setSelectedRatings([]);
                setSelectedBrand(null);
                setSelectedConcern(null);
                setSelectedColor(null);
              }}
              onSortChange={setSortValue}
            />
          </motion.div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: (index % 8) * 0.07 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center h-64 text-gray-400"
            >
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
