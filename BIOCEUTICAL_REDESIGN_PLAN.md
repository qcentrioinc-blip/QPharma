# Bioceutical Product Image Redesign Plan

## Overview
Redesign all 9 Bioceutical product images as **AI-generated 3D product renders** with **VitalCore logo integrated on packaging**, maintaining **864×1152** dimensions, for a more **eye-catching and corporate style** matching the **Herbaceutical category quality** (high-detail 3D renders with product-relevant backgrounds).

---

## Current State Analysis

### Bioceutical Products (9 items) - Current: Simple/low-quality (~17-45KB)
| Product | Current File | Size | Packaging Type |
|---------|-------------|------|----------------|
| BoooN Oral Drops & Syrup | `BoooN Oral Drops & Syrup.webp` | 43KB | Amber glass dropper bottle (30ml) |
| S A P Bio-Barrier Nasal Cream | `S A P Bio-Barrier Nasal Cream.webp` | 27KB | Aluminum laminate tube (15g) |
| Vanmul Chewable Immune Tablets | `Vanmul Chewable Immune Tablets.webp` | 36KB | White HDPE tablet bottle (60ct) |
| CHF Bio-Active Hair Fluid | `CHF Bio-Active Hair Fluid.webp` | 22KB | Clear glass serum bottle + dropper (50ml) |
| Orishh Bio-Active Oral Spray | `Orishh Bio-Active Oral Spray.webp` | 45KB | White airless pump spray (20ml) |
| SavFeet Foot & Leg Pain Cream | `SavFeet Foot & Leg Pain Cream.webp` | 34KB | Soft-touch plastic tube (50g) |
| Numbnil Fast-Acting Pain Relief Gel | `Numbnil Fast-Acting Pain Relief Gel.webp` | 17KB | Aluminum laminate gel tube (30g) |
| ECSORI Barrier Repair Lotion | `ECSORI Barrier Repair Lotion.webp` | 19KB | White PET bottle + pump (200ml) |
| Heiler Antimicrobial Wound Cream | `Heiler Antimicrobial Wound Cream.webp` | 18KB | Medical tube + tamper seal (20g) |

### Herbaceutical Reference (Target Quality) - High-detail 3D renders (~137-196KB)
- **Style**: Premium 3D product photography, photorealistic materials
- **Backgrounds**: Product-relevant botanical/ingredient scenes, not solid colors
- **Lighting**: Professional studio with HDRI environment reflections
- **Composition**: 3/4 hero angle, centered, slight elevation
- **Details**: Caustics in glass, subsurface scattering in liquids, foil stamping, embossing

### VitalCore Brand Assets (Optimized for Packaging)
| Asset | File | Use Case |
|-------|------|----------|
| **Full Logo (with tagline)** | `/public/brand/vitalcore-logo-clear.png` / `.svg` | Large surfaces only (hero banners, not packaging) |
| **Wordmark Only (V icon + "VitalCore", NO tagline)** | `/public/brand/vitalcore-wordmark.svg` | **Bottle labels** - primary packaging logo |
| **Wordmark Teal** | `/public/brand/vitalcore-wordmark-teal.svg` | Foil stamping on light labels |
| **Wordmark White** | `/public/brand/vitalcore-wordmark-white.svg` | Foil stamping on dark/teal labels |
| **Icon Only (V mark)** | `/public/brand/vitalcore-icon.svg` | **Tubes, caps, small areas** |
| **Icon Teal** | `/public/brand/vitalcore-icon-teal.svg` | Foil on tubes |
| **Icon White** | `/public/brand/vitalcore-icon-white.svg` | Foil on dark tubes |

**Brand Colors**: Teal `#128A82`, Green `#27AB89` - matches Bioceutical theme `#1E5D57`

> ⚠️ **Critical**: Do NOT use the full logo with "made for health" tagline on packaging - it becomes illegible at small sizes. Use **wordmark** (bottles) or **icon only** (tubes).

---

## Redesign Specification

