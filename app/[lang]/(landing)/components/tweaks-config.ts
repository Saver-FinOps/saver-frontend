export const TWEAKS = {
  colors: {
    blue: { a: '#3b82f6', b: '#2563eb' },
    indigo: { a: '#6366f1', b: '#4f46e5' },
    violet: { a: '#8b5cf6', b: '#7c3aed' },
    emerald: { a: '#10b981', b: '#059669' },
    orange: { a: '#f97316', b: '#ea580c' },
    rose: { a: '#f43f5e', b: '#e11d48' },
  },
} as const;

export interface TweakState {
  lang: string;
  heroVariant: 'dashboard' | 'counter';
  headlineVariant: 'leaking' | 'alt1' | 'alt2';
  formPosition: 'above' | 'below';
  primaryColor: keyof typeof TWEAKS.colors;
  urgencyKey: 'none' | 'spots' | 'cohort' | 'deadline';
}

export const defaultTweakState: Omit<TweakState, 'lang'> = {
  heroVariant: 'dashboard',
  headlineVariant: 'leaking',
  formPosition: 'above',
  primaryColor: 'blue',
  urgencyKey: 'none',
};
