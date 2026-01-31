"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import SectionTitle from "./SectionTitle";

export default function RequestProductSection() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    // Filter out limits if needed, here we just take the first 2 if strict, or append up to 2
    // User requirement: "2ta image upload kora jabe" (can upload 2 images)
    
    setFiles((prev) => {
      const remainingSlots = 2 - prev.length;
      if (remainingSlots <= 0) return prev;
      
      const filesToAdd = newFiles.slice(0, remainingSlots);
      return [...prev, ...filesToAdd];
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="w-full py-16 px-4 bg-[#FFEDFA]">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="bg-[#FFF0F5] text-[#AC1754] px-6 py-2 rounded-full mb-4 text-sm font-medium">
            Request for Products
          </div>
          <SectionTitle title="Request for products what you want" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          {/* Left Side: Form */}
          <div className="w-full lg:w-3/5 bg-[#FFF0F5] rounded-3xl p-8 md:p-12 shadow-sm">
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              {/* Name Fields */}
              <div>
                <label className="block text-[#FA5252] text-sm font-medium mb-2">
                  Name *
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full">
                    <input
                      type="text"
                      className="w-full bg-white rounded-xl border border-pink-100 px-4 py-3 text-gray-700 focus:outline-none focus:border-[#AC1754]"
                    />
                    <span className="text-[#FA5252] text-xs mt-1 block">
                      First
                    </span>
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      className="w-full bg-white rounded-xl border border-pink-100 px-4 py-3 text-gray-700 focus:outline-none focus:border-[#AC1754]"
                    />
                    <span className="text-[#FA5252] text-xs mt-1 block">
                      Last
                    </span>
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-[#FA5252] text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    className="w-full bg-white rounded-xl border border-pink-100 px-4 py-3 text-gray-700 focus:outline-none focus:border-[#AC1754] placeholder-pink-200"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-[#FA5252] text-sm font-medium mb-2">
                    Phone *
                  </label>
                  <div className="flex bg-white rounded-xl border border-pink-100 overflow-hidden">
                    <div className="flex items-center px-3 border-r border-pink-100 bg-white">
                      {/* Placeholder for Flag Icon */}
                      <div className="w-6 h-4 bg-green-600 relative rounded-sm overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
                      </div>
                      <svg
                        className="w-3 h-3 ml-2 text-pink-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      placeholder="+88012222222"
                      className="w-full px-4 py-3 text-gray-700 focus:outline-none placeholder-pink-200"
                    />
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-[#FA5252] text-sm font-medium mb-2">
                  Products name or model *
                </label>
                <input
                  type="text"
                  className="w-full bg-white rounded-xl border border-pink-100 px-4 py-3 text-gray-700 focus:outline-none focus:border-[#AC1754]"
                />
              </div>

              {/* Description */}
              <div className="border border-dashed border-pink-200 p-4 rounded-xl bg-white/50 relative">
                <label className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-[#FFF0F5] px-2 text-[#FA5252] text-sm font-medium">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-white rounded-xl border border-pink-100 px-4 py-3 text-gray-700 focus:outline-none focus:border-[#AC1754] resize-none"
                ></textarea>
              </div>

              {/* File Upload Area */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Upload Box */}
                <div
                  className="w-full md:w-1/2 bg-white border-2 border-black rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[160px] cursor-pointer hover:bg-gray-50 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleBrowse}
                >
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx" // Broaden as per design "any file" but focus images
                  />
                  <div className="mb-4 relative">
                    {/* Image Icon */}
                    <svg
                      width="56"
                      height="48"
                      viewBox="0 0 56 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="56" height="48" rx="8" fill="#FEE2E2" />
                      <path
                        d="M16 16C16 14.8954 16.8954 14 18 14H22C23.1046 14 24 14.8954 24 16V20C24 21.1046 23.1046 22 22 22H18C16.8954 22 16 21.1046 16 20V16Z"
                        fill="#FCA5A5"
                      />
                      <path
                        d="M42 34L32 20L18 36"
                        stroke="#FCA5A5"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M28 36L34 28L40 36"
                        stroke="#FCA5A5"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {/* Upload Arrow Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-[#F43F5E] rounded-full p-1.5 border-4 border-white">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="text-base font-normal leading-tight mb-1">
                    <span className="text-[#F43F5E]">Drag & drop </span>
                    <span className="text-[#A855F7]">image,</span>
                  </div>
                  <div className="text-[#A855F7] text-base font-normal mb-3">
                    video&apos;s, or any file
                  </div>

                  <p className="text-xs text-[#F43F5E] mt-1 font-medium">
                    Or{" "}
                    <span className="underline cursor-pointer text-[#A855F7]">
                      browse file
                    </span>{" "}
                    on your computer
                  </p>
                </div>

                {/* File List Box */}
                {files.length > 0 && (
                  <div className="w-full md:w-1/2 bg-white border border-pink-200 rounded-3xl p-6 flex flex-col justify-center gap-6">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0">
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="40"
                                height="40"
                                rx="8"
                                fill="#FEE2E2"
                              />
                              <circle
                                cx="14"
                                cy="14"
                                r="3"
                                fill="white"
                                fillOpacity="0.5"
                              />
                              <path
                                d="M30 24L24 18L10 32"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="absolute -bottom-1 -right-1 bg-[#F43F5E] rounded-full p-1 border-2 border-white">
                              <svg
                                width="8"
                                height="8"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          </div>

                          <span className="text-sm text-[#F43F5E] font-medium flex-1 truncate max-w-[150px]">
                            {file.name}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="text-[#F43F5E] hover:text-red-700"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                          </button>
                        </div>
                        {/* Progress Line */}
                        <div className="h-0.5 bg-[#BE185D] rounded-full ml-14 w-[calc(100%-56px)]"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-[#F28B82] hover:bg-[#e07b72] text-white font-medium py-3 px-8 rounded-xl shadow-md transition-colors w-full md:w-auto"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Image Card */}
          <div className="w-full lg:w-2/5 ">
            <div className="bg-[#FFF0F5] rounded-3xl p-4 h-full flex items-center justify-center">
              <div className="relative w-full h-full border min-h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/request/image1.jpg"
                  alt="Thank you for your order"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