### Visual Style Guide (Matching Herbaceutical Quality)

#### 1. **Overall Aesthetic**
- **Style**: Premium 3D product renders - matching Herbaceutical detail level
- **Mood**: Clinical, trustworthy, scientific, premium
- **Consistency**: Shared lighting rig, camera, render settings across all 9

#### 2. **Background & Environment - PRODUCT-SPECIFIC**
Each product gets a **relevant ingredient/botanical background** (not solid gradient):

| Product | Background Concept | Key Visual Elements |
|---------|-------------------|---------------------|
| **BoooN Oral Drops** | **Oral mucosa / honey-ginger environment** | Shunthi (ginger) root, Tulsi leaves, Haridra (turmeric) powder, thyme sprigs, honey drizzle - warm amber tones |
| **SAP Nasal Cream** | **Airborne barrier / clean air concept** | PM2.5 particles blocked by shield visualization, eucalyptus leaves, mint, clean blue-white air gradients |
| **Vanmul Tablets** | **Immune botanicals** | Astragalus root, Aronia berries, Maitake mushroom, Holy Basil leaves - gold/teal immune palette |
| **CHF Hair Fluid** | **Scalp / hair follicle microenvironment** | Hair strands, follicle cross-section viz, rosemary, nettle, peppermint leaves - mint green/teal |
| **Orishh Oral Spray** | **Oral microbiome / fresh breath** | Xylitol crystals, clove buds, mint leaves, saliva droplets - clean white/mint/teal |
| **SavFeet Cream** | **Foot care / skin barrier** | Cracked heel texture healing, shea butter, camphor crystals, tea tree, lavender - warm terracotta/teal |
| **Numbnil Gel** | **Nerve / cooling relief** | Neural pathway visualization, ashwagandha root, peppermint, ice crystals - cool blue/teal |
| **ECSORI Lotion** | **Skin barrier repair / lipid bilayer** | Ceramide structure, oat colloidal, ceramides, shea - soothing lavender/teal |
| **Heiler Cream** | **Wound healing / tissue regeneration** | Calendula, gotu kola, honey, aloe vera gel - medical white/teal/red cross accent |

#### 3. **Lighting Setup (Consistent Across All)**
- **Key Light**: Large softbox 45° upper-left, 4000K
- **Fill Light**: Opposite side, 50% intensity, large source
- **Rim Light**: Subtle warm/cool kicker from behind for edge separation
- **HDRI Environment**: Matches background concept for realistic reflections
- **Global Illumination**: Enabled for subsurface scattering in liquids/creams

#### 4. **Camera & Composition**
- **Angle**: 3/4 hero view (15° elevation, 30° rotation)
- **Focal Length**: 85-100mm equivalent
- **Frame**: Product centered, 15% padding, rule of thirds
- **Depth of Field**: f/8-f/11 (product sharp, background softly contextual)

#### 5. **Material & Texture Standards**
| Packaging Type | Material Treatment |
|---------------|-------------------|
| Glass bottles | Clear glass IOR 1.52, dispersion, caustics, liquid fill with meniscus |
| Plastic bottles | Matte/satin PET/HDPE, subtle SSS, induction seal detail |
| Tubes (cream/gel) | Aluminum laminate or soft-touch PP, crimped end, cap threads |
| Airless pumps | Actuator mechanism visible, dip tube, vacuum metallization |
| Caps/Closures | Material-matched (PP, aluminum, rubber dropper bulbs) |
| **Labels** | **VitalCore logo integrated** - see below |

#### 6. **Color Coordination**
Each render uses the Bioceutical theme teal (`#1E5D57`) as primary brand color, with product-specific secondary palette (see background concepts).

---

## VitalCore Logo Integration - ON PACKAGING (Using Optimized Variants)

