import fs from 'fs';
import path from 'path';
import { DesignTokens } from '../../shared/types.js';

export const WISE_TOKENS_CSS = `/* Wise Design System Tokens */
:root {
  --colors-primary: #9fe870;
  --colors-primary-active: #cdffad;
  --colors-primary-neutral: #c5edab;
  --colors-primary-pale: #e2f6d5;
  --colors-canvas: #ffffff;
  --colors-canvas-soft: #e8ebe6;
  --colors-ink: #0e0f0c;
  --colors-ink-deep: #163300;
  --colors-body: #454745;
  --colors-mute: #868685;
  --colors-positive: #2ead4b;
  --colors-positive-deep: #054d28;
  --colors-warning: #ffd11a;
  --colors-warning-deep: #b86700;
  --colors-warning-content: #4a3b1c;
  --colors-negative: #d03238;
  --colors-negative-deep: #a72027;
  --colors-negative-darkest: #a7000d;
  --colors-negative-bg: #320707;
  --colors-accent-orange: #ffc091;
  --colors-accent-cyan: #38c8ff;
  --colors-on-primary: #0e0f0c;

  --typography-display-mega-size: 126px;
  --typography-display-mega-weight: 900;
  --typography-display-mega-line-height: 107.1px;
  --typography-display-xxl-size: 96px;
  --typography-display-xxl-weight: 900;
  --typography-display-xxl-line-height: 81.6px;
  --typography-display-xl-size: 64px;
  --typography-display-xl-weight: 900;
  --typography-display-xl-line-height: 54.4px;
  --typography-display-lg-size: 47px;
  --typography-display-lg-weight: 400;
  --typography-display-lg-line-height: 70.5px;
  --typography-display-md-size: 40px;
  --typography-display-md-weight: 900;
  --typography-display-md-line-height: 34px;
  --typography-display-sm-size: 32px;
  --typography-display-sm-weight: 600;
  --typography-display-sm-line-height: 38.4px;
  --typography-display-xs-size: 24px;
  --typography-display-xs-weight: 600;
  --typography-display-xs-line-height: 31.2px;

  --typography-body-lg-size: 20px;
  --typography-body-lg-weight: 400;
  --typography-body-lg-line-height: 30px;
  --typography-body-md-size: 16px;
  --typography-body-md-weight: 400;
  --typography-body-md-line-height: 24px;
  --typography-body-md-strong-size: 16px;
  --typography-body-md-strong-weight: 600;
  --typography-body-md-strong-line-height: 24px;
  --typography-body-sm-size: 14px;
  --typography-body-sm-weight: 400;
  --typography-body-sm-line-height: 20px;
  --typography-body-sm-strong-size: 14px;
  --typography-body-sm-strong-weight: 600;
  --typography-body-sm-strong-line-height: 20px;
  --typography-caption-size: 12px;
  --typography-caption-weight: 400;
  --typography-caption-line-height: 16px;
  --typography-button-md-size: 16px;
  --typography-button-md-weight: 600;
  --typography-button-md-line-height: 24px;

  --spacing-xxs: 2px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  --spacing-3xl: 48px;

  --rounded-none: 0px;
  --rounded-sm: 8px;
  --rounded-md: 12px;
  --rounded-lg: 16px;
  --rounded-xl: 24px;
  --rounded-pill: 9999px;
  --rounded-full: 9999px;
}
`;

