import { useState } from "react";
import QuestionMark from "/Global/Question.svg";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-md"
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

                  <span className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 leading-relaxed">
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
                    <div className="px-6 pb-5 text-sm md:text-base text-gray-500 leading-relaxed">
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

            <h3 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-900">
              Any Questions?
            </h3>

            <p className="mt-2 text-sm md:text-base text-gray-500 max-w-md">
              Have something specific in mind? Send us your question and our
              team will get back to you.
            </p>

            {/* Input */}
            <div className="w-full max-w-lg mt-8">
              <label
                htmlFor="faq-feedback"
                className="block text-sm text-gray-500 text-left mb-2"
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
                  className="px-5 py-4 bg-black text-white text-sm md:text-base hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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