### Logo Variants to Use
| Variant | File | Color | Background |
|---------|------|-------|------------|
| **Wordmark** | `vitalcore-wordmark-teal.svg` | Teal `#128A82` | Light/white labels |
| **Wordmark** | `vitalcore-wordmark-white.svg` | White | Dark/teal labels |
| **Icon Only** | `vitalcore-icon-teal.svg` | Teal `#128A82` | Light tube laminate |
| **Icon Only** | `vitalcore-icon-white.svg` | White | Dark tube laminate |

### Placement by Packaging Type

#### Glass/Plastic Bottles (BoooN, Vanmul, CHF, ECSORI):
- **Location**: Front label, upper 1/3 (below product name space)
- **Size**: ~18% of label width
- **Treatment**: **Teal foil-stamped** (`#128A82`) on matte white label using **Wordmark Teal** variant
- **Detail**: Micro-embossed "V" icon repeat pattern as label texture

#### Airless Pump Spray (Orishh):
- **Location**: Front label panel, centered upper
- **Size**: ~20% of label width
- **Treatment**: **White foil on teal label** (reverse) using **Wordmark White** variant

#### Tubes - Cream/Gel (SAP, SavFeet, Numbnil, Heiler):
- **Location**: Tube body, upper third (above product name)
- **Size**: ~25% of tube circumference
- **Treatment**: **Printed directly on laminate** - follows tube curvature
  - SAP/Numbnil/Heiler: **Icon Teal** foil (`#128A82`)
  - SavFeet: **Icon White** with terracotta outline

---

## Technical Specifications

### Output Requirements
- **Format**: WebP (near-lossless, quality 90-95)
- **Dimensions**: **864 × 1152** (exact match - 3:4 portrait)
- **Color Space**: sRGB
- **Bit Depth**: 8-bit/channel
- **Target File Size**: **120-180 KB** (matching Herbaceutical range)
- **Compression**: Optimized for web, no visible artifacts

### Naming Convention (EXACT - Case Sensitive)
```
BoooN Oral Drops & Syrup.webp
S A P Bio-Barrier Nasal Cream.webp
Vanmul Chewable Immune Tablets.webp
CHF Bio-Active Hair Fluid.webp
Orishh Bio-Active Oral Spray.webp
SavFeet Foot & Leg Pain Cream.webp
Numbnil Fast-Acting Pain Relief Gel.webp
ECSORI Barrier Repair Lotion.webp
Heiler Antimicrobial Wound Cream.webp
```

### File Location
```
/public/product-images/Bioceutical/
```

---

## AI Generation Prompts (Optimized for Midjourney v6 / DALL-E 3 / SDXL)

### Universal Parameters
```
--ar 3:4 --v 6.0 --style raw --quality 2 --stylize 250
```
*For SDXL: 864x1152, 30-40 steps, CFG 7-8, DPM++ 2M Karras*

---

### Per-Product Prompts

#### 1. BoooN Oral Drops & Syrup
```
Professional 3D product render of 30ml amber glass dropper bottle with white tamper-evident cap and glass pipette, 
golden liquid visible with subtle meniscus, 
**VitalCore wordmark (V icon + "VitalCore" text only, NO tagline) teal foil-stamped on matte white front label**, 
background: warm macro scene with fresh ginger root (Shunthi) slices, Tulsi (holy basil) leaves, turmeric powder (Haridra) dusting, thyme sprigs, honey drizzle on wooden surface, 
studio lighting with HDRI reflections in glass, caustics on surface, 
85mm lens, 3/4 hero angle, photorealistic, octane render, 8k, 
clinical nutraceutical aesthetic, warm amber-teal palette --ar 3:4 --v 6.0 --style raw --quality 2
```

#### 2. S A P Bio-Barrier Nasal Cream
```
Professional 3D product render of 15g white aluminum laminate nasal tube with teal flip-top cap, crimped end detail, 
**VitalCore icon only (V mark) printed in teal foil on tube body following curvature**, 
background: clean air visualization - microscopic PM2.5 particles hitting invisible shield barrier, eucalyptus leaves, fresh mint sprigs, soft blue-white gradient atmosphere, 
studio lighting, HDRI environment reflections on laminate, 
85mm lens, 3/4 hero angle, photorealistic, octane render, 8k, 
medical device aesthetic, clean blue-teal-white palette --ar 3:4 --v 6.0 --style raw --quality 2
```

