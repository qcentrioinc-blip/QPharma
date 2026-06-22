const Para = () => {
  return (
    <section className="w-full py-10 ">
      <div className="container max-w-7xl mx-auto px-4">
        
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-900 mb-8 md:mb-10">
          Lorem ipsum
        </h2>

        {/* Top Two Paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 mb-6 md:mb-8">
          <p className="text-gray-600 text-sm sm:text-base leading-7">
            Lorem ipsum dolor sit amet consectetur. Erat arcu pretium maecenas
            elementum bibendum habitasse consectetur. Egestas in quam lacinia
            egestas. Sed sed scelerisque sit adipiscing purus ac. Ultrices eu
            etiam metus lorem aliquam magna.
          </p>

          <p className="text-gray-600 text-sm sm:text-base leading-7">
            Lorem ipsum dolor sit amet consectetur. Vulputate elementum tellus
            at est pellentesque turpis tortor. Sit rhoncus aliquet massa ac
            adipiscing eros. Commodo enim cras pulvinar ipsum vitae quisque
            pellentesque tellus.
          </p>
        </div>

        {/* Bottom Full Width Paragraph */}
        <p className="text-gray-600 text-sm sm:text-base leading-7 max-w-none">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </p>

      </div>
    </section>
  );
};

export default Para;