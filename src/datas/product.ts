export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string;
  badge: string;
  bulk: string;
  moq: string;
  extra: string;
  image: string;

  // Detail Page
  price: number;
  oldPrice: number;
  country: string;
  manufacturer: string;
  longDescription: string;
  features: string[];
}

export const products: Product[] = [
  {
    id: 1,
    slug: "organic-vitamin-c",
    title: "Organic Vitamin C",
    description: "Premium immune support supplement.",
    badge: "Organic",
    bulk: "Bulk Pack",
    moq: "MOQ: 10000 units",
    extra: "Orange",
    image: "/Global/Tablet.png",
    price: 22.95,
    oldPrice: 29.95,
    country: "USA",
    manufacturer: "Nature Labs",
    longDescription:
      "Organic Vitamin C is formulated to support immunity, improve antioxidant protection, and maintain overall wellness.",
    features: [
      "Boosts Immunity",
      "Rich in Antioxidants",
      "100% Organic Ingredients",
      "No Artificial Preservatives",
    ],
  },
  {
    id: 2,
    slug: "herbal-ashwagandha",
    title: "Herbal Ashwagandha",
    description: "Supports stress relief and vitality.",
    badge: "Herbal",
    bulk: "Bulk Pack",
    moq: "MOQ: 8000 units",
    extra: "Root Extract",
    image: "/Global/Bottle.png",
    price: 18.99,
    oldPrice: 24.99,
    country: "India",
    manufacturer: "Ayur Organics",
    longDescription:
      "Ashwagandha helps reduce stress, supports healthy sleep and improves overall energy levels.",
    features: [
      "Stress Relief",
      "Improves Sleep",
      "Natural Adaptogen",
      "Vegan Formula",
    ],
  },
  {
    id: 3,
    slug: "omega-3-softgels",
    title: "Omega 3 Softgels",
    description: "Heart and brain health support.",
    badge: "Nutraceutical",
    bulk: "Bulk Pack",
    moq: "MOQ: 12000 units",
    extra: "Fish Oil",
    image: "/Global/Bottle.png",
    price: 25.5,
    oldPrice: 31.5,
    country: "Canada",
    manufacturer: "Health Plus",
    longDescription:
      "High quality Omega 3 softgels providing EPA & DHA for cardiovascular and cognitive health.",
    features: [
      "Supports Heart Health",
      "Brain Function",
      "High EPA & DHA",
      "Easy to Swallow",
    ],
  },
];

// Generate 9 demo products
for (let i = 4; i <= 9; i++) {
  products.push({
    id: i,
    slug: `demo-product-${i}`,
    title: `Demo Product ${i}`,
    description: `Lorem ipsum product description ${i}.`,
    badge: i % 2 ? "Organic" : "Herbal",
    bulk: "Bulk Pack",
    moq: `MOQ: ${i * 2000} units`,
    extra: "Premium",
    image: "/Global/Tablet.png",
    price: 15 + i,
    oldPrice: 20 + i,
    country: "USA",
    manufacturer: "Demo Labs",
    longDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: [
      "Feature One",
      "Feature Two",
      "Feature Three",
      "Feature Four",
    ],
  });
}