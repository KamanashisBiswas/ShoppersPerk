import MarqueeHeader from "@/components/MarqueeHeader";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import OffersSection from "@/components/OffersSection";
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
      <Footer />
    </div>
  );
}
