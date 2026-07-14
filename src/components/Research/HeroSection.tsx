import React from 'react';
import { H1, H3, P } from '../../Global/Typography/Typo';

interface ProjectCard {
  id: number;
  title: string;
  description: string;
}

const HeroSection: React.FC = () => {
  const projects: ProjectCard[] = [
    {
      id: 1,
      title: 'Title 1',
      description: 'Lorem ipsum dolor sit amet, consectetur',
    },
    {
      id: 2,
      title: 'Title 1',
      description: 'Lorem ipsum dolor sit amet, consectetur',
    },
    {
      id: 3,
      title: 'Title 1',
      description: 'Lorem ipsum dolor sit amet, consectetur',
    },
    {
      id: 4,
      title: 'Title 1',
      description: 'Lorem ipsum dolor sit amet, consectetur',
    },
  ];

  return (
    <section className="relative w-full ">
      {/* Top Content Area - Heading and Description */}
      <div className="w-full px-4  xl:pt-24 sm:px-6 xl:px-8 pt-28   pb-0">
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
          <H1 className="mb-4 sm:mb-6 ">
            Find the project you love
          </H1>
          <P className="max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus in libero risus semper habitant arcu eugest. Et integer facilisis arcu etiam.Lorem ipsum dolor sit amet.consectetur
          </P>
        </div>
      </div>

      {/* Image Container with Floating Cards */}
      <div className="relative w-full ">
        {/* Hero Image */}
        <div className="w-full pt-8 ">
          <div className="w-full h-96 sm:h-[200px] lg:h-[300px] xl:h-full px-4  pt-20 sm:px-6 lg:px-10 overflow-hidden">
            <img
              src="/Research/ResearchHero.png"
              alt="Project showcase"
              className="w-full h-full object-cover rounded-t-3xl sm:rounded-t-4xl"
            />
          </div>

      
        </div>

        {/* Cards Grid - Floating over image */}
        <div className="absolute top-0 left-0 right-0 flex justify-center px-4 sm:px-6 lg:px-8 z-20 -translate-y-10">
          <div className="max-w-6xl w-full">
            <div className="bg-white rounded-2xl sm:rounded-4xl p-6 sm:p-8 lg:p-10 shadow-lg border-2 border-[#B0A8A8]">
              {/* Grid with responsive columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {projects.map((project) => (
                  <div key={project.id} className="flex flex-col">
                    <H3 className=" mb-2 sm:mb-3">
                      {project.title}
                    </H3>
                    <P className="border-t border-gray-400 pt-3 sm:pt-4">
                      {project.description}
                    </P>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </section>
  );
};

export default HeroSection;