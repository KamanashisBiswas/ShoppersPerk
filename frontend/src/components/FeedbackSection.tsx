import Image from "next/image";
import data from "@/data/data.json";
import SectionTitle from "./SectionTitle";

export default function FeedbackSection() {
  const { feedback } = data;

  return (
    <section className="w-full py-16 px-4 bg-[#FFEDFA]">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="bg-[#FFF0F5] text-[#AC1754] px-6 py-2 rounded-full mb-4 text-sm font-medium">
            Positive Feedback
          </div>
          <SectionTitle title="User Service Feedback" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFF0F5] rounded-3xl p-8 md:p-12 relative"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#F28B82"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className="text-[#AC1754] text-lg leading-relaxed mb-6 relative z-10">
                {item.comment}
              </p>

              {/* Quote Icon */}
              <div className="flex justify-end mb-6">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="#E8D7DE">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                </svg>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                  <Image
                    src={item.image}
                    alt={item.user}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="h-px bg-[#E8D7DE] grow mx-2"></div>
                <div className="text-[#AC1754] font-medium text-sm md:text-base whitespace-nowrap">
                  {item.user}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
