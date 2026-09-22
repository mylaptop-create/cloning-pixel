import fs from 'fs';
import path from 'path';
import { DesignTokens } from '../../shared/types.js';

export const WISE_TOKENS_CSS = `/* Wise Design System Tokens (Light & Dark Modes) */
:root {
  /* Colors - Light Mode */
  --colors-primary: #163300;
  --colors-accent: #9FE870;
  --colors-accent-hover: #80E142;
  --colors-accent-pressed: #65CF21;
  --colors-ink: #0E0F0C;
  --colors-body: #454745;
  --colors-muted: #6A6C6A;
  --colors-canvas: #FFFFFF;
  --colors-surface: #FFFFFF;
  --colors-surface-alt: #F1F1ED;
  --colors-surface-tint: #E2F6D5;
  --colors-border: rgba(14, 15, 12, 0.12157);
  --colors-border-strong: #CACFC7;
  --colors-link: #163300;
  --colors-success: #054D28;
  --colors-warning: #FFD11A;
  --colors-error: #CB272F;
  --colors-bright-green: #9FE870;
  --colors-forest-green: #163300;
  --colors-forest-green-hover: #0D1F00;
  --colors-forest-green-pressed: #0E0F0C;
  --colors-bright-blue: #A0E1E1;
  --colors-bright-yellow: #FFEB69;
  --colors-bright-orange: #FFC091;
  --colors-bright-pink: #FFD7EF;
  --colors-dark-charcoal: #21231D;
  --colors-celebration-bg: #ECF9F9;
  --colors-celebration-text: #0B4C72;
  --colors-on-primary: #FFFFFF;
  --colors-on-accent: #163300;
  --colors-on-dark: #9FE870;

  /* Typography */
  --typography-display-font: "Wise Sans", "Inter", sans-serif;
  --typography-body-font: "Inter", Helvetica, Arial, sans-serif;

  /* Radii */
  --rounded-sm: 10px;
  --rounded-md: 16px;
  --rounded-lg: 24px;
  --rounded-xl: 32px;
  --rounded-pill: 9999px;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 56px;
  --spacing-section: 96px;
}

.dark {
  /* Colors - Dark Mode */
  --colors-primary: #9FE870;
  --colors-accent: #9FE870;
  --colors-accent-hover: #80E142;
  --colors-accent-pressed: #65CF21;
  --colors-ink: #EDEDED;
  --colors-body: #B0B3B0;
  --colors-muted: #888A88;
  --colors-canvas: #0E0F0C;
  --colors-surface: #161815;
  --colors-surface-alt: #21231D;
  --colors-surface-tint: #163300;
  --colors-border: rgba(255, 255, 255, 0.15);
  --colors-border-strong: #454745;
  --colors-link: #9FE870;
  --colors-success: #2EAD4B;
  --colors-warning: #FFD11A;
  --colors-error: #D03238;
  --colors-celebration-bg: #162C38;
  --colors-celebration-text: #A0E1E1;
  --colors-on-primary: #0E0F0C;
  --colors-on-accent: #163300;
  --colors-on-dark: #9FE870;
}
`;

