import { Platform, type TextStyle } from 'react-native';

/**
 * SANKALPAM Pujari — design tokens.
 *
 * Direction: "Crimson & Champagne".
 *
 * Built from the Nickelfox Indian-wedding reference the client shared — deep
 * crimson, antique gold, champagne and warm ivory over a deep-navy ink — and
 * then pushed further: a fuller tint ramp so the palette survives dense data
 * screens, a proper dark theme the reference never needed, and status colours
 * that stay legible against warm surfaces.
 *
 * Crimson carries the brand and every primary action. Gold and champagne are
 * ceremonial: money, credentials, ornament and dividers. Navy is the ink, which
 * keeps long-form text calm instead of competing with the warmth around it.
 *
 * Ornament is bounded. Arches, gold rules and botanical watermarks belong on
 * hero and ceremonial surfaces; the working screens — requests, checklists,
 * check-in — stay flat and high-contrast. A pujari reading a booking at 4:30am
 * on a mid-range Android should never have to fight the decoration.
 */

// ---------------------------------------------------------------- raw palette

const palette = {
  // Crimson — brand
  crimson900: '#4E0F22',
  crimson800: '#6B1630',
  crimson700: '#821B3A',
  crimson600: '#9A2143', // reference primary
  crimson500: '#B33455',
  crimson400: '#C85675',
  crimson300: '#DE8AA0',
  crimson200: '#EFBECB',
  crimson100: '#F7DEE5',
  crimson050: '#FCEFF2',

  // Antique gold / champagne — ceremony, money, credentials
  gold800: '#6E5A22',
  gold700: '#8C7233',
  gold600: '#A88C41',
  gold500: '#BFA054', // reference gold
  gold400: '#D3BA79',
  gold300: '#EDD498', // reference champagne
  gold200: '#F3E4BE',
  gold100: '#F8EFD9',
  gold050: '#FCF7EC',

  // Navy — ink
  navy900: '#141B31',
  navy800: '#1E2742', // reference ink
  navy700: '#2B3556',
  navy600: '#414C70',
  navy500: '#5D6884',
  navy400: '#8A93A8',
  navy300: '#9EA1AB', // reference grey
  navy200: '#C6CAD5',
  navy100: '#E2E5EC',

  // Warm neutrals
  ivory: '#FBF8F2', // reference ivory
  ivoryDeep: '#F4EFE4',
  parchment: '#EFE8DA',
  white: '#FFFFFF',
  greyBg: '#F6F6F6',

  // Night surfaces
  night900: '#0E1122',
  night800: '#141A2E',
  night700: '#1C2440',
  night600: '#26304F',
  night500: '#333E60',

  green700: '#166149',
  green050: '#DFF0E8',
  amber700: '#8A6209',
  amber050: '#FBEED2',
  ember600: '#B8431F',
  ember050: '#FBE7DD',
} as const;

// ------------------------------------------------------------ semantic themes

export type Theme = {
  mode: 'light' | 'dark';
  bg: Record<
    | 'canvas' | 'surface' | 'raised' | 'sunken' | 'inverse'
    | 'brand' | 'brandTint' | 'accentTint' | 'overlay' | 'scrim',
    string
  >;
  fg: Record<
    'primary' | 'secondary' | 'tertiary' | 'faint' | 'inverse' | 'brand' | 'accent' | 'onBrand',
    string
  >;
  line: Record<'subtle' | 'default' | 'strong' | 'brand' | 'focus' | 'gold', string>;
  status: Record<
    | 'successFg' | 'successBg'
    | 'warningFg' | 'warningBg'
    | 'errorFg' | 'errorBg'
    | 'infoFg' | 'infoBg'
    | 'urgentFg' | 'urgentBg'
    | 'neutralFg' | 'neutralBg',
    string
  >;
  /** Ceremonial surfaces only — never on dense working screens. */
  gradient: Record<'brand' | 'gold' | 'champagne' | 'heroScrim' | 'canvasWash', readonly string[]>;
  glass: { bg: string; border: string; strongBg: string };
};

