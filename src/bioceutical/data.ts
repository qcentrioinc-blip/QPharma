import { publicAssetSrc } from "@/lib/publicAssetSrc";
import { BIO_PRODUCT_IMAGES } from "./imageManifest";
import type { FormulaCategory, FormulaItem, RangeTheme } from "../components/formulaTypes";

export type { FormulaCategory, FormulaItem, RangeTheme };

export function bioProductImage(folder: string, formula: string): string {
  const src = BIO_PRODUCT_IMAGES[`${folder}|${formula}`] ?? "";
  return src ? publicAssetSrc(src) : "";
}

function slugify(...parts: string[]): string {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const theme: RangeTheme = {
  title: "Bioceutical Formulations",
  subtitle: "Targeted bio-enhanced and therapeutic formulations engineered for clinical-grade contract manufacturing",
  accent: "#1E5D57",
  accentSoft: "#EAF4F3",
  bg: "#eaf4f3",
  border: "#13423e",
  heroImage: "/Generated/bioceutical-hero.webp",
  overlay: "rgba(234,244,243,0.92)",
};

export const bioceuticalProducts: FormulaItem[] = [
  {
    id: slugify("bioceutical", "booon-oral-drops-syrup"),
    formula: "BoooN Oral Drops & Syrup",
    image: bioProductImage("Bioceuticals", "BoooN Oral Drops & Syrup"),
    description:
      "BoooN Syrup is a specialized Ayurvedic formulation designed to support the management of mucositis and oral health symptoms. It is formulated to provide protective, soothing and antimicrobial support for the oral cavity, particularly when oral mucosal integrity is affected. The formulation combines carefully selected botanical extracts traditionally used for oral care, mucosal support, soothing action and overall oral hygiene.",
    benefits: [
      "Mucosal Healing: Supports the repair of ulcers and lesions associated with mucositis and stomatitis.",
      "Protective Barrier: Helps moisturize and lubricate the mouth, supporting sensitive oral tissues.",
      "Biofilm Management: Supports oral biofilm management and overall oral hygiene.",
      "Irradiation Support: Helps support oral and salivary health during radiation therapy.",
      "Symptomatic Relief: Supports fresh breath, gum health and overall oral hygiene.",
      "Quality of Life: Supports comfortable food intake and overall nutritional well-being.",
    ],
  },
  {
    id: slugify("bioceutical", "sap-bio-barrier-nasal-cream"),
    formula: "S A P Bio-Barrier Nasal Cream",
    image: bioProductImage("Bioceuticals", "S A P Bio-Barrier Nasal Cream"),
    description:
      "S A P Nasal Cream is an Ayurvedic formulation designed to act as a mechanical and therapeutic barrier against environmental pollutants, allergens, and irritants. By leveraging traditional herbal extracts in a cream base, it aims to maintain nasal mucosal health and improve the quality of life for individuals in high-exposure environments. The formulation contains five potent Ayurvedic ingredients, including Ghrita Kumari, Tulsi, Yashti, Sirish, and Bharangi, each standardized at 2.0% W/W. These traditionally used herbal ingredients support soothing, moisturizing, mucosal protection, respiratory health, and overall nasal comfort. S A P Nasal Cream is suitable for individuals exposed to dust, smoke, air pollution, allergens, dry air, and other environmental irritants. It can be particularly useful for commuters, travelers, healthcare workers, industrial workers, construction and mining personnel, and individuals working in high-exposure environments.",
    benefits: [
      "Environmental Protection: Acts as a protective barrier against dust, smoke, air pollutants, allergens, and other environmental irritants.",
      "Mucosal Moisturization: Helps soothe and hydrate the nasal passages, supporting nasal mucosal comfort and reducing dryness.",
      "Allergy Support: Helps reduce exposure to environmental triggers associated with allergic nasal irritation.",
      "Soothing & Comfort: Helps relieve dry, itchy, and irritated nasal passages, particularly in dry or polluted environments.",
      "Respiratory Support: The Ayurvedic herbal ingredients support respiratory health and help manage nasal secretions.",
      "Protection in High-Exposure Environments: Supports individuals regularly exposed to pollution, air conditioning, extreme climates, dust, and smoke.",
    ],
  },
  {
    id: slugify("bioceutical", "vanmul-chewable-immune-tablets"),
    formula: "Vanmul Chewable Immune Tablets",
    image: bioProductImage("Bioceuticals", "Vanmul Chewable Immune Tablets"),
    description:
      "Vanmul Chewable Tablets are an Ayurvedic proprietary product formulated to provide soothing support for mouth ulcers, healing, and help maintain - available in a natural flavour.",
    benefits: [
      "Mouth ulcer soothing – faster healing",
      "Provides soothing support for mouth ulcers and faster healing",
      "Morning After Care: Provides support as part of morning-after care.",
      "Appetiser Support: Supports appetite.",
      "Oral Hygiene: Supports overall oral hygiene and oral care.",
    ],
  },
  {
    id: slugify("bioceutical", "chf-bio-active-hair-fluid"),
    formula: "CHF Bio-Active Hair Fluid",
    image: bioProductImage("Bioceuticals", "CHF Bio-Active Hair Fluid"),
    description:
      "CHF Hair Fluid is a non-oily and non-greasy hair fluid designed to help control hair fall and hair loss. It helps keep the scalp cool, supports blood circulation to the scalp, and helps strengthen hair roots. CHF Hair Fluid is indicated for hair fall, hair loss, chemo/radiation therapies, faster regeneration of lost hair, and to cool the scalp. Regular usage is recommended for optimal support.",
    benefits: [
      "Non Oily: Non-oily hair fluid for scalp application.",
      "Non Greasy: Non-greasy formulation for comfortable scalp use.",
      "Scalp Cooling: Helps keep the scalp cool.",
      "Blood Circulation: Improves blood circulation to the scalp.",
      "Strengthens Hair Roots: Helps strengthen hair roots.",
      "Hair Fall Control: Helps stop hair fall.",
      "Hair Loss Support: Helps stop hair loss.",
      "Hair Regeneration: Helps faster regeneration of lost hair.",
    ],
  },
  {
    id: slugify("bioceutical", "orishh-bio-active-oral-spray"),
    formula: "Orishh Bio-Active Oral Spray",
    image: bioProductImage("Bioceuticals", "Orishh Bio-Active Oral Spray"),
    description:
      "ORISHH Oral Spray is a sugar-free, tooth-friendly functional food designed to support oral health and hygiene. It helps hydrate and lubricate the oral cavity while providing comfort to sensitive areas of the mouth. ORISHH Oral Spray is helpful in dry mouth, pain or discomfort in the oral cavity, after dental procedures, mouth and denture ulcers, mucositis, halitosis, prevention and breaking of biofilm, and overall oral health and hygiene.",
    benefits: [
      "Hydration & Lubrication: Hydrates and lubricates the oral cavity for lasting comfort.",
      "Oral Mucosal Health: Supports oral mucosal health and helps reinforce the natural defenses of the oral mucosa.",
      "Soothing Support: Soothes sensitive areas of the mouth and supports comfort in cases of oral discomfort.",
      "Oral Hygiene: Promotes a clean and hygienic oral environment.",
      "Halitosis Support: Supports halitosis management and oral freshness.",
      "Biofilm Management: Supports prevention and breaking of biofilm and helps maintain overall oral health and hygiene.",
    ],
  },
  {
    id: slugify("bioceutical", "savfeet-foot-leg-pain-cream"),
    formula: "SavFeet Foot & Leg Pain Cream",
    image: bioProductImage("Bioceuticals", "SavFeet Foot & Leg Pain Cream"),
    description:
      "SavFeet Pain Cream is designed for the complete care of feet and legs. It helps soothe, soften and heal the skin while providing intense moisturisation, comfort and relaxation. SavFeet Pain Cream is indicated for fatigued and sore feet, burning feet syndrome, fissures in heels, dry itchy allergic skin conditions, foot complications in diabetics / peripheral neuropathy, and skin manifestations in chemo / radiation therapies.",
    benefits: [
      "Anti-inflammatory & Analgesic: Provides anti-inflammatory and analgesic support for fatigued and sore feet.",
      "Intense Moisturisation: Provides intense moisturisation and helps soothe, soften and heal dry skin.",
      "Anti-itch & Anti-allergic: Supports care of dry, itchy and allergic skin conditions.",
      "Antifungal & Antimicrobial: Provides antifungal and antimicrobial support for overall foot and leg care.",
      "Blood Circulation: Helps improve blood circulation.",
      "Muscle Relaxation: Warms and relaxes muscles while providing comfort.",
      "Stress Relief: Helps relieve stress and promotes relaxation.",
      "Foot & Leg Care: Helps protect and care for feet and legs as part of complete foot care.",
    ],
  },
  {
    id: slugify("bioceutical", "numbnil-fast-acting-pain-relief-gel"),
    formula: "Numbnil Fast-Acting Pain Relief Gel",
    image: bioProductImage("Bioceuticals", "Numbnil Fast-Acting Pain Relief Gel"),
    description:
      "Numbnil® Gel is an Ayurvedic Proprietary Medicine scientifically formulated to offer neuroprotective action and targeted relief from nerve discomfort. It is specifically indicated for managing discomfort associated with diabetic peripheral neuropathy, numbness and nerve pain, and burning feet syndrome. The formulation also helps moisturize and soothe the skin while supporting topical absorption. Numbnil® Gel is designed to provide targeted pain relief, neuroprotective support, enhanced circulation, and skin care benefits for the affected areas.",
    benefits: [
      "Targeted Pain Relief: Active compounds like Piperlonguminine help inhibit pain-generating enzymes to reduce nerve discomfort.",
      "Neuroprotection: Formulated with actives like Withaferin A to help safeguard neurons from further damage.",
      "Enhanced Circulation: Helps improve blood flow to the affected area, aiding nutrient delivery and toxin removal.",
      "Skin Care Benefits: Deeply moisturizes and soothes the skin while improving topical absorption.",
      "Nerve Discomfort Support: Provides targeted support for numbness and nerve discomfort associated with diabetic peripheral neuropathy.",
      "Burning Feet Support: Helps provide targeted relief and soothing comfort for burning feet syndrome.",
    ],
  },
  {
    id: slugify("bioceutical", "ecsori-barrier-repair-lotion"),
    formula: "ECSORI Barrier Repair Lotion",
    image: bioProductImage("Bioceuticals", "ECSORI Barrier Repair Lotion"),
    description:
      "ECSORI Moisturizing Lotion is a specialized, non-greasy formula designed to provide soothing, softening, and moisturizing care for compromised skin. ECSORI combines multi-action therapeutic properties with a deep-penetrating, non-irritating base to support the skin barrier and provide comprehensive skin care. It is formulated for palliative care in conditions including eczema and psoriasis, radiation dermatitis, dry and itchy skin, allergic dermatitis, and prickly heat.",
    benefits: [
      "Anti-Pruritic & Anti-Allergic: Provides fast-acting relief from itching and helps break the itch-scratch cycle.",
      "Anti-Inflammatory: Helps reduce redness, swelling, and localized skin irritation.",
      "Keratolytic Action: Gently softens and helps shed rough, scaly, or hyperkeratotic skin layers.",
      "Antimicrobial Protection: Helps guard compromised skin against secondary microbial complications.",
      "Intense Moisturization: Deeply hydrates the skin without leaving a heavy or sticky residue.",
      "Skin Barrier Support: Provides comprehensive support for the skin barrier with a non-irritating and non-greasy formulation.",
    ],
  },
  {
    id: slugify("bioceutical", "heiler-antimicrobial-wound-cream"),
    formula: "Heiler Antimicrobial Wound Cream",
    image: bioProductImage("Bioceuticals", "Heiler Antimicrobial Wound Cream"),
    description:
      "Heiler Cream is a topical formulation designed for skin and wound-care applications. It is intended for use in conditions including burns, scalds, radiation burns, bruises, cuts, wounds, abrasions, infections, impetigo and facial blemishes. Heiler Cream can also be used as part of combination therapy with Heal O Sorb Sterile Powder for the management of pressure sores, diabetic foot ulcers, malignant ulcers and chronic non-healing ulcers of various aetiologies.",
    benefits: [
      "Burn & Scald Care: Used for burns, scalds and radiation burns as part of topical wound and skin care.",
      "Wound Care: Supports the care of bruises, cuts, wounds and abrasions.",
      "Skin & Infection Care: Used for skin conditions including infections, impetigo and facial blemishes.",
      "Chronic Wound Therapy: Can be used in combination with Heal O Sorb Sterile Powder for chronic non-healing ulcers.",
      "Pressure Sore Care: Combination therapy is used for pressure sores and associated wound-care applications.",
      "Diabetic & Malignant Ulcers: Combination therapy with Heal O Sorb Sterile Powder is indicated for diabetic foot ulcers and malignant ulcers.",
    ],
  },
];

export const categories: FormulaCategory[] = [
  {
    name: "Bioceutical Formulations",
    categoryImage: bioceuticalProducts[0].image,
    formulas: bioceuticalProducts,
  },
];