#### 3. Vanmul Chewable Immune Tablets
```
Professional 3D product render of 60-count white HDPE tablet bottle with teal child-resistant cap, induction seal visible under cap, 
**VitalCore wordmark (V icon + "VitalCore" text only, NO tagline) teal foil-stamped on front label with gold immune accent bar**, 
background: immune botanical arrangement - astragalus root slices, aronia berries (dark purple), maitake mushroom fronds, holy basil leaves, golden turmeric powder, 
studio lighting, subtle SSS on HDPE, seal detail, 
85mm lens, 3/4 hero angle, photorealistic, octane render, 8k, 
supplement bottle aesthetic, gold-teal-white palette --ar 3:4 --v 6.0 --style raw --quality 2
```

#### 4. CHF Bio-Active Hair Fluid
```
Professional 3D product render of 50ml clear glass serum bottle with glass dropper assembly, light amber fluid visible, 
**VitalCore wordmark (V icon + "VitalCore" text only, NO tagline) teal foil on minimalist white label with mint green accent line**, 
background: scalp microenvironment - hair strands with follicular cross-section visualization, rosemary needles, nettle leaves, peppermint leaves, water droplets, 
studio lighting, complex caustics through glass/liquid, dispersion, 
85mm lens, 3/4 hero angle, photorealistic, octane render, 8k, 
trichological premium aesthetic, mint-teal-amber palette --ar 3:4 --v 6.0 --style raw --quality 2
```

#### 5. Orishh Bio-Active Oral Spray
```
Professional 3D product render of 20ml white airless pump spray bottle with teal actuator, clear side window showing liquid, 
**VitalCore wordmark (V icon + "VitalCore" text only, NO tagline) white foil on teal label panel**, 
background: oral freshness - xylitol crystals sparkling, whole clove buds, fresh mint leaves, saliva droplets on clean surface, 
studio lighting, pump mechanism detail, airless vacuum metallization, 
85mm lens, 3/4 hero angle, photorealistic, octane render, 8k, 
oral care clinical aesthetic, white-mint-teal palette --ar 3:4 --v 6.0 --style raw --quality 2
```

#### 6. SavFeet Foot & Leg Pain Cream
```
Professional 3D product render of 50g soft-touch plastic cream tube with teal screw cap, 
**VitalCore icon only (V mark) printed in white with terracotta outline on tube body**, 
background: foot care ritual - shea butter chunks, camphor crystals, tea tree leaves, lavender sprigs, healing cracked heel texture visualization, warm terracotta sand, 
studio lighting, soft-touch material SSS, cap thread detail, 
85mm lens, 3/4 hero angle, photorealistic, octane render, 8k, 
dermatological cream aesthetic, terracotta-teal-warm white palette --ar 3:4 --v 6.0 --style raw --quality 2
```

#### 7. Numbnil Fast-Acting Pain Relief Gel
```
Professional 3D product render of 30g aluminum laminate gel tube with teal flip cap, 
**VitalCore icon only (V mark) printed in ice-blue foil on tube**, 
background: cooling relief - neural pathway visualization (subtle blue lines), ashwagandha root, peppermint leaves, ice crystals forming, menthol vapor wisps, 
studio lighting, laminate texture, flip-cap hinge detail, 
85mm lens, 3/4 hero angle, photorealistic, octane render, 8k, 
clinical gel aesthetic, ice blue-teal-white palette --ar 3:4 --v 6.0 --style raw --quality 2
```

