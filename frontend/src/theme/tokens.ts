/**
 * D-HEALTH DESIGN TOKENS (Đồng bộ 100% với file source BA 5_6291670095529781835.md & HTML templates)
 */
export const DesignTokens = {
  colors: {
    // Brand Colors
    primaryTeal: '#1F7A8C',
    accentBlue: '#2F6FDB',
    brandTeal: '#1F7A8C',
    brandTealDark: '#1F5F6C',
    brandTealLight: '#D9F3EC',
    brandTealGradStart: '#1F9C86',
    brandBlue: '#2F6FDB',
    brandBlueGradEnd: '#3B66D6',
    gradientBrand: 'linear-gradient(135deg, #1F7A8C, #2F6FDB)',
    gradientBrand145: 'linear-gradient(145deg, #1F9C86, #3B66D6)',
    gradientScreenBg: 'linear-gradient(170deg, #D9F3EC 0%, #E6ECFF 50%, #EEF2F6 100%)',

    // Backgrounds & Surfaces
    bgApp: '#EEF2F6',
    bgCard: '#FFFFFF',
    bgInput: '#F8FAFC',
    borderSubtle: '#D1D9E2',
    borderBorderLight: '#E5E7EB',

    // Text Colors
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#4B5563',
    textLightMuted: '#6B7280',
    textWhite: '#FFFFFF',

    // Vitals Specific Colors
    vitalsCardBlue: '#2F6FDB',
    vitalsCardOrange: '#C9561E',
    vitalsCardWhite: '#FFFFFF',

    // Semantic Status Badges
    badgeGoodBg: '#DCFCE7',
    badgeGoodText: '#166534',
    badgeWarningBg: '#FEF3C7',
    badgeWarningText: '#92400E',
    badgeCriticalBg: '#FEE2E2',
    badgeCriticalText: '#B91C1C',
    badgeFollowUpBorder: '#FCD34D',
    statusDotGreen: '#22C55E',
  },
  radius: {
    pill: '9999px',
    screen: '40px',
    card: '24px',
    cardLarge: '28px',
    cardSmall: '22px',
    button: '28px',
    buttonMedium: '26px',
    input: '16px',
    bottomSheetTop: '28px',
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  touch: {
    minTargetPt: 44, // WCAG 2.1 AA
    standardButtonHeight: '52px',
    largeButtonHeight: '56px',
  },
} as const;
