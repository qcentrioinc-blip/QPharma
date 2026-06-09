import { Link } from "react-router-dom";

const svgToDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const herbalImage = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320">
  <defs>
    <linearGradient id="leaf1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#96ba4d"/>
      <stop offset="100%" stop-color="#4f7d22"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#8d9978" flood-opacity="0.22"/>
    </filter>
  </defs>

  <ellipse cx="258" cy="292" rx="180" ry="16" fill="#d6dbc9"/>

  <g filter="url(#shadow)">
    <ellipse cx="160" cy="220" rx="70" ry="18" fill="#dcded8"/>
    <path d="M92 152C92 128 112 112 136 112H199C223 112 243 128 243 152V208C243 242 216 266 168 266C120 266 92 242 92 208V152Z" fill="#f7f7f3"/>
    <ellipse cx="168" cy="208" rx="72" ry="18" fill="#ecece6"/>
    <path d="M140 98C145 72 164 63 182 64C201 65 214 82 215 106L196 110C194 94 186 86 178 85C169 84 160 92 157 107L140 98Z" fill="#f7f7f3"/>
    <rect x="165" y="62" width="26" height="92" rx="13" transform="rotate(24 178 108)" fill="#f4f4ef"/>
  </g>

  <g>
    <path d="M70 238C98 206 124 198 138 208C122 231 100 250 70 262Z" fill="url(#leaf1)"/>
    <path d="M88 208C124 168 162 160 184 178C156 206 124 224 88 232Z" fill="url(#leaf1)"/>
    <path d="M120 174C152 136 188 130 211 148C188 176 158 194 120 202Z" fill="url(#leaf1)"/>
    <path d="M192 164C220 126 254 122 276 142C254 169 226 187 192 194Z" fill="url(#leaf1)"/>
    <path d="M230 178C256 140 294 136 316 156C292 185 264 203 230 210Z" fill="url(#leaf1)"/>
    <path d="M266 204C294 174 332 174 352 194C322 217 294 226 266 228Z" fill="url(#leaf1)"/>
    <path d="M312 190C330 158 356 150 376 162C364 186 342 204 312 212Z" fill="url(#leaf1)"/>
  </g>

  <g fill="none" stroke="#6b8d34" stroke-width="4" stroke-linecap="round">
    <path d="M126 258C128 222 126 188 119 158"/>
    <path d="M286 244C288 216 286 190 278 160"/>
    <path d="M350 248C352 218 350 192 342 168"/>
  </g>

  <g fill="#7ba03a">
    <ellipse cx="108" cy="222" rx="10" ry="22" transform="rotate(-34 108 222)"/>
    <ellipse cx="132" cy="210" rx="10" ry="22" transform="rotate(24 132 210)"/>
    <ellipse cx="268" cy="202" rx="8" ry="18" transform="rotate(-20 268 202)"/>
    <ellipse cx="290" cy="192" rx="8" ry="18" transform="rotate(24 290 192)"/>
    <ellipse cx="332" cy="216" rx="8" ry="18" transform="rotate(-18 332 216)"/>
    <ellipse cx="356" cy="205" rx="8" ry="18" transform="rotate(24 356 205)"/>
  </g>

  <g>
    <circle cx="214" cy="260" r="20" fill="#fff"/>
    <circle cx="214" cy="260" r="7" fill="#f0c23f"/>
    <circle cx="246" cy="266" r="19" fill="#fff"/>
    <circle cx="246" cy="266" r="7" fill="#f0c23f"/>
    <circle cx="278" cy="256" r="18" fill="#fff"/>
    <circle cx="278" cy="256" r="7" fill="#f0c23f"/>
  </g>
