import Marquee from "react-fast-marquee";

export default function MarqueeHeader() {
  return (
    <div className="bg-[#AC1754] py-1 overflow-hidden font-fredoka">
      <Marquee speed={50} gradient={false}>
        <span className="text-white text-[16px] font-normal tracking-wide">
          Shoppers&apos; perk & Shoppers&apos; perk life style
        </span>
      </Marquee>
    </div>
  );
}
