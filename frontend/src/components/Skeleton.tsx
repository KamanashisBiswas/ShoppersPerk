"use client";

// ─── Helper ───────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Base Skeleton ────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-pink-100/80", className)} />
  );
}

// ─── Product Card Skeleton ────────────────────────────────────────────────────
export function ProductCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Skeleton className="w-45 h-52.5 mb-4 rounded-none" />
      <Skeleton className="h-3.5 w-32 mb-2 rounded" />
      <Skeleton className="h-3 w-20 mb-3 rounded" />
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-3 h-3 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-8 w-28 rounded-md" />
    </div>
  );
}

// ─── Product Grid Skeleton ────────────────────────────────────────────────────
interface ProductGridSkeletonProps {
  count?: number;
  cols?: string;
  className?: string;
}

export function ProductGridSkeleton({
  count = 4,
  cols = "grid-cols-2 lg:grid-cols-4",
  className,
}: ProductGridSkeletonProps) {
  return (
    <div className={cn("grid gap-x-4 gap-y-10", cols, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Carousel Skeleton ───────────────────────────────────────────────────────
export function CarouselSkeleton() {
  return (
    <div className="relative w-full h-150 lg:h-187.5 bg-[#1a0a12] overflow-hidden">
      {/* Background shimmer */}
      <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-linear-to-br from-[#2d0d1f] via-[#1a0a12] to-[#2d0d1f]" />

      {/* Navbar skeleton */}
      <div className="absolute top-6 left-0 w-full z-40 flex justify-center">
        <Skeleton className="h-11 w-130 rounded-full bg-white/10" />
      </div>

      {/* Search + icons skeleton */}
      <div className="absolute top-24 right-12 z-40 hidden lg:flex items-center gap-3">
        <Skeleton className="h-10 w-64 rounded-full bg-white/10" />
        <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
        <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
      </div>

      {/* Text content skeleton — right aligned */}
      <div className="absolute top-1/2 right-4 lg:right-20 -translate-y-1/2 z-30 flex flex-col items-end gap-4 mt-20 lg:mt-0">
        <Skeleton className="h-12 w-80 lg:w-105 rounded-md bg-white/10" />
        <Skeleton className="h-16 w-64 lg:w-90 rounded-md bg-white/10" />
        <Skeleton className="h-5 w-52 rounded bg-white/10" />
        <Skeleton className="h-5 w-44 rounded bg-white/10" />
        <Skeleton className="h-10 w-32 rounded-md bg-white/15 mt-4" />
      </div>

      {/* Slide indicators skeleton */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-2 rounded-full bg-white/20 ${i === 0 ? "w-8" : "w-2"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Section Title Skeleton ───────────────────────────────────────────────────
export function SectionTitleSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Skeleton className="h-5 w-24 rounded mx-auto" />
      <Skeleton className="h-9 w-64 rounded mx-auto" />
    </div>
  );
}

// ─── Hero Image Skeleton ──────────────────────────────────────────────────────
export function HeroImageSkeleton({ className }: SkeletonProps) {
  return (
    <Skeleton
      className={cn("w-full max-w-162.5 aspect-4/5 rounded-[45%]", className)}
    />
  );
}
