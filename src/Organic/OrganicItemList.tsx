import { useLocation,useNavigate } from 'react-router-dom';
import { products } from '../datas/product';

interface ColorConfig {
  category: 'herbal' | 'organic' | 'nutraceuticals';
  ctaButtonColor: string;
  ctaButtonHover: string;
  enquiresBgColor: string;
  badge: string;
  badgeHover: string;
}

const colorConfigs: Record<string, ColorConfig> = {
  herbal: {
    category: 'herbal',
    ctaButtonColor: '#C38046',
    ctaButtonHover: '#5a9a2b',
    enquiresBgColor: '#FDEDD2',
    badge: '#68A833',
    badgeHover: '#5fa42f',
  },
  organic: {
    category: 'organic',
    ctaButtonColor: '#68A833',
    ctaButtonHover: '#3d8a8e',
    enquiresBgColor: '#EDFAEB',
    badge: '#68A833',
    badgeHover: '#3d8a8e',
  },
  nutraceuticals: {
    category: 'nutraceuticals',
    ctaButtonColor: '#4AA3A7',
    ctaButtonHover: '#b0712c',
    enquiresBgColor: '#D3EFF066',
    badge: '#4AA3A7',
    badgeHover: '#b0712c',
  },
};

const getColorConfig = (pathname: string): ColorConfig => {
  if (pathname.includes('/herbal')) return colorConfigs.herbal;
  if (pathname.includes('/organic')) return colorConfigs.organic;
  if (pathname.includes('/nutraceutical')) return colorConfigs.nutraceuticals;
  return colorConfigs.organic; // default
};

export default function OrganicItemList() {
  const navigate = useNavigate();
  const location = useLocation();
  const colors = getColorConfig(location.pathname);

const items = products;

  const ProductCard = ({ item }: { item: (typeof items)[0] }) => (
   <article
  onClick={() => navigate(`/product/${item.slug}`)}
  className="relative overflow-hidden rounded-[14px] border border-[#9f9f9f] bg-white px-[10px] pb-[10px] pt-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-pointer hover:shadow-lg transition"
>
      <button
        type="button"
        aria-label="Wishlist"
        className="absolute right-[12px] top-[12px] z-10 flex h-[20px] w-[20px] items-center justify-center text-black transition-transform hover:scale-110"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21s-7-4.6-7-10.4A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7 3.3C19 16.4 12 21 12 21Z" />
        </svg>
      </button>

      <div className="flex h-52 items-center justify-center overflow-hidden rounded-[4px] bg-[#f8f8f5]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="pt-[8px]">
        <span
          className="inline-flex h-[18px] items-center rounded-[4px] px-[10px] text-[10px] font-medium leading-none text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: colors.badge }}
        >
          {item.badge}
        </span>

        <h3 className="mt-[8px] text-[18px] font-normal leading-[1.08] tracking-[-0.03em] text-[#242424]">
          {item.title}
        </h3>

        <p className="mt-[4px] max-w-[165px] text-[12px] leading-[1.22] text-[#3e3e3e]">
          {item.description}
        </p>

        <div className="mt-[8px]">
          <p className="text-[12px] font-semibold leading-none text-[#191919]">
            {item.bulk}
          </p>

          <div className="mt-[4px] flex items-center justify-between gap-3 text-[10px] leading-none text-[#8b8b8b]">
            <span>{item.moq}</span>
            <span>{item.extra}</span>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <section className="w-full bg-white py-6 md:py-8">
      <div className="mx-auto w-full px-4 md:px-6 max-w-[1440px]">
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:gap-x-6 xl:gap-x-[42px] lg:gap-y-10 xl:gap-y-[46px]">
          {items.slice(0, 4).map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}

          {/* Enquiries Sidebar - Colors change based on category */}
          <aside
            className="rounded-[20px] px-3 xl:px-[22px] pb-[18px] pt-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            style={{ backgroundColor: colors.enquiresBgColor }}
          >
            <h2 className="text-[20px] xl:text-[24px] font-semibold leading-none tracking-[-0.03em] text-black">
              For Enquiries
            </h2>

            <div className="mt-[10px] space-y-[6px] text-[13px] xl:text-[15px] leading-tight text-[#303030]">
              <p>Lorum Ipsum Lorum ipsum</p>
              <p>Lorum Ipsum Lorum.</p>
            </div>

            <ul className="mt-[10px] space-y-[8px]">
              {['Lorum Ipsum Lorum.', 'Lorum Ipsum Lorum.'].map((text, idx) => (
                <li key={idx} className="flex items-start gap-[9px] text-[12.5px] xl:text-[14px] text-[#3b3b3b]">
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#2d2d2d] text-[#2d2d2d]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[10px] w-[10px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="1.8"
                        fill="currentColor"
                        stroke="none"
                      />
                      <path d="M12 5.2a6.8 6.8 0 1 0 0 13.6" />
                    </svg>
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-[16px] space-y-[10px]">
              {/* Connect Us Button - Color changes based on category */}
              <button
                type="button"
                className="flex h-[42px] w-full items-center justify-center rounded-[10px] text-[14px] xl:text-[16px] font-semibold text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)] transition-all hover:opacity-90 whitespace-nowrap px-2"
                style={{ backgroundColor: colors.ctaButtonColor }}
              >
                Connect Us
              </button>

              {/* Download Catalog Button - Border color changes based on category */}
              <button
                type="button"
                className="flex h-[42px] w-full items-center justify-center rounded-[10px] border-2 bg-transparent text-[14px] xl:text-[16px] font-semibold transition-all hover:opacity-90 whitespace-nowrap px-2"
                style={{
                  borderColor: colors.ctaButtonColor,
                  color: colors.ctaButtonColor,
                }}
              >
                Download Catalog
              </button>
            </div>
          </aside>



          {items.slice(4).map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}