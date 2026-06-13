import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#f8fafc',      // Clean light-slate background
  cardBg: '#ffffff',          // Pure white card backgrounds
  cardBgSolid: '#ffffff',
  primary: '#0ea5e9',         // Premium Sky Blue (web patient portal primary)
  secondary: '#d97706',       // Warm Amber (web doctor portal primary)
  accent: '#0ea5e9',
  text: '#0f172a',            // High contrast deep-slate text
  textMuted: '#64748b',       // Muted slate text
  border: '#e2e8f0',          // Elegant light gray borders
  borderActive: 'rgba(14, 165, 233, 0.4)',
  danger: '#ef4444',
  success: '#16a34a',         // Web green
  warning: '#d97706',         // Web amber
  overlay: 'rgba(15, 23, 42, 0.4)',
};

export const FONTS = {
  regular: 'System',
  bold: 'System',
};

export const SHADOWS = {
  default: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glassCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 20,
    marginVertical: 8,
    ...SHADOWS.default,
  },
  glassCardActive: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: 20,
    marginVertical: 8,
    ...SHADOWS.default,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  paragraph: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
});