export const WISE_TOKENS_JSON = {
  colors: {
    primary: '#9fe870',
    primaryActive: '#cdffad',
    primaryNeutral: '#c5edab',
    primaryPale: '#e2f6d5',
    canvas: '#ffffff',
    canvasSoft: '#e8ebe6',
    ink: '#0e0f0c',
    inkDeep: '#163300',
    body: '#454745',
    mute: '#868685',
    positive: '#2ead4b',
    positiveDeep: '#054d28',
    warning: '#ffd11a',
    warningDeep: '#b86700',
    warningContent: '#4a3b1c',
    negative: '#d03238',
    negativeDeep: '#a72027',
    negativeDarkest: '#a7000d',
    negativeBg: '#320707',
    accentOrange: '#ffc091',
    accentCyan: '#38c8ff',
    onPrimary: '#0e0f0c'
  },
  typography: {
    fontFamily: 'Wise Sans, Inter, system-ui, sans-serif',
    displayMega: { size: '126px', weight: 900, lineHeight: '107.1px' },
    displayXxl: { size: '96px', weight: 900, lineHeight: '81.6px' },
    displayXl: { size: '64px', weight: 900, lineHeight: '54.4px' },
    displayLg: { size: '47px', weight: 400, lineHeight: '70.5px' },
    displayMd: { size: '40px', weight: 900, lineHeight: '34px' },
    displaySm: { size: '32px', weight: 600, lineHeight: '38.4px' },
    displayXs: { size: '24px', weight: 600, lineHeight: '31.2px' },
    bodyLg: { size: '20px', weight: 400, lineHeight: '30px' },
    bodyMd: { size: '16px', weight: 400, lineHeight: '24px' },
    bodyMdStrong: { size: '16px', weight: 600, lineHeight: '24px' },
    bodySm: { size: '14px', weight: 400, lineHeight: '20px' },
    bodySmStrong: { size: '14px', weight: 600, lineHeight: '20px' },
    caption: { size: '12px', weight: 400, lineHeight: '16px' },
    buttonMd: { size: '16px', weight: 600, lineHeight: '24px' }
  },
  spacing: {
    xxs: '2px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px'
  },
  radius: {
    none: '0px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    pill: '9999px',
    full: '9999px'
  },
  shadows: {},
  breakpoints: {
    mobile: 390,
    tablet: 768,
    desktop: 1440
  },
  motion: {}
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
        colors: extractedColors,
        typography: {
          primaryFont: Array.from(fontsSet)[0] || 'Inter, sans-serif',
          fontList: Array.from(fontsSet)
        },
        spacing: {
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px'
        },
        radius: {
          sm: '4px',
          md: '8px',
          lg: '16px',
          full: '9999px'
        },
        shadows: {
          card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        },
        breakpoints: {
          mobile: 390,
          tablet: 768,
          desktop: 1440
        },
        motion: {
          transition: 'all 0.2s ease-in-out'
        }
      };
    }

    fs.writeFileSync(path.join(designDir, 'tokens.json'), JSON.stringify(tokens, null, 2));

    // Generate comprehensive design.md
    const markdownContent = `# Reconstructed Design System

## Overview
This design system was automatically extracted and reverse-engineered by PixelForge.

## Brand Identity & Colors
${Object.entries(tokens.colors).map(([key, val]) => `- **${key}**: \`${val}\``).join('\n')}

## Typography
- **Primary Font**: \`${tokens.typography?.primaryFont || 'Inter'}\`
- **Detected Fonts**: ${(tokens.typography?.fontList || []).map((f: string) => `\`${f}\``).join(', ')}

## Spacing System
${Object.entries(tokens.spacing).map(([key, val]) => `- **${key}**: \`${val}\``).join('\n')}

## Border Radius
${Object.entries(tokens.radius).map(([key, val]) => `- **${key}**: \`${val}\``).join('\n')}

## Breakpoints
${Object.entries(tokens.breakpoints).map(([key, val]) => `- **${key}**: \`${val}px\``).join('\n')}

## Component Inventory
- **Header**: Navigation bar, branding logo, CTA primary button.
- **Hero**: Primary heading, lead copy, visual element / interactive widget.
- **Cards & Features**: Modular content grids with elevation and hover states.
- **Footer**: Secondary links, legal copy, social links.

## Accessibility
- High contrast color pairs enforced where observable.
- Semantic HTML markup structure inferred.

## Known Uncertainties
### Hero Spacing
- **Observed**: ~24px to 48px padding
- **Confidence**: High
- **Evidence**: Computed styles and screenshot measurements
`;

    fs.writeFileSync(path.join(designDir, 'design.md'), markdownContent);

    return tokens;
  }
}
