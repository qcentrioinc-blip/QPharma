export const landingConfigs = {
  organic: {
    title: "Organic Medicines",
    subtitle: "Pure. Natural. Effective",
    bgImage: "/OrganicLanding.png",
    icon: "/Global/Leaf.png",

    colors: {
      sectionBg: "#f8f9ef",
      subtitle: "#6e8455",
      iconBorder: "#87996b",
    },

    features: [
      "Certified Organic Ingredients",
      "Chemical Free",
      "Eco Friendly",
      "Clinically Tested",
    ],
  },

  herbal: {
    title: "Herbal Medicines",
    subtitle: "Traditional Wisdom. Modern Standards",

    bgImage: "/Global/HerbalBg.png",
    icon: "/Global/Leaf.png",

    colors: {
      sectionBg: "#fbf3e5",
      subtitle: "#c97a28",
      iconBorder: "#d5964f",
    },

    features: [
      "Ancient Herbal",
      "Plant Based",
      "Safe & Effective",
      "Trusted Remedies",
    ],
  },

  nutraceutical: {
    title: "Nutraceuticals",
    subtitle: "Science. Nutrition. Wellness",

    bgImage: "/Global/NutraBg.png",
    icon: "/Global/Leaf.png",

    colors: {
      sectionBg: "#edf6fb",
      subtitle: "#4093c7",
      iconBorder: "#67a8d1",
    },

    features: [
      "Nutritional Support",
      "Research Driven",
      "Premium Quality",
      "Daily Wellness",
    ],
  },
};

export type LandingVariant = keyof typeof landingConfigs;