</svg>
`);

const nutraceuticalImage = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320">
  <defs>
    <linearGradient id="leaf2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8fb64b"/>
      <stop offset="100%" stop-color="#507b21"/>
    </linearGradient>
    <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#7c8e8a" flood-opacity="0.22"/>
    </filter>
  </defs>

  <ellipse cx="260" cy="292" rx="175" ry="16" fill="#d4dee0"/>

  <g>
    <path d="M118 228C152 166 210 148 266 160C230 214 184 248 118 258Z" fill="url(#leaf2)"/>
    <path d="M172 186C206 132 262 120 316 134C286 182 236 214 172 224Z" fill="url(#leaf2)"/>
    <path d="M230 220C264 170 316 164 362 182C332 220 290 244 230 248Z" fill="url(#leaf2)"/>
  </g>

  <g filter="url(#shadow2)">
    <ellipse cx="335" cy="236" rx="54" ry="12" fill="#c8d3d5"/>
    <rect x="290" y="110" width="90" height="128" rx="16" fill="#8b4d13"/>
    <rect x="286" y="95" width="98" height="28" rx="8" fill="#f4f1ec"/>
    <rect x="302" y="100" width="66" height="18" rx="6" fill="#e6e0d7"/>
    <rect x="296" y="144" width="78" height="82" rx="8" fill="#f7f7f7"/>
  </g>

  <g filter="url(#shadow2)">
    <ellipse cx="206" cy="256" rx="62" ry="12" fill="#d0dadc"/>
    <path d="M148 222C148 194 170 172 204 172C238 172 260 194 260 222V238C260 256 238 270 204 270C170 270 148 256 148 238V222Z" fill="#f8f7f3"/>
    <ellipse cx="204" cy="221" rx="56" ry="14" fill="#efeee8"/>
  </g>

  <g fill="#efe5cf" stroke="#d8ccb4" stroke-width="2">
    <rect x="78" y="244" width="44" height="16" rx="8" transform="rotate(-34 78 244)"/>
    <rect x="104" y="262" width="44" height="16" rx="8" transform="rotate(-34 104 262)"/>
    <rect x="160" y="234" width="38" height="16" rx="8" transform="rotate(20 160 234)"/>
    <rect x="182" y="227" width="38" height="16" rx="8" transform="rotate(20 182 227)"/>
    <rect x="194" y="228" width="34" height="14" rx="7"/>
    <rect x="214" y="231" width="34" height="14" rx="7"/>
  </g>
</svg>
`);

const organicImage = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320">
  <defs>
    <linearGradient id="leaf3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#98bf4b"/>
      <stop offset="100%" stop-color="#507a22"/>
    </linearGradient>
    <filter id="shadow3" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#8c836f" flood-opacity="0.20"/>
    </filter>
  </defs>

  <ellipse cx="260" cy="292" rx="182" ry="16" fill="#ddd3c3"/>

  <g filter="url(#shadow3)">
    <path d="M102 156C124 138 192 142 216 168L204 268H112L102 156Z" fill="#c89d68"/>
    <path d="M104 164C132 144 188 148 212 172" stroke="#ac8459" stroke-width="4" fill="none"/>
    <path d="M110 176C134 158 186 162 206 182" stroke="#a47b51" stroke-width="4" fill="none"/>
    <path d="M116 188C138 172 182 174 200 192" stroke="#9b734d" stroke-width="4" fill="none"/>
  </g>

  <g>
    <path d="M104 192C128 160 158 152 180 168C162 196 136 214 104 220Z" fill="url(#leaf3)"/>
    <path d="M126 164C152 126 188 120 212 140C190 172 160 190 126 194Z" fill="url(#leaf3)"/>
    <path d="M156 174C184 136 220 132 244 152C220 184 192 200 156 204Z" fill="url(#leaf3)"/>
    <path d="M144 206C174 174 218 176 244 194C214 220 184 226 144 228Z" fill="url(#leaf3)"/>
  </g>

  <g filter="url(#shadow3)">
    <ellipse cx="350" cy="248" rx="92" ry="18" fill="#d8c7aa"/>
    <path d="M260 210C260 174 302 150 350 150C398 150 440 174 440 210V222C440 254 400 276 350 276C300 276 260 254 260 222V210Z" fill="#9a6837"/>
    <ellipse cx="350" cy="206" rx="88" ry="22" fill="#ae7842"/>
  </g>

  <g>
    <path d="M304 202C336 160 380 150 414 170C388 208 350 230 304 234Z" fill="url(#leaf3)"/>
    <path d="M356 182C392 134 434 126 466 148C444 192 406 218 356 220Z" fill="url(#leaf3)"/>
    <path d="M332 222C366 188 410 188 442 204C416 232 380 244 332 244Z" fill="url(#leaf3)"/>
    <path d="M290 230C320 198 358 198 384 214C356 240 326 250 290 252Z" fill="url(#leaf3)"/>
  </g>

  <g>
    <circle cx="330" cy="250" r="18" fill="#7ab047"/>
    <circle cx="366" cy="246" r="16" fill="#c7372f"/>
    <ellipse cx="398" cy="248" rx="20" ry="14" fill="#f3d253"/>
    <ellipse cx="432" cy="244" rx="22" ry="12" fill="#84b84a" transform="rotate(-10 432 244)"/>
  </g>
