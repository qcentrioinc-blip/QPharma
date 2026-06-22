

const LorumTextAnim = () => {
  // Vertically stacked rows matching the layout from top to bottom
  // Array matching layout from top to bottom
  const rows = ["M", "E", "R", "O", "L"];
  
  // 0 represents the solid letter, 1-3 represent the outline letters
  const columns = [0, 1, 2, 3];

  return (
    <div className="min-h-screen w-full bg-white text-black flex items-center justify-center p-6  ">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2  items-center">
        
        {/* LEFT CONTENT SECTION */}
        <div className="flex flex-col justify-center order-2 lg:order-1 max-w-lg w-full">
          <h1 className="text-5xl sm:text-[120px]  font-medium tracking-normal leading-[0.9] mb-4">
            LOREM <br /> IPSUM
          </h1>
          
          {/* Solid Divider Line */}
          <div className="max-w-sm h-2 bg-black mb-10" />
          
          <p className="text-xs sm:text-[18px] text-gray-800 font-normal leading-relaxed  text-justify">
          Lorem ipsum dolor sit amet consectetur. Erat arcu pretium maecenas elementum bibendum habitasse consectetur. Egestas in quam lacinia egestas. Sed sed scelerisque sit adipiscing purus ac.
          </p>
        </div>

        {/* RIGHT ARTISTIC SECTION (WITH CORRECT CELL ROTATION) */}
     <div className="flex justify-center lg:justify-end order-1 lg:order-2 select-none w-full">
          {/* Vertical Grid Container */}
          <div className="flex flex-col">
            {rows.map((letter, rowIndex) => (
              <div key={rowIndex} className="flex flex-row">
                {columns.map((colIndex) => (
                  <div
                    key={colIndex}
                    className="
                      w-14 h-14 sm:w-20 sm:h-20 md:w-20 md:h-22 font-serif
                      font-extrabold
                      flex items-center justify-center 
                      text-5xl sm:text-7xl md:text-8xl 
                       tracking-tighter
                    "
                  >
                    <span
                      className={`transform -rotate-90 inline-block ${
                        colIndex === 0 ? "text-black" : "text-transparent"
                      }`}
                      style={
                        colIndex > 0
                          ? { WebkitTextStroke: "1px rgba(0, 0, 0, 0.85)" }
                          : {}
                      }
                    >
                      {letter}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LorumTextAnim;