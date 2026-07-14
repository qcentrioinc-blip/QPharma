import { useState } from "react";
import QuestionMark from "/Global/Question.svg";
import { H2, H3, P } from "../Global/Typography/Typo";

const faqs = [
  {
    q: "How long until we deliver your first blog post?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    q: "How long until we deliver your first blog post?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    q: "How long until we deliver your first blog post?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    q: "How long until we deliver your first blog post?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [feedback, setFeedback] = useState("");

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = () => {
    if (!feedback.trim()) return;

    console.log("Feedback:", feedback);

    // TODO:
    // EmailJS / API Integration

    setFeedback("");
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Title */}
        <div className="text-center mb-10 md:mb-14">
          <H2 className="">
            Frequently Asked Questions
          </H2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            {faqs.map((item, index) => (
             <div
  key={index}
  className={`
    rounded-2xl
    border
    bg-white
    overflow-hidden
    transition-all
    duration-300
    
    hover:shadow-md
    ${
      openIndex === index
        ? "border-gray-300 border-l-[8px] border-l-black"
        : "border-gray-200"
    }
  `}
>
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full flex items-center gap-4 px-5 md:px-6 py-5 text-left"
                >
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    {openIndex === index ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <line
                          x1="1"
                          y1="6"
                          x2="11"
                          y2="6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <line
                          x1="6"
                          y1="1"
                          x2="6"
                          y2="11"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="1"
                          y1="6"
                          x2="11"
                          y2="6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>

                  <span className="text-[14px] md:text-[16px] lg:text-[16px] xl:text-[18px]
        font-para
        leading-[140%]
        text-[#141414] ">
                    {item.q}
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 text-gray-600 text-[14px] md:text-[16px] lg:text-[16px] xl:text-[18px]
        font-para
        leading-[140%]
        ">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-center text-center lg:sticky lg:top-24">
            {/* Image */}
            <img
              src={QuestionMark}
              alt="Question Mark"
              className="w-32 sm:w-40 md:w-48 lg:w-52 h-auto object-contain"
            />

            <H3 className="mt-4 ">
              Any Questions?
            </H3>

            <P className="mt-2  max-w-md">
              Have something specific in mind? Send us your question and our
              team will get back to you.
            </P>

            {/* Input */}
            <div className="w-full max-w-lg mt-8">
              <label
                htmlFor="faq-feedback"
                className="block text-sm text-gray-500 text-left mb-2 font-para"
              >
                Let us know
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 bg-white overflow-hidden focus-within:border-gray-500 transition-colors">
                <input
                  id="faq-feedback"
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  placeholder="Enter your question..."
                  className="flex-1 px-4 py-4 text-sm md:text-base outline-none bg-transparent"
                />

                {feedback && (
                  <button
                    onClick={() => setFeedback("")}
                    className="px-3 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label="Clear input"
                  >
                    ✕
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!feedback.trim()}
                  className="px-5 py-4 bg-black text-white text-sm md:text-base hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-para"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;