export const WISE_TOKENS_JSON = {
  version: 'alpha',
  name: 'Wise',
  slug: 'wise',
  source: 'https://wise.com/',
  colors: {
    primary: '#163300',
    accent: '#9FE870',
    accentHover: '#80E142',
    accentPressed: '#65CF21',
    ink: '#0E0F0C',
    body: '#454745',
    muted: '#6A6C6A',
    canvas: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F1ED',
    surfaceTint: '#E2F6D5',
    border: 'rgba(14,15,12,0.12157)',
    borderStrong: '#CACFC7',
    link: '#163300',
    success: '#054D28',
    warning: '#FFD11A',
    error: '#CB272F',
    brightGreen: '#9FE870',
    forestGreen: '#163300',
    forestGreenHover: '#0D1F00',
    forestGreenPressed: '#0E0F0C',
    brightBlue: '#A0E1E1',
    brightYellow: '#FFEB69',
    brightOrange: '#FFC091',
    brightPink: '#FFD7EF',
    darkCharcoal: '#21231D',
    celebrationBg: '#ECF9F9',
    celebrationText: '#0B4C72',
    onPrimary: '#FFFFFF',
    onAccent: '#163300',
    onDark: '#9FE870'
  },
  darkModeColors: {
    primary: '#9FE870',
    accent: '#9FE870',
    accentHover: '#80E142',
    accentPressed: '#65CF21',
    ink: '#EDEDED',
    body: '#B0B3B0',
    muted: '#888A88',
    canvas: '#0E0F0C',
    surface: '#161815',
    surfaceAlt: '#21231D',
    surfaceTint: '#163300',
    border: 'rgba(255,255,255,0.15)',
    borderStrong: '#454745',
    link: '#9FE870',
    success: '#2EAD4B',
    warning: '#FFD11A',
    error: '#D03238',
    celebrationBg: '#162C38',
    celebrationText: '#A0E1E1',
    onPrimary: '#0E0F0C',
    onAccent: '#163300',
    onDark: '#9FE870'
  },
  typography: {
    display: { fontFamily: '"Wise Sans", "Inter", sans-serif', fontSize: '64px', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.04em' },
    hero: { fontFamily: '"Wise Sans", "Inter", sans-serif', fontSize: '56px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.04em' },
    headlineLg: { fontFamily: '"Wise Sans", "Inter", sans-serif', fontSize: '40px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em' },
    titleLg: { fontFamily: '"Wise Sans", "Inter", sans-serif', fontSize: '32px', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.025em' },
    titleMd: { fontFamily: '"Wise Sans", "Inter", sans-serif', fontSize: '24px', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.015em' },
    titleSm: { fontFamily: '"Wise Sans", "Inter", sans-serif', fontSize: '20px', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' },
    bodyLg: { fontFamily: '"Inter", Helvetica, Arial, sans-serif', fontSize: '18px', fontWeight: 400, lineHeight: 1.55, letterSpacing: '0em' },
    body: { fontFamily: '"Inter", Helvetica, Arial, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0em' },
    label: { fontFamily: '"Inter", Helvetica, Arial, sans-serif', fontSize: '14px', fontWeight: 600, lineHeight: 1.4, letterSpacing: '0em' },
    button: { fontFamily: '"Inter", Helvetica, Arial, sans-serif', fontSize: '16px', fontWeight: 700, lineHeight: 1.2, letterSpacing: '0em' },
    nav: { fontFamily: '"Inter", Helvetica, Arial, sans-serif', fontSize: '15px', fontWeight: 700, lineHeight: 1.2, letterSpacing: '0em' },
    caption: { fontFamily: '"Inter", Helvetica, Arial, sans-serif', fontSize: '14px', fontWeight: 400, lineHeight: 1.45, letterSpacing: '0em' },
    legal: { fontFamily: '"Inter", Helvetica, Arial, sans-serif', fontSize: '12px', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0em' },
    pricingDisplay: { fontFamily: '"Wise Sans", "Inter", sans-serif', fontSize: '48px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }
  },
  rounded: {
    sm: '10px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    pill: '9999px'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '56px',
    section: '96px'
  }
};

export class DesignExtractorService {
  static extractDesignSystem(
    workspaceDir: string,
    extractedData: { computedStyles?: Record<string, any>; domData?: Record<string, any> },
    enableWiseDesignSystem = false
  ): DesignTokens {
    const designDir = path.join(workspaceDir, 'design');
    fs.mkdirSync(designDir, { recursive: true });

    // Save Wise tokens if requested or as reference
    fs.writeFileSync(path.join(designDir, 'wise-tokens.css'), WISE_TOKENS_CSS);
    fs.writeFileSync(path.join(designDir, 'wise-tokens.json'), JSON.stringify(WISE_TOKENS_JSON, null, 2));

    let tokens: DesignTokens;

    if (enableWiseDesignSystem) {
      tokens = WISE_TOKENS_JSON as any;
    } else {
      // Build tokens from crawled computed styles
      const colorsSet = new Set<string>();
      const fontsSet = new Set<string>();

      if (extractedData.computedStyles) {
        Object.values(extractedData.computedStyles).forEach((st: any) => {
          if (st.colors) st.colors.forEach((c: string) => colorsSet.add(c));
          if (st.fonts) st.fonts.forEach((f: string) => fontsSet.add(f));
        });
      }

      const extractedColors: Record<string, string> = {};
      Array.from(colorsSet).slice(0, 20).forEach((c, idx) => {
        extractedColors[`color-${idx + 1}`] = c;
      });

      tokens = {
        colors: {
          ...WISE_TOKENS_JSON.colors,
          ...extractedColors
        },
        typography: WISE_TOKENS_JSON.typography,
        spacing: WISE_TOKENS_JSON.spacing,
        radius: WISE_TOKENS_JSON.rounded,
        shadows: {
          navDropdown: '0 20px 66px 0 rgba(34,48,73,0.20)'
        },
        breakpoints: {
          compact: 320,
          mobile: 576,
          tablet: 768,
          laptop: 992,
          desktop: 1200,
          wide: 1440
        },
        motion: {
          transition: 'all 0.2s ease-in-out'
        }
      };
    }

    fs.writeFileSync(path.join(designDir, 'tokens.json'), JSON.stringify(tokens, null, 2));

    // Generate comprehensive design.md based on supplied specification
    const markdownContent = `# Wise Design System (Light & Dark Mode)

## Overview
Wise's visual identity is built around the idea that money should feel clear, fast, and fair. The system uses a high-recognition pairing of bright green (\`#9FE870\`) and deep forest green (\`#163300\`).

## Light & Dark Modes
PixelForge generated implementations natively support both **Light Mode** (\`:root\`) and **Dark Mode** (\`.dark\`).

### Light Mode Colors
${Object.entries(WISE_TOKENS_JSON.colors).map(([key, val]) => `- **${key}**: \`${val}\``).join('\n')}

### Dark Mode Colors
${Object.entries(WISE_TOKENS_JSON.darkModeColors).map(([key, val]) => `- **${key}**: \`${val}\``).join('\n')}

## Typography Scale
| Level | Family | Size | Weight | Line Height | Letter Spacing |
|---|---|---:|---:|---:|---:|
${Object.entries(WISE_TOKENS_JSON.typography).map(([k, v]: any) => `| ${k} | \`${v.fontFamily}\` | ${v.fontSize} | ${v.fontWeight} | ${v.lineHeight} | ${v.letterSpacing} |`).join('\n')}

## Border Radii
${Object.entries(WISE_TOKENS_JSON.rounded).map(([key, val]) => `- **${key}**: \`${val}\``).join('\n')}

## Spacing System
${Object.entries(WISE_TOKENS_JSON.spacing).map(([key, val]) => `- **${key}**: \`${val}\``).join('\n')}

## Core Signature Components
- **Button Primary**: Forest green background (\`#163300\`), white text, pill radius.
- **Button Accent**: Bright Wise green background (\`#9FE870\`), dark forest text (\`#163300\`), pill radius.
- **Currency Calculator**: Rounded panel, large amount field, flag-led currency selectors, fee breakdown.
- **Theme Switcher**: Integrated Light/Dark mode toggle button.
`;

    fs.writeFileSync(path.join(designDir, 'design.md'), markdownContent);

    return tokens;
  }
}
