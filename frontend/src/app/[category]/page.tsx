import ProductGallerySection from "@/components/ProductGallerySection";
import Footer from "@/components/Footer";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  return (
    <div className="w-full overflow-x-hidden">
      <ProductGallerySection categorySlug={category} showHeader />
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return [
    { category: "skincare" },
    { category: "makeup" },
    { category: "haircare" },
    { category: "fragrance" },
    { category: "wedding" },
    { category: "festival" },
    { category: "birthday" },
    { category: "baby" },
    { category: "men" },
    { category: "clearance" },
  ];
}
