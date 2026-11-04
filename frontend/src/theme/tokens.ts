/**
 * D-HEALTH DESIGN TOKENS (Đồng bộ theo Quy chuẩn fe-development & GEMINI.md)
 */
export const DesignTokens = {
  colors: {
    primaryTeal: '#1F7A8C',
    primaryTealDark: '#0F6B7A',
    primaryTealDeep: '#1F5F6C',
    accentBlue: '#2F6FDB',
    gradientPrimary: 'linear-gradient(135deg, #1F7A8C 0%, #2F6FDB 100%)',
    gradientCard: 'linear-gradient(180deg, rgba(31, 122, 140, 0.15) 0%, rgba(15, 23, 42, 0.4) 100%)',

    // Neutrals
    backgroundDark: '#0B132B',
    surfaceCardDark: '#1C2541',
    surfaceBorder: '#3A506B',
    textWhite: '#FFFFFF',
    textMuted: '#94A3B8',

    // Semantic Status
    statusGood: '#10B981',
    statusGoodBg: 'rgba(16, 185, 129, 0.15)',
    statusWarning: '#F59E0B',
    statusWarningBg: 'rgba(245, 158, 11, 0.15)',
    statusCritical: '#EF4444',
    statusCriticalBg: 'rgba(239, 68, 68, 0.15)',
  },
  radius: {
    pill: '9999px',
    card: '24px',
    bottomSheetTop: '28px',
    button: '16px',
    input: '14px',
  },
  touch: {
    minTargetPt: 44, // WCAG 2.1 AA
  },
} as const;
