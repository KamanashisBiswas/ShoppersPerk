"use client";

import footerData from "@/data/data.json";
import Link from "next/link";
import Image from "next/image";
import SocialMedia from "./SocialMedia";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  const { footer, siteLogo } = footerData;

  return (
    <footer className="bg-pink-50/50 pt-16 pb-8 font-fredoka">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
          {/* Social Sharing */}
          <div className="text-center lg:text-left">
            <h3 className="text-[#a91d5b] text-sm md:text-base font-medium mb-4">
              Social Sharing
            </h3>
            <div className="flex justify-center lg:justify-start">
              <SocialMedia />
            </div>
          </div>

          {/* Logo - Center */}
          <div className="text-center flex justify-center">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/logo.png"
                alt="Shoppers Perk"
                width={250}
                height={80}
                className="h-20 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Payment Methods */}
          <div className="text-center lg:text-right">
            <h3 className="text-[#F37199] text-sm md:text-base font-medium mb-4">
              Payment Methods
            </h3>
            <div className="flex gap-3 justify-center lg:justify-end flex-wrap max-w-43.75 lg:mr-0 mx-auto">
              {footer.paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white w-12.5 h-8.75 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-md shadow-sm overflow-hidden"
                >
                  <Image
                    src={method.image}
                    alt={method.name}
                    width={49}
                    height={34}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section - Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 mb-16 text-center lg:text-left">
          {/* Columns 1-3: Links */}
          {footer.columns.map((col, idx) => (
            <div key={idx}>
              <h3 className="text-[#a91d5b] text-lg font-medium mb-6">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#a91d5b] text-sm md:text-base transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Location */}
          <div>
            <h3 className="text-[#a91d5b] text-lg font-medium mb-6">
              Location
            </h3>
            <div className="space-y-6 flex flex-col items-center lg:items-start">
              {footer.contactInfo.locations.map((loc, idx) => (
                <div key={idx} className="flex gap-3 text-left max-w-xs">
                  <FaMapMarkerAlt
                    className="text-[#a91d5b] mt-1 shrink-0"
                    size={16}
                  />
                  <p className="text-gray-600 text-sm whitespace-pre-line">
                    {loc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 5: Phone & Email */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="text-[#a91d5b] text-lg font-medium mb-6">
              Phone No
            </h3>
            <div className="space-y-2 mb-8">
              {footer.contactInfo.phones.map((phone, idx) => (
                <p
                  key={idx}
                  className="text-[#a91d5b] underline text-sm md:text-base"
                >
                  {phone}
                </p>
              ))}
            </div>

            <h3 className="text-[#a91d5b] text-lg font-medium mb-4">Email</h3>
            <div className="space-y-2">
              {footer.contactInfo.emails.map((email, idx) => (
                <p
                  key={idx}
                  className="text-[#a91d5b] underline text-sm md:text-base break-all"
                >
                  {email}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Flags */}
        <div className="flex justify-center gap-6 mb-8 text-sm md:text-base">
          {footer.countries.map((country, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-[#F37199] font-medium"
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-pink-200">
                <Image
                  src={country.image}
                  alt={country.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-[16px] text-[#F37199]">{country.name}</span>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-pink-100 pt-8 text-center">
          <p className="text-[#a91d5b]/70 text-sm">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
