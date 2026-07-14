import { useRef } from "react";
import relatedArticleImg from "./assets/related_article.png";
import { H2, H4, P } from "../Global/Typography/Typo";

const RelatedArticles = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const articles = [
    {
      title: "THE ULTIMATE GUIDE TO FULL-BODY",
      description:
        "Discover exercises that target every muscle group, helping you build strength and endurance. Perfect for beginners and seasoned athletes.",
      author: "By Alex Carter",
      image: relatedArticleImg,
    },
    {
      title: "THE ULTIMATE GUIDE TO FULL-BODY",
      description:
        "Discover exercises that target every muscle group, helping you build strength and endurance. Perfect for beginners and seasoned athletes.",
      author: "By Alex Carter",
      image: relatedArticleImg,
    },
    {
      title: "THE ULTIMATE GUIDE TO FULL-BODY",
      description:
        "Discover exercises that target every muscle group, helping you build strength and endurance. Perfect for beginners and seasoned athletes.",
      author: "By Alex Carter",
      image: relatedArticleImg,
    },
    {
      title: "THE ULTIMATE GUIDE TO FULL-BODY",
      description:
        "Discover exercises that target every muscle group, helping you build strength and endurance. Perfect for beginners and seasoned athletes.",
      author: "By Alex Carter",
      image: relatedArticleImg,
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = 320;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-10 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <H2 className="">
            Related Articles
          </H2>

          {/* Mobile / Tablet Arrows */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="Previous article"
            >
              ←
            </button>

            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="Next article"
            >
              →
            </button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-8 xl:gap-10">
          {articles.map((article, index) => (
            <article
              key={index}
              className="group cursor-pointer"
            >
              <div className="aspect-[1/1] overflow-hidden rounded-2xl bg-gray-100 mb-6">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <H4 className="mb-3">
                {article.title}
              </H4>

              <P className="mb-4">
                {article.description}
              </P>

              <span className="text-sm text-[#888888] font-para">
                {article.author}
              </span>
            </article>
          ))}
        </div>

        {/* Mobile / Tablet Slider */}
        <div
          ref={scrollRef}
          className="
            lg:hidden
            flex
            gap-5
            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory
            pb-2
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {articles.map((article, index) => (
            <article
              key={index}
              className="
                snap-start
                shrink-0
                w-[280px]
                sm:w-[340px]
                group
                cursor-pointer
              "
            >
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-5">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <H4 className=" mb-3">
                {article.title}
              </H4>

              <P className=" mb-3">
                {article.description}
              </P>

              <span className="text-sm text-[#888888] font-para">
                {article.author}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;