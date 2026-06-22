

import img1 from "/Gallery/Gallery1.png";
import img2 from "/Gallery/Gallery2.png";
import img3 from "/Gallery/Gallery3.png";
import img4 from "/Gallery/LongGallery.png";
import img5 from "/Gallery/Gallery5.png";
const Gallery = () => {
  const features = [
    {
      title: "Title 1",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. imperdiet sed id elementum.",
    },
    {
      title: "Title 2",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. imperdiet sed id elementum.",
      highlighted: true,
    },
    {
      title: "Title 3",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. imperdiet sed id elementum.",
    },
    {
      title: "Title 4",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. imperdiet sed id elementum.",
      highlighted: true,
    },
  ];

  return (
    <section className="w-full">
      <div className="mx-auto max-w-full">
        
        {/* Top Tiles */}
        <div className="grid grid-cols-1  max-w-7xl mx-auto sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 md:mb-16">
          {features.map((item, index) => (
            <div
              key={index}
              className={`
                p-8 min-h-[170px]
               
                transition-all duration-300
                ${
                  item.highlighted
                    ? "bg-[#E9EDF3]"
                    : "bg-transparent"
                }
              `}
            >
              <h3 className="text-xl font-semibold mb-4">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-8">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Gallery */}
        <div className="space-y-0 overflow-hidden">
          
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="overflow-hidden">
              <img
                src={img1}
                alt=""
                className="w-full h-[260px] md:h-[380px] object-cover"
              />
            </div>

            <div className="overflow-hidden">
              <img
                src={img2}
                alt=""
                className="w-full h-[260px] md:h-[380px] object-cover"
              />
            </div>

            <div className="overflow-hidden">
              <img
                src={img3}
                alt=""
                className="w-full h-[260px] md:h-[380px] object-cover"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            
            {/* Large Image */}
            <div className="md:col-span-2 overflow-hidden">
              <img
                src={img4}
                alt=""
                className="w-full h-[280px] md:h-[380px] object-cover"
              />
            </div>

            {/* Small Image */}
            <div className="overflow-hidden">
              <img
                src={img5}
                alt=""
                className="w-full h-[280px] md:h-[380px] object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;