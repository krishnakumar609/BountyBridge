---
name: Artisanal Web3 Marketplace
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444842'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#747871'
  outline-variant: '#c4c8bf'
  surface-tint: '#52634f'
  primary: '#50604d'
  on-primary: '#ffffff'
  primary-container: '#687965'
  on-primary-container: '#f7fff1'
  inverse-primary: '#baccb4'
  secondary: '#665d51'
  on-secondary: '#ffffff'
  secondary-container: '#ebdece'
  on-secondary-container: '#6b6155'
  tertiary: '#4a6244'
  on-tertiary: '#ffffff'
  tertiary-container: '#627b5b'
  on-tertiary-container: '#f8fff0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e8cf'
  primary-fixed-dim: '#baccb4'
  on-primary-fixed: '#111f10'
  on-primary-fixed-variant: '#3b4b39'
  secondary-fixed: '#eee0d1'
  secondary-fixed-dim: '#d1c5b6'
  on-secondary-fixed: '#211b11'
  on-secondary-fixed-variant: '#4e453a'
  tertiary-fixed: '#ceebc4'
  tertiary-fixed-dim: '#b3cea9'
  on-tertiary-fixed: '#0a2008'
  on-tertiary-fixed-variant: '#354d30'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin: 32px
  container-max: 1280px
---

## Brand & Style
The design system embodies a "Digital Craft" philosophy, merging the high-performance utility of developer tools like Linear and GitHub with the organic, warm aesthetic of a premium lifestyle brand. It targets professional builders and high-value bounty hunters within the Stellar ecosystem who value precision but prefer an environment that feels human and curated rather than cold and industrial.

The visual style is **Handcrafted Minimalism**. It utilizes a "Paper-on-Stone" layering technique, where creamy, tactile surfaces sit atop warm, solid foundations. The interface avoids artificial neon glows and aggressive tech-bro aesthetics in favor of soft shadows, natural textures, and a sophisticated, muted palette that evokes reliability and timelessness.

## Colors
The palette is grounded in earth-toned neutrals to create a sense of calm and stability. 
- **Primary Background (#FDF6ED):** A warm cream that reduces eye strain and provides a premium, "stationery" feel.
- **Primary Action (#778873):** "Dark Moss" serves as the anchor for all high-intent actions, providing enough contrast for accessibility while maintaining an organic tone.
- **Secondary Action (#A1BC98):** Used for hover states, progress bars, and subtle highlights.
- **Neutral (#2D2D2D):** A soft charcoal used for text and iconography to ensure deep legibility without the harshness of pure black.

## Typography
While the system primarily uses **Plus Jakarta Sans** for its refined, modern clarity and excellent legibility in complex dashboards, it relies on a specific "Script Accent" for brand expression. 

- **Primary Headings:** Use Plus Jakarta Sans with tighter tracking and heavier weights for a professional, Linear-like feel.
- **Accents:** Key marketing moments or "hand-signed" elements (like a founder's note or featured bounty tag) should use a handcrafted script style (e.g., Pacifico) sparingly to maintain the "bespoke" feel.
- **Dashboard Data:** Ensure body-sm and labels use generous line-heights to manage information density, reflecting the organized nature of Notion.

## Layout & Spacing
The design system uses a **Fixed Grid** philosophy for desktop to maintain a sense of "centered focus" and "containment," similar to a well-organized document.

- **Desktop (1280px+):** 12-column grid with 24px gutters. Content is centered with wide "breathing room" margins.
- **Tablet:** 8-column grid with 24px margins. Use a modular stack approach where dashboard sidebars collapse into a drawer.
- **Mobile:** 4-column grid with 16px margins.
- **Spacing Rhythm:** Based on a 4px scale. Use 16px (md) for most internal component padding and 40px (xl) for section separation to maintain the minimalist, airy feel.

## Elevation & Depth
This design system rejects heavy blurs and harsh shadows in favor of **Tonal Layering** and **Soft Ambient Occlusion**.

- **Level 0 (Surface):** The Secondary Background (#DCCFC0) acts as the "Floor."
- **Level 1 (Cards):** The Primary Background (#FDF6ED) creates "Paper" surfaces. These are defined by a 1px border of #E8DFD5 and a very soft, high-diffusion shadow (0px 4px 20px rgba(45, 45, 45, 0.04)).
- **Level 2 (Interactive/Floating):** Modals and dropdowns use the same cream background but with a more pronounced, "lifted" shadow (0px 12px 32px rgba(45, 45, 45, 0.08)) to indicate priority.
- **Depth Cues:** Depth is also communicated through "pressed" states, where buttons slightly darken or shift color rather than sinking, maintaining the physical tactile feel.

## Shapes
The shape language is consistently **Rounded**, avoiding sharp institutional corners.
- **Buttons & Inputs:** Use the standard 0.5rem (8px) radius to feel approachable.
- **Cards & Containers:** Use `rounded-lg` (1rem/16px) to frame content elegantly.
- **Featured Bounties/Badges:** Use `rounded-xl` (1.5rem/24px) for a softer, more organic silhouette.
- **Iconography:** Icons should feature rounded caps and corners (minimum 1.5px stroke weight) to match the typography's softness.

## Components
- **Buttons:**
    - **Primary:** Dark Moss (#778873) background with Cream (#FDF6ED) text. No heavy gradients; flat color with a subtle 1px top-border highlight.
    - **Secondary:** Transparent background with a 1.5px stroke of Warm Stone (#DCCFC0).
- **Cards (Bounty Cards):** Cream background, subtle border, and 16px padding. Titles use Headline-sm. Metadata (Reward, Time) uses Label-sm with Sage Green icons.
- **Inputs:** Soft Stone (#F5EEE4) fill, 1px border. Focus state moves the border color to Dark Moss and adds a 2px outer ring in Sage Green at 20% opacity.
- **Chips/Status Tags:**
    - **Success:** Dark Moss text on a 10% opacity Dark Moss background.
    - **Open Bounties:** Neutral text on a 10% opacity Stone background.
- **Lists:** Clean, horizontal rows separated by 1px Warm Stone lines. High whitespace between items (12px top/bottom padding) to ensure a "premium gallery" feel.
- **Featured Component (Trust Seal):** A small, circular badge with the script accent font, used to verify high-reputation builders or "Stellar Verified" bounties.