</svg>
`);

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-[18px] w-[18px]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19M19 12L13 6M19 12L13 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TopLeafIcon = () => (
  <svg
    viewBox="0 0 64 64"
    className="h-[58px] w-[58px]"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.5 35.5V56"
      stroke="#6E9446"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M31.5 36C18 34 11.5 26 11.5 14.5C24.5 14.5 31.5 22 31.5 36Z"
      fill="#89AE50"
    />
    <path
      d="M31.5 36C45 34 51.5 26 51.5 14.5C38.5 14.5 31.5 22 31.5 36Z"
      fill="#7C9F46"
    />
    <path
      d="M24.5 20.5C28 24 30 28.5 31.5 36"
      stroke="#5F8138"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M38.5 20.5C35 24 33 28.5 31.5 36"
      stroke="#5F8138"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M31.5 23C23.5 22 19.5 17 19.5 9.5C27 9.5 31.5 13.5 31.5 23Z"
      fill="#A2C46B"
    />
  </svg>
);

const SmallLeafDivider = () => (
  <div className="flex items-center justify-center gap-3">
    <span className="h-px w-14 bg-[#d8d9cf]" />
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 13.5V20"
        stroke="#7A9E4C"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 13.5C7.2 12.8 5 9.8 5 5.8C9.6 5.8 12 8.4 12 13.5Z"
        fill="#89AE50"
      />
      <path
        d="M12 13.5C16.8 12.8 19 9.8 19 5.8C14.4 5.8 12 8.4 12 13.5Z"
        fill="#7C9F46"
      />
    </svg>
    <span className="h-px w-14 bg-[#d8d9cf]" />
  </div>
);

const HerbalBadge = () => (
  <svg viewBox="0 0 48 48" className="h-11 w-11" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 25V40" stroke="#6D9345" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 26C14 24.6 9.5 18.7 9.5 10.5C19 10.5 24 15.8 24 26Z" fill="#7FA84A" />
    <path d="M24 26C34 24.6 38.5 18.7 38.5 10.5C29 10.5 24 15.8 24 26Z" fill="#6E9543" />
    <path d="M20 15C22 17.5 23.3 20.6 24 26" stroke="#5E8337" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M28 15C26 17.5 24.7 20.6 24 26" stroke="#5E8337" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CapsuleBadge = () => (
  <svg viewBox="0 0 48 48" className="h-11 w-11" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-42 24 24)">
      <rect x="10" y="17" width="28" height="14" rx="7" fill="#1D6B67" />
      <path d="M24 17H31C34.866 17 38 20.134 38 24C38 27.866 34.866 31 31 31H24V17Z" fill="#F5FBFB" />
      <path d="M17 17H24V31H17C13.134 31 10 27.866 10 24C10 20.134 13.134 17 17 17Z" fill="#1D6B67" />
      <path d="M24 17V31" stroke="#A5BFBD" strokeWidth="1.3" />
    </g>
  </svg>
);

const OrganicBadge = () => (
  <svg viewBox="0 0 48 48" className="h-11 w-11" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.5 24V39" stroke="#6E9344" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M24 24C15 23 10.5 17.8 10.5 10C19.2 10 24 14.5 24 24Z"
      fill="#88AE4F"
    />
    <path
      d="M24.3 24C31.2 23 35.5 18.8 37.5 12.6C31 12.8 26.7 16 24.3 24Z"
      fill="#769A45"
    />
  </svg>
);

const cards = [
  {
    title: "Herbal",
    description:
      "Harness the power of nature with our pure and potent herbal products.",
    button: "Explore Herbal",
    bg: "bg-[#EDF1E5]",
    buttonBg: "bg-[#7D9851] hover:bg-[#6f8746]",
    icon: <HerbalBadge />,
    image: herbalImage,
    route: "/herbal",
  },
  {
    title: "Neutraceutical",
    description:
      "Science-backed nutrition to support your wellness and everyday health.",
    button: "Explore Neutraceutical",
    bg: "bg-[#E7F0F2]",
    buttonBg: "bg-[#2F7974] hover:bg-[#286963]",
    icon: <CapsuleBadge />,
    image: nutraceuticalImage,
    route: "/nutraceutical",
  },
  {
    title: "Organic",
    description:
      "Naturally grown, chemical-free products for a clean and conscious life.",
    button: "Explore Organic",
    bg: "bg-[#F5EFE5]",
    buttonBg: "bg-[#7D9851] hover:bg-[#6f8746]",
    icon: <OrganicBadge />,
    image: organicImage,
    route: "/organic",
  },
];

const titleFont = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
};

export default function Explore() {
  return (
    <section className="w-full bg-[#f8f7f3] px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-[1140px]">
        <div className="mb-10 text-center md:mb-12">
          <div className="mb-2 flex justify-center">
            <TopLeafIcon />
          </div>

          <h2
            style={titleFont}
            className="mx-auto max-w-[920px] text-[38px] font-semibold leading-[0.95] tracking-[-0.02em] text-[#1E4734] sm:text-[46px] md:text-[62px]"
          >
            Explore Our Product Categories
          </h2>

          <div className="mt-4">
            <SmallLeafDivider />
          </div>

          <p className="mx-auto mt-5 max-w-[650px] text-[17px] font-normal leading-7 text-[#5f645f] md:text-[18px]">
            Nature-inspired solutions for a healthier you and a better tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-[14px]">
          {cards.map((card) => (
            <article
              key={card.title}
              className={`${card.bg} flex min-h-[520px] flex-col overflow-hidden rounded-[18px] px-6 pb-7 pt-5 shadow-[0_8px_28px_rgba(34,52,31,0.04)] md:min-h-[518px] md:px-7`}
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(42,63,36,0.08)]">
                  {card.icon}
                </div>
              </div>

              <h3
                style={titleFont}
                className="text-center text-[34px] font-semibold leading-none tracking-[-0.02em] text-[#234936]"
              >
                {card.title}
              </h3>

              <p className="mx-auto mt-3 max-w-[290px] text-center text-[15px] leading-[1.55] text-[#555b56] md:text-[16px]">
                {card.description}
              </p>

              <div className="mt-auto pt-6">
                <div className="flex h-[220px] items-end justify-center md:h-[230px]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="mt-5 flex justify-center">
                  <Link
                    to={card.route}
                    className={`inline-flex h-[48px] items-center gap-3 rounded-[14px] px-7 text-[15px] font-medium text-white transition-all duration-200 ${card.buttonBg} shadow-[0_8px_20px_rgba(59,86,49,0.16)]`}
                  >
                    <span>{card.button}</span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}