 
import { useState } from 'react'
import QuestionMark from '/Global/Question.svg'

const faqs = [
  {
    q: 'How long until we deliver your first blog post?',
    a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    q: 'How long until we deliver your first blog post?',
    a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    q: 'How long until we deliver your first blog post?',
    a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    q: 'How long until we deliver your first blog post?',
    a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState  <number | null>(null)
  const [feedback, setFeedback] = useState('')

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section className="w-full py-12 px-4 sm:px-8 lg:px-16 bg-white">

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-gray-800 font-light mb-10">
        Frequently Ask Questions
      </h2>

      {/* Two equal columns */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

        {/* LEFT — Accordion */}
        <div className="flex flex-col gap-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-4 px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                {/* Plus / Minus icon */}
                <span className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500">
                  {openIndex === i ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </span>
                <span className="text-sm sm:text-base text-gray-700 font-medium leading-snug">
                  {item.q}
                </span>
              </button>

              {/* Collapsible answer */}
              <div
                className={`px-6 text-sm text-gray-500 leading-relaxed transition-all duration-300 overflow-hidden ${
                  openIndex === i ? 'max-h-40 pb-5 pt-0' : 'max-h-0'
                }`}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — Any Question */}
        <div className="flex flex-col items-center text-center gap-3">
          {/* Question mark image */}
          <img
            src={QuestionMark}
            alt="Any Question?"
            className="w-36 sm:w-44 h-auto object-contain"
          />

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
            Any Question?
          </h3>
          <p className="text-sm text-gray-500">
            You can ask anything you want to know Feedback
          </p>

          {/* Input */}
          <div className="w-full mt-3">
            <p className="text-xs text-gray-500 mb-1.5 text-left">Let me know</p>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Enter Here"
                className="flex-1 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none bg-white"
              />
              {feedback && (
                <button
                  onClick={() => setFeedback('')}
                  className="px-4 py-3 text-gray-500 hover:text-gray-800 font-semibold text-sm"
                >
                  X
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default FAQ