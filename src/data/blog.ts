export interface Blog {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  date: string;
  image: string;
  readTime: string;
}

export const blogs: Blog[] = [
  {
    id: 1,
    slug: "ux-review-presentations",
    title: "UX review presentations",
    category: "Design",
    excerpt:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    content: `
      <p>Creating a compelling UX review presentation is both an art and a science. The goal is to communicate complex design decisions in a way that resonates with stakeholders at all levels — from developers to executives.</p>

      <h2>Start With the Problem Statement</h2>
      <p>Every good UX review begins with a clear articulation of the problem you were solving. Don't assume your audience remembers the original brief. Restate it concisely and make sure everyone is aligned before diving into solutions.</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>

      <h2>Show Your Process, Not Just the Output</h2>
      <p>Stakeholders gain confidence when they see the thinking behind your designs. Walk them through your research findings, the personas you considered, the wireframes you discarded, and why you made each key decision.</p>

      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <h2>Use Data to Back Your Decisions</h2>
      <p>Whenever possible, anchor your design choices in data. Usability test results, heatmaps, session recordings, and A/B test outcomes all lend credibility to your recommendations and make it easier for non-designers to trust your judgment.</p>

      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

      <h2>Keep It Focused and Time-Boxed</h2>
      <p>Respect your audience's time. Structure your presentation to cover the most critical points in the first half, leaving room for Q&A. Use a clear agenda slide and stick to it. A tight, well-paced review is far more persuasive than an exhaustive one.</p>

      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
    `,
    author: {
      name: "Olivia Rhye",
      avatar: "https://i.pravatar.cc/40?img=47",
      bio: "Olivia is a senior UX designer with 8+ years of experience crafting intuitive digital experiences. She writes about design systems, user research, and presentation strategies that bridge the gap between design and business.",
    },
    date: "20 January 2022",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop",
    readTime: "5 min read",
  },
  {
    id: 2,
    slug: "migrating-to-linear-101",
    title: "Migrating to Linear 101",
    category: "Product",
    excerpt:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    content: `
      <p>If your team has been struggling with bloated project management tools, Linear might be exactly what you need. It's fast, opinionated, and built for modern engineering teams.</p>

      <h2>Why Teams Are Switching to Linear</h2>
      <p>Linear was built with speed as a first principle. Every action in the app is instant — no loading spinners, no waiting. For teams that live in their issue tracker, this performance difference is felt every single day.</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>

      <h2>Setting Up Your Workspace</h2>
      <p>Start by creating your workspace and inviting your team. Linear's onboarding is impressively smooth — you can import issues from Jira, GitHub, or Asana in just a few clicks. Set up your teams, define your issue statuses, and establish your first cycle (Linear's version of a sprint).</p>

      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>

      <h2>Keyboard-First Workflow</h2>
      <p>Linear is designed for power users. Almost every action has a keyboard shortcut, and the command palette (⌘K) lets you navigate anywhere in seconds. Once your team internalizes the shortcuts, productivity soars.</p>

      <h2>Integrations That Matter</h2>
      <p>Linear integrates natively with GitHub, GitLab, Figma, Slack, and more. The GitHub integration is particularly powerful — commits and PRs automatically update issue statuses, keeping your tracker in sync with your codebase without any manual effort.</p>
    `,
    author: {
      name: "Phoenix Baker",
      avatar: "https://i.pravatar.cc/40?img=12",
      bio: "Phoenix is a product manager turned writer, obsessed with tools that make engineering teams move faster. He has migrated over a dozen teams to modern project workflows and shares hard-won lessons along the way.",
    },
    date: "18 January 2022",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
    readTime: "4 min read",
  },
  {
    id: 3,
    slug: "building-your-api-stack",
    title: "Building your API Stack",
    category: "Software Engineering",
    excerpt:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    content: `
      <p>Modern applications are built on APIs. Whether you're building a mobile app, a SaaS product, or a microservices architecture, your API layer is foundational. Here's how to build it right from day one.</p>

      <h2>Choosing Between REST, GraphQL, and gRPC</h2>
      <p>Each API paradigm has its strengths. REST is the most widely understood and has the broadest tooling support. GraphQL excels when clients need flexible data fetching. gRPC shines in high-performance internal service communication. Match the tool to the use case.</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>

      <h2>Design First, Then Implement</h2>
      <p>Use an API specification like OpenAPI (Swagger) to design your endpoints before writing a single line of implementation code. This forces you to think through your data models, error responses, and authentication flows upfront — and gives you documentation for free.</p>

      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>

      <h2>Authentication and Security</h2>
      <p>Never roll your own auth. Use established standards: OAuth 2.0 with JWT for user-facing APIs, API keys for server-to-server communication. Always use HTTPS, implement rate limiting from day one, and validate all inputs rigorously.</p>

      <h2>Testing Your API</h2>
      <p>Build a comprehensive test suite covering happy paths, error cases, and edge cases. Tools like Postman, Insomnia, or the REST Client VS Code extension make manual testing easy. Pair that with automated integration tests that run in your CI pipeline.</p>
    `,
    author: {
      name: "Lana Steiner",
      avatar: "https://i.pravatar.cc/40?img=32",
      bio: "Lana is a backend engineer and technical writer who has built API platforms at scale. She is passionate about developer experience, API design principles, and helping teams ship reliable software.",
    },
    date: "18 January 2022",
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&auto=format&fit=crop",
    readTime: "6 min read",
  },
  {
    id: 4,
    slug: "bill-walsh-leadership-lessons",
    title: "Bill Walsh leadership lessons",
    category: "Management",
    excerpt:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    content: `
      <p>Bill Walsh took over the San Francisco 49ers when they were the worst team in the NFL. Within three years, they were Super Bowl champions. His methods revolutionized football — and offer timeless lessons for any leader.</p>

      <h2>The Standard of Performance</h2>
      <p>Walsh believed that outcomes follow from standards. Before worrying about winning games, he obsessed over the quality of every practice, every meeting, every interaction. He called this the "Standard of Performance" — a set of non-negotiable behaviors and attitudes that defined how the 49ers operated.</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <h2>Teaching Over Telling</h2>
      <p>Walsh saw himself primarily as a teacher. He didn't just give instructions — he explained the why behind every decision, helping players and coaches develop genuine understanding rather than rote compliance. This created a team that could adapt under pressure.</p>

      <h2>Emotional Mastery</h2>
      <p>One of Walsh's most counterintuitive insights: leaders must control their emotions more tightly than anyone else. When a leader panics or rages, it spreads through the organization. Walsh practiced projecting calm confidence regardless of the score or circumstance.</p>

      <h2>Succession Thinking From Day One</h2>
      <p>Walsh constantly developed the coaches under him, many of whom went on to become legendary head coaches themselves (the "coaching tree"). He believed a great leader's ultimate measure is the quality of people they develop, not personal accolades.</p>
    `,
    author: {
      name: "Alec Whitten",
      avatar: "https://i.pravatar.cc/40?img=53",
      bio: "Alec is a leadership coach and management consultant who has worked with Fortune 500 companies. He draws on sports psychology, military strategy, and business theory to help leaders build high-performing teams.",
    },
    date: "17 January 2022",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop",
    readTime: "7 min read",
  },
  {
    id: 5,
    slug: "pm-mental-models",
    title: "PM mental models",
    category: "Product",
    excerpt:
      "Mental models are simple expressions of complex processes or relationships.",
    content: `
      <p>The best product managers don't just manage backlogs — they think in systems. Mental models are cognitive shortcuts that help PMs make better decisions faster, especially under conditions of uncertainty and incomplete information.</p>

      <h2>First Principles Thinking</h2>
      <p>Rather than reasoning by analogy ("let's do what Spotify did"), first principles thinking breaks a problem down to its fundamental truths and builds back up. This is how you find genuinely innovative solutions instead of incrementally better copies.</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <h2>The Opportunity Cost Model</h2>
      <p>Every feature you build means something else doesn't get built. Great PMs are ruthless about opportunity cost — they don't just ask "is this valuable?" but "is this more valuable than everything else we could do with this time and these resources?"</p>

      <h2>Jobs to Be Done</h2>
      <p>People don't buy products — they hire them to do a job. The "Jobs to Be Done" framework asks: what progress is the customer trying to make? What are the functional, emotional, and social dimensions of that job? This reframe often unlocks product insights that feature-focused thinking misses entirely.</p>

      <h2>The Adoption Curve</h2>
      <p>Geoffrey Moore's technology adoption lifecycle reminds PMs that early adopters and mainstream customers are fundamentally different. The strategies, messaging, and features that work for innovators often actively repel the early majority. Know which segment you're serving.</p>
    `,
    author: {
      name: "Demi Wilkinson",
      avatar: "https://i.pravatar.cc/40?img=25",
      bio: "Demi is a product strategist and former founder who loves breaking down complex systems into simple mental models. She writes to help PMs think more clearly and make better decisions under uncertainty.",
    },
    date: "16 January 2022",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop",
    readTime: "5 min read",
  },
  {
    id: 6,
    slug: "what-is-wireframing",
    title: "What is Wireframing?",
    category: "Design",
    excerpt:
      "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    content: `
      <p>Wireframing is one of the most valuable skills a designer can have — and one of the most misunderstood. A wireframe is not a mockup. It's not a prototype. It's a blueprint: a low-fidelity representation of a screen that focuses on structure, layout, and functionality rather than visual design.</p>

      <h2>Why Wireframe at All?</h2>
      <p>Wireframes let you explore dozens of layout options quickly and cheaply before investing time in high-fidelity design. They keep conversations focused on user flows and information architecture rather than color debates. They're the fastest path from idea to testable concept.</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <h2>Lo-Fi vs Hi-Fi Wireframes</h2>
      <p>Low-fidelity wireframes use simple shapes, placeholder text, and no color — perfect for early exploration. High-fidelity wireframes include real content, precise spacing, and accurate component representations — ideal for developer handoff or stakeholder sign-off on structure before visual design begins.</p>

      <h2>Tools of the Trade</h2>
      <p>Figma has become the industry standard for wireframing. Its component system, multiplayer collaboration, and prototyping features make it ideal for everything from quick sketches to detailed specs. Balsamiq remains popular for its intentionally rough aesthetic that signals "this isn't final yet."</p>

      <h2>Wireframing Best Practices</h2>
      <p>Use real content wherever possible — lorem ipsum hides content length problems that will bite you in production. Annotate your wireframes liberally. Document interactions, edge cases, and the reasoning behind layout decisions. A well-annotated wireframe is a gift to developers.</p>
    `,
    author: {
      name: "Candice Wu",
      avatar: "https://i.pravatar.cc/40?img=44",
      bio: "Candice is a product designer and educator who has taught wireframing workshops to over 2,000 designers globally. She believes that great wireframes are the backbone of great products.",
    },
    date: "15 January 2022",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop",
    readTime: "4 min read",
  },
  {
    id: 7,
    slug: "how-collaboration-makes-us-better-designers",
    title: "How collaboration makes us better designers",
    category: "Design",
    excerpt:
      "Collaboration can make our teams stronger, and our individual designs better.",
    content: `
      <p>Design has historically been a solitary craft — the lone genius toiling in isolation to produce something brilliant. But the best design work today happens in teams, through constant feedback loops, shared critique, and genuine collaboration across disciplines.</p>

      <h2>The Myth of the Lone Genius</h2>
      <p>The romantic notion of the solitary creative is largely a myth, and in product design it's actively harmful. The best products are shaped by designers who work closely with engineers, PMs, researchers, and customers. Each perspective surfaces blind spots that a single designer would never find alone.</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <h2>Critique as a Skill</h2>
      <p>Giving and receiving design critique is a skill that must be developed intentionally. Good critique is specific, actionable, and focused on the work rather than the person. "This navigation pattern might confuse new users because..." is useful. "I don't like this" is not.</p>

      <h2>Cross-Functional Collaboration</h2>
      <p>Some of the best design decisions I've witnessed came from engineers suggesting UX improvements, or from customer support teams surfacing pain points that the design team had never encountered. Build structures that invite diverse input: design reviews open to the whole team, shared Figma files, and regular "design office hours."</p>
    `,
    author: {
      name: "Natali Craig",
      avatar: "https://i.pravatar.cc/40?img=9",
      bio: "Natali is a design lead and team-building advocate at a fast-growing startup. She writes about design culture, critique practices, and how cross-functional collaboration produces better products.",
    },
    date: "14 January 2022",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop",
    readTime: "5 min read",
  },
  {
    id: 8,
    slug: "our-top-10-javascript-frameworks",
    title: "Our top 10 Javascript frameworks to use",
    category: "Product",
    excerpt:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    content: `
      <p>The JavaScript ecosystem moves fast. New frameworks emerge constantly, and the landscape that was true two years ago has shifted significantly. Here's our curated list of the frameworks worth your time in 2024.</p>

      <h2>1. React</h2>
      <p>Still the most widely adopted UI library, React's component model and massive ecosystem make it the safe choice for most projects. The introduction of Server Components and improvements to Suspense have addressed many historical criticisms around performance.</p>

      <h2>2. Next.js</h2>
      <p>The de facto React framework for production. Next.js handles routing, SSR, SSG, API routes, and image optimization out of the box. Its App Router (stable since 13.4) brings React Server Components to mainstream development.</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <h2>3. Vue.js</h2>
      <p>Vue's gentle learning curve and excellent documentation make it a favorite for teams new to component-based development. Vue 3 with the Composition API brings it closer to React's flexibility while maintaining Vue's characteristic approachability.</p>

      <h2>4. Svelte / SvelteKit</h2>
      <p>Svelte's compiler-based approach produces smaller bundles and faster runtime performance than virtual DOM frameworks. SvelteKit is its full-stack framework equivalent, and it's genuinely delightful to use. A strong contender for greenfield projects.</p>

      <h2>5. Astro</h2>
      <p>Purpose-built for content-heavy sites, Astro ships zero JavaScript by default and only hydrates interactive components when needed. For blogs, marketing sites, and documentation, it's hard to beat.</p>
    `,
    author: {
      name: "Drew Cano",
      avatar: "https://i.pravatar.cc/40?img=15",
      bio: "Drew is a full-stack developer and open-source contributor who has worked with JavaScript frameworks since the early days of Angular. He curates picks based on real production experience, not hype.",
    },
    date: "13 January 2022",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop",
    readTime: "8 min read",
  },
  {
    id: 9,
    slug: "podcast-creating-a-better-cx-community",
    title: "Podcast: Creating a better CX community",
    category: "Customer Success",
    excerpt:
      "Starting a community doesn't need to be complicated, but how do you get started?",
    content: `
      <p>Customer experience communities are among the most powerful growth levers available to modern SaaS companies — and among the most underutilized. Building one that actually thrives takes intentionality, patience, and a genuine commitment to member value over company metrics.</p>

      <h2>Why Community Matters for CX</h2>
      <p>A thriving community reduces support load, accelerates onboarding, surfaces product feedback, and creates advocates who sell for you. But these are outcomes, not starting points. Communities built around "we want to reduce tickets" fail. Communities built around "we want to connect people with shared challenges" succeed.</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <h2>Choosing Your Platform</h2>
      <p>Slack, Discord, Circle, Discourse, and Khoros all have different strengths. The right choice depends on your audience's technical comfort, the type of conversations you want to foster, and your moderation capacity. Discord skews younger and more real-time; Discourse is better for searchable, async knowledge-sharing.</p>

      <h2>The Seeding Problem</h2>
      <p>Every community faces the cold start problem — nobody wants to join an empty room. Solve this by personally inviting your most engaged customers first, creating initial content yourself, and establishing a clear reason to show up daily before opening the doors widely.</p>

      <h2>Measuring Community Health</h2>
      <p>Avoid vanity metrics like total members. Focus on active participation rates, question response times, content quality scores, and the ratio of member-to-member interactions versus member-to-company interactions. A healthy community talks to itself, not just to you.</p>
    `,
    author: {
      name: "Orlando Diggs",
      avatar: "https://i.pravatar.cc/40?img=60",
      bio: "Orlando is a customer success leader who has built and scaled communities for B2B SaaS companies. He is passionate about turning customers into advocates and shares frameworks that actually work in practice.",
    },
    date: "12 January 2022",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop",
    readTime: "6 min read",
  },
];