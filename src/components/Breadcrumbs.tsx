import { Link, useLocation } from 'react-router-dom';
import { products } from '../datas/product';

const routeLabels: Record<string, string> = {
  '/aboutus': 'About Us',
  '/blog': 'Blog',
  '/contact': 'Contact',
  '/cookies': 'Cookie Policy',
  '/customer-service': 'Customer Service',
  '/help-center': 'Help Center',
  '/herbal': 'Herbal',
  '/login': 'Login',
  '/nutraceutical': 'Nutraceutical',
  '/organic': 'Organic',
  '/privacy': 'Privacy',
  '/production': 'Production',
  '/productpage': 'Products',
  '/research': 'Research',
  '/signup': 'Sign Up',
  '/terms': 'Terms',
  '/user-profile': 'User Profile',
};

const formatSegment = (segment: string) =>
  segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getLabelForPath = (path: string, segments: string[]) => {
  if (routeLabels[path]) return routeLabels[path];

  if (segments[0] === 'product' && segments.length > 1) {
    return path === '/product' ? 'Products' : 'Product Details';
  }

  if (segments[0] === 'blog' && segments.length > 1) {
    return 'Blog Post';
  }

  return formatSegment(segments[segments.length - 1]);
};

const Breadcrumbs = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  const segments = location.pathname.split('/').filter(Boolean);
  const crumbs: Array<{ label: string; to?: string }> = [{ label: 'Home', to: '/' }];

  const categoryRoutes = ['organic', 'herbal', 'nutraceutical'];
  const isCategoryPage = segments[0] ? categoryRoutes.includes(segments[0]) : false;

  if (segments[0] === 'product' && segments[1]) {
    const product = products.find((item) => item.slug === segments[1]);
    const category = product?.badge?.toLowerCase();
    const categoryLabel = category && categoryRoutes.includes(category)
      ? `Products: ${formatSegment(category)}`
      : 'Products';

    crumbs.push({ label: categoryLabel, to: category && categoryRoutes.includes(category) ? `/${category}` : '/productpage' });
    crumbs.push({ label: 'Product Details', to: undefined });
  } else if (isCategoryPage) {
    crumbs.push({
      label: `Products: ${formatSegment(segments[0])}`,
      to: undefined,
    });
  } else {
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      const label = getLabelForPath(currentPath, segments.slice(0, index + 1));

      crumbs.push({
        label,
        to: isLast ? undefined : currentPath,
      });
    });
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="sticky top-[65px] z-[90] w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center px-4 py-2.5 md:px-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500 pl-0">
          {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-black">{crumb.label}</span>
              ) : (
                <>
                  <Link to={crumb.to!} className="transition-colors hover:text-green-700">
                    {crumb.label}
                  </Link>
                  <span className="text-gray-400">/</span>
                </>
              )}
            </li>
          );
        })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