export const lightTheme: Theme = {
  mode: 'light',

  bg: {
    canvas: palette.ivory,
    surface: palette.white,
    raised: palette.white,
    sunken: palette.ivoryDeep,
    inverse: palette.navy800,
    brand: palette.crimson600,
    brandTint: palette.crimson050,
    accentTint: palette.gold050,
    overlay: 'rgba(20,27,49,0.58)',
    scrim: 'rgba(20,27,49,0.05)',
  },

  fg: {
    primary: palette.navy800,
    secondary: palette.navy600,
    tertiary: palette.navy500,
    faint: palette.navy400,
    inverse: palette.white,
    brand: palette.crimson600,
    accent: palette.gold700,
    onBrand: palette.white,
  },

  line: {
    subtle: 'rgba(30,39,66,0.07)',
    default: palette.navy100,
    strong: palette.navy200,
    brand: palette.crimson600,
    focus: palette.crimson500,
    gold: palette.gold300,
  },

  status: {
    successFg: palette.green700,
    successBg: palette.green050,
    warningFg: palette.amber700,
    warningBg: palette.amber050,
    errorFg: palette.crimson700,
    errorBg: palette.crimson050,
    infoFg: palette.navy700,
    infoBg: palette.navy100,
    urgentFg: palette.ember600,
    urgentBg: palette.ember050,
    neutralFg: palette.navy600,
    neutralBg: palette.ivoryDeep,
  },

  gradient: {
    brand: [palette.crimson600, palette.crimson800],
    gold: [palette.gold400, palette.gold600],
    champagne: [palette.gold100, palette.gold050],
    heroScrim: ['rgba(20,27,49,0)', 'rgba(20,27,49,0.5)', 'rgba(20,27,49,0.88)'],
    canvasWash: [palette.gold050, palette.ivory],
  },

  glass: {
    bg: 'rgba(255,255,255,0.16)',
    border: 'rgba(255,255,255,0.26)',
    strongBg: 'rgba(255,255,255,0.24)',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',

  bg: {
    canvas: palette.night900,
    surface: palette.night800,
    raised: palette.night700,
    sunken: '#0A0D1A',
    inverse: palette.ivory,
    brand: palette.crimson500,
    brandTint: '#2C1220',
    accentTint: '#2A2313',
    overlay: 'rgba(0,0,0,0.72)',
    scrim: 'rgba(255,255,255,0.05)',
  },

  fg: {
    primary: '#F2EFE9',
    secondary: '#B3B9C8',
    tertiary: '#868FA3',
    faint: '#616B82',
    inverse: palette.navy900,
    brand: palette.crimson300,
    accent: palette.gold300,
    onBrand: palette.white,
  },

  line: {
    subtle: 'rgba(255,255,255,0.08)',
    default: 'rgba(255,255,255,0.14)',
    strong: 'rgba(255,255,255,0.24)',
    brand: palette.crimson300,
    focus: palette.crimson300,
    gold: 'rgba(237,212,152,0.42)',
  },

  status: {
    successFg: '#63C79C',
    successBg: '#0F2B22',
    warningFg: '#E2B65A',
    warningBg: '#2C2413',
    errorFg: '#EE8AA2',
    errorBg: '#2E1420',
    infoFg: '#A9B3CC',
    infoBg: '#1A2136',
    urgentFg: '#F2916B',
    urgentBg: '#2F1911',
    neutralFg: '#B3B9C8',
    neutralBg: palette.night600,
  },

  gradient: {
    brand: [palette.crimson600, palette.crimson900],
    gold: [palette.gold500, palette.gold800],
    champagne: ['#2A2313', '#1C1A12'],
    heroScrim: ['rgba(10,13,26,0)', 'rgba(10,13,26,0.6)', 'rgba(10,13,26,0.95)'],
    canvasWash: ['#141A2E', palette.night900],
  },

  glass: {
    bg: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.14)',
    strongBg: 'rgba(255,255,255,0.14)',
  },
};

/** Exposed for ornament that must sit outside the semantic roles. */
export const brandPalette = palette;

// -------------------------------------------------------------------- type

/**
 * DM Serif Display for ceremonial headings and figures — it carries the
 * reference's editorial warmth. Kantumruy Pro is the UI companion: humanist,
 * high x-height, and it holds up at caption sizes in poor light. Anek Telugu
 * and Anek Devanagari cover the Indic scripts; both are drawn for UI rather
 * than retrofitted from display faces.
 */
