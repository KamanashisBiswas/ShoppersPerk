"use client";

import Image from "next/image";
import SectionTitle from "./SectionTitle";
import offersData from "@/data/data.json";
import { motion } from "framer-motion";

export default function CraftYourLookSection() {
  const { craftYourLook } = offersData;

  return (
    <>
      <section className="w-full py-16 px-4">
        <div className="container mx-auto">
          <SectionTitle title={craftYourLook.title} className="mb-12" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-0">
            {craftYourLook.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="inline-block w-full"
              >
                {/* look-card-wrapper class added here for hover scope */}
                <div className="look-card-wrapper bg-linear-to-b from-[#F7A8C4] to-[#E53888] p-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="look-card-inner aspect-square w-full">
                    <Image
                      src={item.image}
                      alt={item.label || "Craft your look"}
                      fill
                      className="look-image object-cover"
                    />

                    <div className="look-overlay">
                      <div className="text-center">
                        <span className="text-white text-[14px] md:text-[25px] font-medium font-fredoka block">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .look-card-wrapper {
          position: relative;
        }
        .look-card-inner {
          position: relative;
          overflow: hidden;
          border-radius: 1rem; /* rounded-2xl matches */
          background-color: white;
        }
        .look-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: #e53888;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 20;
          padding: 1rem 0;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        /* Trigger hover on the wrapper */
        .look-card-wrapper:hover .look-overlay {
          transform: translateY(0);
        }
        .look-image {
          transition: transform 0.5s ease;
          position: relative;
          z-index: 1;
        }
        /* Zoom image on hover */
        .look-card-wrapper:hover .look-image {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
}
