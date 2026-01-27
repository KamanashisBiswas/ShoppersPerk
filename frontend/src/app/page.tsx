import MarqueeHeader from "@/components/MarqueeHeader";
import Carousel from "@/components/Carousel";
import OffersSection from "@/components/OffersSection";
import BeautyBuzzSection from "@/components/BeautyBuzzSection";
import CraftYourLookSection from "@/components/CraftYourLookSection";
import ExclusiveOffersSection from "@/components/ExclusiveOffersSection";
import WeddingWhispersSection from "@/components/WeddingWhispersSection";
import GlowWithNewBeautySection from "@/components/GlowWithNewBeautySection";
import VibrantFestivalSection from "@/components/VibrantFestivalSection";
import BirthdayGlamSection from "@/components/BirthdayGlamSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-screen h-[60vh] md:h-screen overflow-hidden flex flex-col relative">
        <MarqueeHeader />
        <div className="flex-1 relative w-full">
          <Carousel />
        </div>
      </div>
      <OffersSection />
      <BeautyBuzzSection />
      <CraftYourLookSection />
      <ExclusiveOffersSection />
      <GlowWithNewBeautySection />
      <WeddingWhispersSection />
      <VibrantFestivalSection />
      <BirthdayGlamSection />
      <Footer />
    </div>
  );
}
