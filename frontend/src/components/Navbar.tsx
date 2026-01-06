"use client";

import Link from "next/link";
import { useState } from "react";
import navData from "@/data/data.json";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";

interface NavbarProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onMenuToggle) {
      onMenuToggle(newState);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    if (onMenuToggle) {
      onMenuToggle(false);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white/80 backdrop-blur-md rounded-full mx-auto max-w-fit px-10 py-3 shadow-sm border border-pink-100 font-fredoka">
        <ul className="flex items-center justify-center gap-6 flex-wrap">
          {navData.navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="text-[#AC1754] font-normal text-[16px] hover:text-[#a91d5b] transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Top Bar (Hamburger Trigger + Icons) */}
      <div className="lg:hidden fixed top-12 right-4 z-9999 flex items-center gap-3">
        <button className="w-10 h-10 rounded-full bg-[#a91d5b] flex items-center justify-center text-white hover:bg-pink-700 transition-colors shadow-lg">
          <FaUser size={18} />
        </button>
        <button className="w-10 h-10 rounded-full bg-[#a91d5b] flex items-center justify-center text-white hover:bg-pink-700 transition-colors shadow-lg">
          <FaShoppingCart size={18} />
        </button>
        <button
          onClick={handleToggle}
          className="w-10 h-10 flex items-center justify-center bg-[#a91d5b] rounded-full shadow-lg text-white hover:bg-pink-700 transition-colors"
        >
          {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-xl z-9998 transition-all duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-col items-center h-full font-fredoka pt-24 pb-8">
          {/* Mobile Search - Fixed at top of menu */}
          <div className="w-full px-8 pb-6 border-b border-pink-100 bg-white/50 backdrop-blur-sm">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-3 pl-12 pr-4 rounded-full bg-pink-50 border border-pink-100 focus:bg-white focus:ring-2 focus:ring-[#a91d5b] outline-none text-gray-700 shadow-sm transition-all"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a91d5b]" />
            </div>
          </div>

          {/* Navigation Links - Scrollable Area */}
          <div className="flex-1 w-full overflow-y-auto mt-4 px-6 no-scrollbar">
            <ul className="flex flex-col items-center gap-4 py-2 w-full">
              {navData.navItems.map((item) => (
                <li key={item.id} className="w-full">
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block w-full py-3 px-6 text-center text-[#AC1754] font-medium text-xl rounded-2xl hover:bg-pink-50 hover:text-[#a91d5b] transition-all active:scale-95 border border-transparent hover:border-pink-100"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
