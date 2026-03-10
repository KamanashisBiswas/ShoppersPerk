"use client";

import { IoClose } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";

export interface ActiveTag {
  id: string;
  label: string;
}

interface TagSelectorProps {
  tags: ActiveTag[];
  sortValue: string;
  onRemoveTag: (id: string) => void;
  onClearAll: () => void;
  onSortChange: (value: string) => void;
}

export default function TagSelector({
  tags,
  sortValue,
  onRemoveTag,
  onClearAll,
  onSortChange,
}: TagSelectorProps) {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {/* Active filter tags */}
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="flex items-center gap-1 bg-[#FFD6EC] text-[#C84B8E] text-xs font-medium px-3 py-1.5 rounded-full border border-[#f0a0c8]"
        >
          {tag.label}
          <button
            onClick={() => onRemoveTag(tag.id)}
            className="ml-0.5 hover:text-[#a0246e] transition-colors"
          >
            <IoClose size={13} />
          </button>
        </span>
      ))}

      {/* Clear all */}
      {tags.length > 0 && (
        <button
          onClick={onClearAll}
          className="text-gray-500 text-xs font-medium hover:text-[#C84B8E] transition-colors px-1"
        >
          Close all
        </button>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Sort dropdown */}
      <div className="relative inline-flex items-center">
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-white border border-pink-200 rounded-full text-xs text-gray-600 pl-3 pr-7 py-1.5 focus:outline-none focus:border-[#C84B8E] cursor-pointer"
        >
          <option value="default">Shot by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
        <FaChevronDown
          size={9}
          className="absolute right-2.5 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}
