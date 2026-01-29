"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "./SectionTitle";
import SparkleIcon from "./SparkleIcon";
import offersData from "@/data/data.json";
import { useCallback, useMemo, useState } from "react";

export default function SignatureLookSection() {
  const { signatureLook } = offersData;
  const skinTile = signatureLook.tiles.find((tile) => tile.label === "Skin");
  const hairTile = signatureLook.tiles.find((tile) => tile.label === "Hair");
  const bodyTile = signatureLook.tiles.find((tile) => tile.label === "Body");
  const fragranceTile = signatureLook.tiles.find(
    (tile) => tile.label === "Fragrance",
  );
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const totalProducts = signatureLook.products.length;
  const visibleCount = 5;
  type Product = (typeof offersData)["signatureLook"]["products"][number];

  const getProductAt = useCallback(
    (index: number): Product | undefined => {
      if (totalProducts === 0) return undefined;
      const normalized =
        ((index % totalProducts) + totalProducts) % totalProducts;
      return signatureLook.products[normalized];
    },
    [signatureLook.products, totalProducts],
  );

  const visibleProducts = useMemo(() => {
    return Array.from(
      { length: Math.min(visibleCount, totalProducts) },
      (_, i) => getProductAt(startIndex + i),
    ).filter((item): item is Product => Boolean(item));
  }, [startIndex, totalProducts, getProductAt]);

  const handlePrev = () => {
    if (totalProducts === 0) return;
    setDirection(-1);
    setStartIndex((prev) => (prev - 1 + totalProducts) % totalProducts);
  };

  const handleNext = () => {
    if (totalProducts === 0) return;
    setDirection(1);
    setStartIndex((prev) => (prev + 1) % totalProducts);
  };

  const cardVariants = {
    enter: (dir: 1 | -1) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 1 | -1) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <section className="w-full py-12 md:py-20 px-4 bg-[#FFEDFA] relative overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full border border-[#f7a1c4] bg-[#ffeaf5] text-[#c61a6b] text-xs md:text-sm font-medium px-6 py-1.5"
          >
            {signatureLook.subtitle}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <SectionTitle
              title={signatureLook.title}
              className="text-center mb-6 md:mb-12 [&>h2]:text-2xl [&>h2]:md:text-4xl [&>h2]:leading-tight"
            />
          </motion.div>
        </div>

        {/* Top Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative mt-2 md:mt-4"
          >
            <div className="relative w-full aspect-square">
              {/* Custom Sparkles */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-6 right-20 text-[#bfa3f2] z-20"
              >
                <SparkleIcon className="w-16 h-16" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-2 right-8 text-[#bfa3f2] z-20"
              >
                <SparkleIcon className="w-10 h-10" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 left-0 text-[#bfa3f2] z-20"
              >
                <SparkleIcon className="w-14 h-14" />
              </motion.div>

              {/* The main shape wrapper */}
              <div className="relative w-full h-full rounded-r-[30%] overflow-hidden border-2 border-white shadow-[0_0_0_1px_rgba(255,237,250,1),0_0_0_8px_rgba(255,237,250,0.5)]">
                <Image
                  src={signatureLook.heroImage}
                  alt="Signature look"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-1 rounded-r-[30%] border-2 border-[#FFFFFF] pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Right - Tiles */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {skinTile ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative w-full aspect-square rounded-tr-[40px] md:rounded-tr-[80px] overflow-hidden border-2 border-white shadow-[0_0_0_1px_rgba(255,237,250,1),0_0_0_6px_rgba(255,237,250,0.5)]">
                    <Image
                      src={skinTile.image}
                      alt={skinTile.label}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 right-0 bg-gradient-to-tl from-[#9d85c4]/90 to-[#cbb4f5]/80 backdrop-blur-md px-8 py-3 rounded-tl-[30px]">
                      <span className="text-white font-semibold text-xl md:text-2xl tracking-wide">
                        Skin
                      </span>
                    </div>
                    <div className="absolute inset-1 rounded-tr-[35px] md:rounded-tr-[75px] border-2 border-[#FFFFFF]/50 pointer-events-none" />
                  </div>
                </motion.div>
              ) : null}

              {hairTile ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                >
                  <div className="relative w-full aspect-square rounded-tl-[40px] md:rounded-tl-[80px] overflow-hidden border-2 border-white shadow-[0_0_0_1px_rgba(255,237,250,1),0_0_0_6px_rgba(255,237,250,0.5)]">
                    <Image
                      src={hairTile.image}
                      alt={hairTile.label}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-purple-300/20 backdrop-blur-[2px]">
                      <div className="w-32 h-32 bg-purple-400/30 blur-3xl absolute rounded-full"></div>
                      <span className="text-white font-bold text-2xl md:text-4xl drop-shadow-lg z-10 tracking-wide">
                        Hair
                      </span>
                    </div>
                    <div className="absolute inset-1 rounded-tl-[35px] md:rounded-tl-[75px] border-2 border-[#FFFFFF]/50 pointer-events-none" />
                  </div>
                </motion.div>
              ) : null}

              {bodyTile ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="relative w-full aspect-square rounded-br-[40px] md:rounded-br-[80px] overflow-hidden border-2 border-white shadow-[0_0_0_1px_rgba(255,237,250,1),0_0_0_6px_rgba(255,237,250,0.5)]">
                    <Image
                      src={bodyTile.image}
                      alt={bodyTile.label}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#9d85c4]/90 to-[#cbb4f5]/80 backdrop-blur-md px-8 py-3 rounded-bl-[30px]">
                      <span className="text-white font-semibold text-xl md:text-2xl tracking-wide">
                        Body
                      </span>
                    </div>
                    <div className="absolute inset-1 rounded-br-[35px] md:rounded-br-[75px] border-2 border-[#FFFFFF]/50 pointer-events-none" />
                  </div>
                </motion.div>
              ) : null}

              {fragranceTile ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <div className="relative w-full aspect-square rounded-bl-[40px] md:rounded-bl-[80px] overflow-hidden border-2 border-white shadow-[0_0_0_1px_rgba(255,237,250,1),0_0_0_6px_rgba(255,237,250,0.5)]">
                    <Image
                      src={fragranceTile.image}
                      alt={fragranceTile.label}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-gradient-to-br from-[#9d85c4]/90 to-[#cbb4f5]/80 backdrop-blur-md px-8 py-3 rounded-br-[30px]">
                      <span className="text-white font-semibold text-xl md:text-2xl tracking-wide">
                        Fragrance
                      </span>
                    </div>
                    <div className="absolute inset-1 rounded-bl-[35px] md:rounded-bl-[75px] border-2 border-[#FFFFFF]/50 pointer-events-none" />
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Product Row */}
        <div className="mt-10 md:mt-14 relative">
          <div className="hidden md:flex items-center justify-between absolute inset-y-0 w-full pointer-events-none">
            <button
              aria-label="Previous"
              onClick={handlePrev}
              className="pointer-events-auto h-9 w-9 rounded-full border border-[#f7a1c4] bg-white text-[#c61a6b] shadow-sm hover:shadow-md transition-all"
            >
              &#8592;
            </button>
            <button
              aria-label="Next"
              onClick={handleNext}
              className="pointer-events-auto h-9 w-9 rounded-full border border-[#f7a1c4] bg-white text-[#c61a6b] shadow-sm hover:shadow-md transition-all"
            >
              &#8594;
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5 px-0 md:px-12">
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`signature-product ${product.showAddToCart ? "is-featured" : ""}`}
                  onClick={handleNext}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ")
                      handleNext();
                  }}
                >
                  <div className="signature-card group relative bg-white rounded-2xl border border-[#FCE4EC] shadow-[0_8px_20px_rgba(233,30,99,0.08)] overflow-hidden h-full flex flex-col">
                    <span className="signature-badge absolute top-2 left-2 bg-[#FCE4EC] text-[#C2185B] text-[10px] font-semibold px-2 py-0.5 rounded z-10">
                      {product.discount}
                    </span>

                    <div className="relative w-full aspect-square overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="signature-image object-cover"
                      />

                      <div className="signature-overlay absolute inset-0 opacity-0">
                        <div className="absolute inset-0 bg-linear-to-b from-[#7C3AED]/15 via-[#7C3AED]/35 to-[#1f1b4b]/70" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button className="bg-[#8B5CF6] text-white text-[10px] md:text-xs font-medium py-2 px-4 rounded-md shadow-md">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Full-card image on hover */}
                    <div className="signature-cover absolute inset-0 opacity-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-b from-[#7C3AED]/10 via-[#7C3AED]/35 to-[#1f1b4b]/70" />
                    </div>

                    <div className="signature-info p-3 text-center flex-1 flex flex-col justify-center">
                      <div className="flex items-center justify-between w-full gap-2">
                        <p className="text-[#EC7FA9] text-xs md:text-sm font-medium line-clamp-2 text-left">
                          {product.name}
                        </p>
                        <SparkleIcon className="signature-star text-[#FF6FA1] w-3 h-3 drop-shadow-sm shrink-0" />
                      </div>
                      <p className="text-[#AC1754] text-[10px] md:text-xs font-medium">
                        {product.variant}
                      </p>
                      <p className="text-[#7C3AED] text-xs md:text-sm font-semibold mt-1">
                        TK {product.price}
                      </p>
                    </div>

                    {/* Hover Add to Cart (center) */}
                    <div className="signature-hover-cta absolute inset-0 opacity-0 flex items-center justify-center">
                      <button className="bg-[#8B5CF6] text-white text-[10px] md:text-xs font-medium py-2 px-4 rounded-md shadow-md">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 md:mt-10 flex justify-center">
          <button className="bg-[#ffeaf5] cursor-pointer hover:bg-[#ffcce6] text-[#c61a6b] font-medium py-3 px-12 rounded-lg shadow-sm hover:shadow-md transition-all">
            More
          </button>
        </div>
      </div>

      <style jsx>{`
        .signature-tiles {
          align-items: stretch;
        }
        .signature-tile {
          position: relative;
          overflow: hidden;
          border: 2px solid #f6d6e7;
          background: #fff;
          box-shadow: 0 10px 25px rgba(244, 114, 182, 0.15);
          min-height: 150px;
          aspect-ratio: 1 / 1;
        }
        .skin-tile {
          border-radius: 22px;
        }
        .hair-tile {
          border-radius: 22px 48px 48px 22px;
        }
        .body-tile {
          border-radius: 22px 22px 60px 22px;
        }
        .fragrance-tile {
          border-radius: 22px;
        }
        .tile-label {
          position: absolute;
          right: 10px;
          bottom: 10px;
        }
        .tile-label span {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(6px);
          color: #6b6aa3;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 999px;
          box-shadow: 0 6px 12px rgba(107, 106, 163, 0.15);
        }
        .signature-product.is-featured {
          transform: translateY(-8px);
        }
        .signature-card {
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
          cursor: pointer;
        }
        .signature-card:hover {
          transform: scale(1.03);
          box-shadow: 0 14px 30px rgba(233, 30, 99, 0.15);
        }
        .signature-card:hover .signature-overlay {
          opacity: 1;
        }
        .signature-card:hover .signature-cover {
          opacity: 1;
        }
        .signature-card:hover .signature-info {
          opacity: 0;
        }
        .signature-card:hover .signature-hover-cta {
          opacity: 1;
        }
        .signature-card:hover .signature-badge,
        .signature-card:hover .signature-star {
          opacity: 0;
        }
        .signature-cover,
        .signature-overlay,
        .signature-hover-cta,
        .signature-info,
        .signature-badge,
        .signature-star {
          transition: opacity 0.25s ease;
        }
        .signature-image {
          transition: transform 0.35s ease;
        }
        .signature-card:hover .signature-image {
          transform: scale(1.06);
        }
        @media (min-width: 768px) {
          .signature-tile {
            min-height: 180px;
          }
          .hair-tile {
            border-radius: 24px 60px 60px 24px;
          }
          .body-tile {
            border-radius: 24px 24px 70px 24px;
          }
          .tile-label {
            right: 12px;
            bottom: 12px;
          }
          .tile-label span {
            font-size: 14px;
          }
          .signature-product.is-featured {
            transform: translateY(-14px);
          }
        }
      `}</style>
    </section>
  );
}
