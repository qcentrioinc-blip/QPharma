const Content = () => {
  return (
    <div className="w-full bg-white" style={{ fontFamily: "Arial, sans-serif" }}>

      {/* ── Hero Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "260px" }}>

        {/* Layered green background */}
        <div className="absolute inset-0 bg-[#113227]" />

        {/* Diagonal lighter green layer — bottom-left shape */}
        <div
          className="absolute bottom-0 left-0 w-3/4 h-full bg-[#1a4a35]"
          style={{ clipPath: "polygon(0 0, 70% 0, 55% 100%, 0 100%)" }}
        />

        {/* Mid accent layer */}
        <div
          className="absolute bottom-0 left-0 w-1/2 h-full bg-[#1f5a40]"
          style={{ clipPath: "polygon(0 0, 55% 0, 40% 100%, 0 100%)" }}
        />

        {/* Lightest left edge strip */}
        <div
          className="absolute bottom-0 left-0 w-1/3 h-full bg-[#246b4a]"
          style={{ clipPath: "polygon(0 0, 45% 0, 28% 100%, 0 100%)" }}
        />

        {/* Text content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 flex items-center justify-between gap-8">
          <div className="max-w-lg">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-white/70 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur sed
              do eiusmod tempor
            </p>
          </div>

          {/* Hero image — right side */}
          <div className="hidden md:flex shrink-0 items-end self-end">
            <img
              src="/Global/PrivacyImage.png"
              alt="Privacy Policy"
              className="h-56 lg:h-64 w-auto object-contain object-bottom"
            />
          </div>
        </div>

        {/* Subtle dot grid overlay for texture */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* ── Article Content ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4 leading-snug">
            The standard Lorem Ipsum passage, used since the 1500s
          </h2>
          <p className="text-sm sm:text-base text-[#444] leading-relaxed">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum."
          </p>
        </section>

        {/* Divider */}
        <hr className="border-t border-[#e0e0e0] mb-10" />

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4 leading-snug">
            Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC
          </h2>
          <p className="text-sm sm:text-base text-[#444] leading-relaxed">
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
            amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut
            labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
            commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit
            esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
            nulla pariatur?"
          </p>
        </section>

        {/* Divider */}
        <hr className="border-t border-[#e0e0e0] mb-10" />

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4 leading-snug">
            1914 translation by H. Rackham
          </h2>
          <p className="text-sm sm:text-base text-[#444] leading-relaxed">
            'But I must explain to you how all this mistaken idea of denouncing pleasure and
            praising pain was born and I will give you a complete account of the system, and
            expound the actual teachings of the great explorer of the truth, the master-builder
            of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it
            is pleasure, but because those who do not know how to pursue pleasure rationally
            encounter consequences that are extremely painful. Nor again is there anyone who loves
            or pursues or desires to obtain pain of itself, because it is pain, but because
            occasionally circumstances occur in which toil and pain can procure him some great
            pleasure. To take a trivial example, which of us ever undertakes laborious physical
            exercise, except to obtain some advantage from it? But who has any right to find fault
            with a man who chooses to enjoy a pleasure that has no annoying consequences, or one
            who avoids a pain that produces no resultant pleasure?'
          </p>
        </section>

        {/* Divider */}
        <hr className="border-t border-[#e0e0e0] mb-10" />

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4 leading-snug">
            Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC
          </h2>
          <p className="text-sm sm:text-base text-[#444] leading-relaxed">
            "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
            occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
            mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
            expedita distinctio."
          </p>
        </section>

      </div>
    </div>
  );
};

export default Content;