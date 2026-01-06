interface SectionTitleProps {
  title: string;
  className?: string;
}

export default function SectionTitle({
  title,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-2xl md:text-5xl font-medium text-[#AC1754] font-fredoka">
        {title}
      </h2>
    </div>
  );
}