#### 8. ECSORI Barrier Repair Lotion
```
Professional 3D product render of 200ml white PET lotion bottle with teal pump dispenser, 
**VitalCore wordmark (V icon + "VitalCore" text only, NO tagline) teal foil on label with lavender accent band**, 
background: skin barrier science - ceramide lipid bilayer visualization, colloidal oat particles, shea butter, ceramides molecular structure, 
studio lighting, pump mechanism detail, PET clarity with SSS, 
85mm lens, 3/4 hero angle, photorealistic, octane render, 8k, 
dermaceutical lotion aesthetic, lavender-teal-soft white palette --ar 3:4 --v 6.0 --style raw --quality 2
```

#### 9. Heiler Antimicrobial Wound Cream
```
Professional 3D product render of 20g medical laminate tube with teal cap and tamper-evident seal ring, 
**VitalCore icon only (V mark) teal foil with subtle red cross accent**, 
background: wound healing botanicals - calendula flowers, gotu kola leaves, manuka honey drizzle, aloe vera gel cross-section, sterile gauze texture, 
studio lighting, tamper seal detail, medical laminate texture, 
85mm lens, 3/4 hero angle, photorealistic, octane render, 8k, 
wound care medical aesthetic, white-teal-medical red accent palette --ar 3:4 --v 6.0 --style raw --quality 2
```

---

## Implementation Checklist

### Phase 1: Image Generation (You)
- [ ] Generate **2 sample images first** (recommend: BoooN + SAP as they represent bottle + tube)
- [ ] Review samples for: quality, logo integration, background relevance, consistency
- [ ] Generate remaining 7 images using approved style
- [ ] Export all 9 as **WebP, 864×1152, 120-180KB**
- [ ] Name files **exactly** as specified above

### Phase 2: Asset Replacement (Me)
- [ ] Backup current `/public/product-images/Bioceutical/`
- [ ] Replace with new renders (exact filenames)
- [ ] Verify all 9 load correctly

### Phase 3: Testing & QA (Me)
- [ ] Test FormulaCatalog: grid cards, hover slideshow cycle
- [ ] Test FormulaProductModal: gallery, zoom, navigation
- [ ] Verify responsive: mobile, tablet, desktop
- [ ] Check loading: lazy/priority, no layout shift
- [ ] Validate accessibility: alt text, contrast

### Phase 4: Documentation (Me)
- [ ] Update image manifest if needed
- [ ] Document new asset specs for future Herbaceutical redesign

---

## Sample Generation Priority

**Start with these 2 (covers both packaging types):**
1. **BoooN Oral Drops & Syrup** - Glass dropper bottle + liquid + botanical background
2. **S A P Bio-Barrier Nasal Cream** - Aluminum tube + printed logo + barrier background

**Then batch the rest:**
3. Vanmul Tablets (HDPE bottle)
4. CHF Hair Fluid (Glass serum + dropper)
5. Orishh Oral Spray (Airless pump)
6. SavFeet Cream (Soft-touch tube)
7. Numbnil Gel (Laminate tube + flip cap)
8. ECSORI Lotion (PET bottle + pump)
9. Heiler Cream (Medical tube + tamper seal)

---

## Success Criteria

1. **Visual Parity**: Match Herbaceutical render quality (120-180KB, detailed backgrounds)
2. **Brand Consistency**: VitalCore logo correctly integrated on every package type
3. **Product Relevance**: Each background tells the product's ingredient/benefit story
4. **Technical**: 864×1152 WebP, no layout shift, fast loading
5. **Functional**: All existing interactions work (hover cycle, modal gallery)

---

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Sample Generation (2 images) | 30-60 min |
| Review & Adjust | 15 min |
| Full Generation (7 more) | 60-90 min |
| Integration & Testing | 30-60 min |
| **Total** | **2.5-4 hours** |

---

## Next Steps

1. **You generate 2 samples** (BoooN + SAP) using prompts above
2. **Share the files** - I'll integrate and test
3. **We review** - Adjust prompts if needed
4. **You generate remaining 7** - I'll batch integrate
5. **Final QA** - Live verification

---

*Document Version: 2.0*  
*Updated: 2026-11-05*  
*Key Change: Product-specific botanical backgrounds (not teal gradient), Herbaceutical-quality targets*