"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const images = [
  "/images/allProduct/image1.jpg",
  "/images/allProduct/image2.jpg",
  "/images/allProduct/image3.jpg",
  "/images/allProduct/image4.jpg",
  "/images/allProduct/iamge5.jpg", // Note the typo in filename
  "/images/allProduct/image6.jpg",
];

export default function ProductGallerySection() {
  return (
    <section className="w-full bg-[#FFEDFA] pt-16">
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative w-full aspect-[9/16] lg:aspect-[3/5] group overflow-hidden"
            >
              <Image
                src={src}
                alt={`Product Gallery ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Optional Overlay on Hover */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