export const fontFamily = {
  serif: 'DMSerifDisplay_400Regular',
  regular: 'KantumruyPro_400Regular',
  medium: 'KantumruyPro_500Medium',
  semibold: 'KantumruyPro_600SemiBold',
  bold: 'KantumruyPro_700Bold',
  te: 'AnekTelugu_400Regular',
  teMedium: 'AnekTelugu_500Medium',
  teSemibold: 'AnekTelugu_600SemiBold',
  hi: 'AnekDevanagari_400Regular',
  hiMedium: 'AnekDevanagari_500Medium',
  hiSemibold: 'AnekDevanagari_600SemiBold',
} as const;

type Variant = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: TextStyle['textTransform'];
};

export const type: Record<string, Variant> = {
  /** Ceremonial display — serif, used sparingly on heroes and key figures. */
  display: { fontFamily: fontFamily.serif, fontSize: 34, lineHeight: 42, letterSpacing: -0.4 },
  h1: { fontFamily: fontFamily.serif, fontSize: 27, lineHeight: 35, letterSpacing: -0.2 },
  h2: { fontFamily: fontFamily.serif, fontSize: 22, lineHeight: 30, letterSpacing: -0.1 },

  /** Working hierarchy — sans, where scanning matters more than character. */
  h3: { fontFamily: fontFamily.semibold, fontSize: 17, lineHeight: 24, letterSpacing: -0.1 },
  title: { fontFamily: fontFamily.semibold, fontSize: 15.5, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 23 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 23 },
  small: { fontFamily: fontFamily.regular, fontSize: 13.5, lineHeight: 20 },
  smallStrong: { fontFamily: fontFamily.semibold, fontSize: 13.5, lineHeight: 20 },
  caption: { fontFamily: fontFamily.medium, fontSize: 12.5, lineHeight: 17.5 },
  micro: {
    fontFamily: fontFamily.semibold,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },

  /** Money and countdowns — serif, mirroring the reference's gold figures. */
  numeric: { fontFamily: fontFamily.serif, fontSize: 23, lineHeight: 30 },
  numericLarge: { fontFamily: fontFamily.serif, fontSize: 36, lineHeight: 44, letterSpacing: -0.4 },
  /** Where digits must align in a column rather than look ceremonial. */
  numericPlain: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 22 },
};

export const tabularNums = Platform.select({
  ios: { fontVariant: ['tabular-nums'] as TextStyle['fontVariant'] },
  android: { fontVariant: ['tabular-nums'] as TextStyle['fontVariant'] },
  default: { fontVariant: ['tabular-nums'] as TextStyle['fontVariant'] },
});

// -------------------------------------------------------------- primitives

export const space = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  xxl: 32,
  /** Temple-arch top used on hero frames. */
  arch: 999,
  pill: 999,
} as const;

/** Minimum interactive size. Non-negotiable — see accessibility bar. */
export const HIT = 48;

export const control = {
  height: { sm: 38, md: 50, lg: 56 },
  paddingX: { sm: 14, md: 20, lg: 24 },
} as const;

export const shadow = {
  none: {},
  sm: Platform.select({
    web: { boxShadow: '0 1px 2px rgba(30,39,66,0.05), 0 1px 1px rgba(30,39,66,0.04)' },
    default: {
      shadowColor: '#1E2742',
      shadowOpacity: 0.06,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
  }) as object,
  md: Platform.select({
    web: { boxShadow: '0 6px 18px rgba(30,39,66,0.08), 0 1px 3px rgba(30,39,66,0.05)' },
    default: {
      shadowColor: '#1E2742',
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },
  }) as object,
  lg: Platform.select({
    web: { boxShadow: '0 16px 40px rgba(30,39,66,0.14), 0 3px 10px rgba(30,39,66,0.06)' },
    default: {
      shadowColor: '#1E2742',
      shadowOpacity: 0.16,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },
  }) as object,
  /** Ceremonial cards carry a crimson-tinted lift so they read as raised. */
  hero: Platform.select({
    web: { boxShadow: '0 20px 48px rgba(78,15,34,0.26), 0 5px 14px rgba(78,15,34,0.14)' },
    default: {
      shadowColor: '#4E0F22',
      shadowOpacity: 0.28,
      shadowRadius: 30,
      shadowOffset: { width: 0, height: 16 },
      elevation: 14,
    },
  }) as object,
} as const;

export const motion = {
  fast: 140,
  base: 240,
  slow: 380,
  /** Per-item delay in a staggered list entrance. */
  stagger: 55,
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
} as const;

export const layout = {
  maxContentWidth: 460,
  screenPadding: space.lg,
  tabBarHeight: 72,
  heroHeight: 216,
} as const;
