import { useLocation, useNavigate } from "react-router-dom";
import { P } from "../Global/Typography/Typo";


export default function TwoCard() {

  const location = useLocation();
  const navigate = useNavigate();

  const dummyImage =
    "/Global/TwoCardImage.png";

  const categoryCards = {
  herbal: [
    {
      id: 1,
      title: "Lorem ipsum:",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      cta: "Explore Nutraceutical",
      ctaColor: "#4CA6B3",
      link: "/Nutraceutical",
    },
    {
      id: 2,
      title: "Lorem ipsum:",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      cta: "Explore Organic",
      ctaColor: "#547A3D",
      link: "/organic",
    },
  ],

  organic: [
    {
      id: 1,
      title: "Lorem ipsum:",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      cta: "Explore Herbal",
      ctaColor: "#C98A6B",
      link: "/herbal",
    },
    {
      id: 2,
      title: "Lorem ipsum:",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      cta: "Explore Nutraceutical",
      ctaColor: "#4CA6B3",
      link: "/Nutraceutical",
    },
  ],

  nutraceutical: [
    {
      id: 1,
      title: "Lorem ipsum:",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      cta: "Explore Organic",
      ctaColor: "#547A3D",
      link: "/organic",
    },
    {
      id: 2,
      title: "Lorem ipsum:",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      cta: "Explore Herbal",
      ctaColor: "#C98A6B",
      link: "/herbal",
    },
  ],
};

let currentCategory: keyof typeof categoryCards = "organic";

  if (location.pathname.includes("/herbal")) {
    currentCategory = "herbal";
  } else if (location.pathname.includes("/organic")) {
    currentCategory = "organic";
  } else if (location.pathname.includes("/nutraceutical")) {
    currentCategory = "nutraceutical";
  }

  const cards = categoryCards[currentCategory];


  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="mx-auto w-full  px-4 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          {cards.map((card) => (
            <article
              key={card.id}
              className="relative flex min-h-[194px] overflow-hidden rounded-[20px] border border-[#b9b9b9] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
            >
              <div className="flex w-full flex-col  justify-between px-7 py-7  xl:pr-[225px]">
                <P className="max-w-[560px]">
                  <span className="font-semibold">{card.title}</span>{" "}
                  <span className="font-normal">{card.description}</span>
                </P>

                <button
  onClick={() => navigate(card.link)}
                  type="button"
                  className="mt-6 inline-flex w-fit items-center gap-2 text-[24px] font-semibold tracking-[-0.03em] transition-opacity duration-200 hover:opacity-80 md:text-[25px]"
                  style={{ color: card.ctaColor }}
                >
                  <span>{card.cta}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h13" />
                    <path d="M13 7l5 5-5 5" />
                  </svg>
                </button>
              </div>

              <div
                className="absolute  xl:flex hidden right-4 top-1/2 h-[138px] w-[290px] -translate-y-1/2 overflow-hidden  "
                
              >
                <img
                  src={dummyImage}
                  alt="Scientific healthcare visual"
                  className="h-full w-full object-cover"
                />

                 
 
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}