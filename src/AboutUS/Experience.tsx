import React from "react";

type Stat = {
  value: string;
  label: string;
  sublabel: string;
};

const stats: Stat[] = [
  { value: "$12,5M", label: "TOTAL REVENUE FROM", sublabel: "2001 - 2023" },
  { value: "12K+", label: "ORDERS DELIVERED", sublabel: "SUCCESSFUL ON EVERYDAY" },
  { value: "725+", label: "STORE AND OFFICE IN U.S", sublabel: "AND WORLDWIDE" },
];

const Experience: React.FC = () => {
  return (
    <section className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-md">
        <div
          className="relative flex min-h-[220px] w-full items-center overflow-hidden"
          style={{
            background:
              "linear-gradient(120deg, #e8f5f0 0%, #d2ede5 30%, #c8e8e2 55%, #b4dfda 80%, #9fd5d0 100%)",
          }}
        >
          <div className="relative z-10 flex max-w-[400px] flex-col px-10 py-8">
            <h2 className="text-[2rem] leading-tight text-gray-900">
              <span className="font-extrabold">Best experience</span>
              <br />
              <span className="font-normal">always wins</span>
            </h2>

            <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
              #1 Online Marketplace for organic, nuetra, and
              <br />
              herbal medicines.
            </p>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex w-[68%] items-end justify-end">
            <svg
              viewBox="0 0 760 225"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="block h-full w-full"
              preserveAspectRatio="xMaxYMax meet"
              aria-hidden="true"
            >
              <defs>
                <filter id="experienceBoxShadow">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#0002" />
                </filter>
              </defs>

              <rect x="310" y="8" width="118" height="200" rx="5" fill="#E2B355" filter="url(#experienceBoxShadow)" />
              <rect x="310" y="8" width="118" height="200" rx="5" fill="none" stroke="#C0882A" strokeWidth="1" />
              <rect x="330" y="38" width="78" height="126" rx="4" fill="none" stroke="#C0882A" strokeWidth="2" />
              <line x1="330" y1="95" x2="408" y2="95" stroke="#C0882A" strokeWidth="1.5" />
              <rect x="398" y="55" width="5" height="20" rx="2.5" fill="#C0882A" opacity="0.6" />
              <rect x="398" y="105" width="5" height="30" rx="2.5" fill="#C0882A" opacity="0.6" />
              <text x="369" y="130" fontSize="24" fill="#C0882A" opacity="0.45" textAnchor="middle">❄</text>
              <rect x="322" y="12" width="72" height="13" rx="2" fill="#C0882A" opacity="0.22" />
              <text x="358" y="22" fontSize="6.5" fill="#7a5215" textAnchor="middle" letterSpacing="2">|||||  |||</text>
              <rect x="313" y="192" width="16" height="16" rx="2" fill="#C0882A" opacity="0.28" />
              <rect x="315" y="194" width="5" height="5" fill="#C0882A" opacity="0.5" />
              <rect x="322" y="194" width="5" height="5" fill="#C0882A" opacity="0.5" />
              <rect x="315" y="201" width="5" height="5" fill="#C0882A" opacity="0.5" />

              <rect x="195" y="30" width="112" height="178" rx="5" fill="#DCAC50" filter="url(#experienceBoxShadow)" />
              <rect x="195" y="30" width="112" height="178" rx="5" fill="none" stroke="#C0882A" strokeWidth="1" />
              <rect x="214" y="70" width="74" height="50" rx="5" fill="none" stroke="#C0882A" strokeWidth="2" />
              <rect x="254" y="76" width="26" height="38" rx="3" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <circle cx="232" cy="95" r="7" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <rect x="207" y="168" width="74" height="14" rx="2" fill="#C0882A" opacity="0.22" />
              <text x="244" y="178" fontSize="6.5" fill="#7a5215" textAnchor="middle" letterSpacing="2">|||  ||||</text>
              <rect x="198" y="34" width="14" height="14" rx="2" fill="#C0882A" opacity="0.28" />

              <rect x="435" y="28" width="112" height="180" rx="5" fill="#DBA845" filter="url(#experienceBoxShadow)" />
              <rect x="435" y="28" width="112" height="180" rx="5" fill="none" stroke="#C0882A" strokeWidth="1" />
              <ellipse cx="491" cy="108" rx="30" ry="24" fill="none" stroke="#C0882A" strokeWidth="2" />
              <line x1="491" y1="84" x2="491" y2="52" stroke="#C0882A" strokeWidth="2" />
              <line x1="491" y1="52" x2="530" y2="40" stroke="#C0882A" strokeWidth="2" />
              <circle cx="491" cy="108" r="9" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <rect x="447" y="32" width="72" height="13" rx="2" fill="#C0882A" opacity="0.22" />
              <text x="483" y="42" fontSize="6.5" fill="#7a5215" textAnchor="middle" letterSpacing="2">||||  ||</text>

              <rect x="560" y="22" width="112" height="112" rx="5" fill="#DDB050" filter="url(#experienceBoxShadow)" />
              <rect x="560" y="22" width="112" height="112" rx="5" fill="none" stroke="#C0882A" strokeWidth="1" />
              <rect x="576" y="45" width="80" height="52" rx="3" fill="none" stroke="#C0882A" strokeWidth="2" />
              <rect x="570" y="97" width="92" height="8" rx="2" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <text x="616" y="122" fontSize="11" fill="#C0882A" opacity="0.45" textAnchor="middle">♻</text>
              <rect x="572" y="26" width="72" height="13" rx="2" fill="#C0882A" opacity="0.22" />
              <text x="608" y="36" fontSize="6.5" fill="#7a5215" textAnchor="middle" letterSpacing="2">||||  ||</text>

              <rect x="118" y="113" width="82" height="112" rx="5" fill="#E0B048" filter="url(#experienceBoxShadow)" />
              <rect x="118" y="113" width="82" height="112" rx="5" fill="none" stroke="#C0882A" strokeWidth="1" />
              <rect x="130" y="128" width="58" height="44" rx="3" fill="none" stroke="#C0882A" strokeWidth="2" />
              <circle cx="159" cy="150" r="11" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <circle cx="159" cy="150" r="4" fill="#C0882A" opacity="0.4" />
              <rect x="130" y="176" width="58" height="8" rx="2" fill="none" stroke="#C0882A" strokeWidth="1" />
              <rect x="120" y="200" width="14" height="14" rx="2" fill="#C0882A" opacity="0.28" />
              <rect x="122" y="202" width="4" height="4" fill="#C0882A" opacity="0.5" />
              <rect x="128" y="202" width="4" height="4" fill="#C0882A" opacity="0.5" />
              <rect x="122" y="208" width="4" height="4" fill="#C0882A" opacity="0.5" />

              <rect x="38" y="148" width="82" height="77" rx="5" fill="#D9A238" filter="url(#experienceBoxShadow)" />
              <rect x="38" y="148" width="82" height="77" rx="5" fill="none" stroke="#C0882A" strokeWidth="1" />
              <rect x="50" y="160" width="58" height="44" rx="3" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <circle cx="79" cy="182" r="9" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <rect x="40" y="200" width="14" height="14" rx="2" fill="#C0882A" opacity="0.28" />

              <rect x="435" y="162" width="112" height="63" rx="5" fill="#D9A640" filter="url(#experienceBoxShadow)" />
              <rect x="435" y="162" width="112" height="63" rx="5" fill="none" stroke="#C0882A" strokeWidth="1" />
              <rect x="448" y="172" width="86" height="40" rx="3" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <text x="491" y="198" fontSize="20" fill="#C0882A" opacity="0.5" textAnchor="middle">🔥</text>

              <rect x="558" y="134" width="114" height="91" rx="5" fill="#DCA840" filter="url(#experienceBoxShadow)" />
              <rect x="558" y="134" width="114" height="91" rx="5" fill="none" stroke="#C0882A" strokeWidth="1" />
              <circle cx="615" cy="180" r="28" fill="none" stroke="#C0882A" strokeWidth="2" />
              <circle cx="615" cy="180" r="11" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <text x="615" y="186" fontSize="14" fill="#C0882A" opacity="0.45" textAnchor="middle">☯</text>
              <rect x="568" y="138" width="72" height="13" rx="2" fill="#C0882A" opacity="0.22" />
              <text x="604" y="148" fontSize="6.5" fill="#7a5215" textAnchor="middle" letterSpacing="2">|||  ||||</text>

              <rect x="310" y="180" width="118" height="44" rx="5" fill="#E0B040" filter="url(#experienceBoxShadow)" />
              <rect x="310" y="180" width="118" height="44" rx="5" fill="none" stroke="#C0882A" strokeWidth="1" />
              <circle cx="356" cy="202" r="10" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <circle cx="356" cy="202" r="5" fill="none" stroke="#C0882A" strokeWidth="1" />
              <circle cx="382" cy="202" r="8" fill="none" stroke="#C0882A" strokeWidth="1.5" />
              <text x="382" y="206" fontSize="10" fill="#C0882A" opacity="0.4" textAnchor="middle">✦</text>
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-stretch border-t border-gray-100 bg-white md:flex-row">
          <div className="flex shrink-0 items-center px-10 py-8 md:min-w-[260px] md:max-w-[300px]">
            <p className="text-[13px] font-bold uppercase leading-[1.7] tracking-[0.01em] text-[#1a1a1a]">
              OUR PURPOSE IS TO <span className="text-[#22c55e]">ENRICH</span>
              <br />
              <span className="text-[#22c55e]">AND ENHANCE LIVES</span>{" "}
              <span className="text-[#1a1a1a]">THROUGH</span>
              <br />
              <span className="text-[#1a1a1a]">PHARMA</span>
            </p>
          </div>

          <div className="flex flex-1 items-stretch divide-x divide-gray-200">
            {stats.map((stat) => (
              <div key={stat.value} className="flex flex-col justify-center px-10 py-8">
                <span className="text-[2.2rem] font-extrabold leading-none tracking-[-0.02em] text-gray-900">
                  {stat.value}
                </span>
                <span className="mt-1.5 text-[10.5px] font-semibold uppercase leading-[1.5] tracking-[0.05em] text-gray-500">
                  {stat.label}
                  <br />
                  {stat.sublabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;