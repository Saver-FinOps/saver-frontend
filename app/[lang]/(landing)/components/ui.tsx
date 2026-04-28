'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Logo                                                               */
/* ------------------------------------------------------------------ */

export function Logo() {
  return (
    <span className="font-display text-xl font-bold text-fg tracking-[-0.02em]">
      Signal
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Container                                                          */
/* ------------------------------------------------------------------ */

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-(--max-width,1200px) mx-auto px-(--gutter-md,32px) ${className ?? ''}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Badge                                                              */
/* ------------------------------------------------------------------ */

const badgeVariantClasses: Record<string, string> = {
  info: 'bg-blue-500/8 text-blue-600 border border-blue-500/20',
  waste: 'bg-red-500/8 text-red-600 border border-red-500/20',
  savings: 'bg-emerald-500/8 text-emerald-600 border border-emerald-500/20',
  dark: 'bg-white/6 text-slate-200 border border-white/10',
};

export function Badge({
  variant = 'info',
  pulse,
  children,
}: {
  variant?: string;
  pulse?: boolean;
  children: ReactNode;
}) {
  const variantCls = badgeVariantClasses[variant] ?? badgeVariantClasses.info;
  return (
    <span
      className={`inline-flex items-center gap-[7px] px-3.5 py-1.5 rounded-full text-[13px] font-semibold font-body ${variantCls} ${pulse ? 'animate-pulse-urgent' : ''}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Button                                                             */
/* ------------------------------------------------------------------ */

const buttonVariantClasses: Record<string, string> = {
  primary:
    'border-0 [background:var(--grad-primary,linear-gradient(135deg,#3b82f6,#2563eb))] text-white shadow-glow-primary',
  secondary:
    'border border-slate-200 bg-white text-fg-secondary shadow-none',
  white:
    'border border-white/25 bg-white/12 text-white shadow-none backdrop-blur-[8px]',
};

const buttonSizeClasses: Record<string, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}) {
  const variantCls = buttonVariantClasses[variant] ?? buttonVariantClasses.primary;
  const sizeCls = buttonSizeClasses[size] ?? buttonSizeClasses.md;

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 font-semibold font-body rounded-xl cursor-pointer transition-all duration-200 ${sizeCls} ${variantCls} ${fullWidth ? 'w-full' : ''} ${props.disabled ? 'opacity-65 cursor-not-allowed' : ''} ${className ?? ''}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Input                                                              */
/* ------------------------------------------------------------------ */

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-fg-secondary mb-[5px]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={label}
        className="w-full px-3.5 py-2.5 text-sm font-body rounded-[10px] border border-slate-200 bg-white text-fg outline-none transition-colors duration-150 box-border focus:border-blue-500"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Select                                                             */
/* ------------------------------------------------------------------ */

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-fg-secondary mb-[5px]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3.5 py-2.5 text-sm font-body rounded-[10px] border border-slate-200 bg-white outline-none cursor-pointer appearance-none transition-colors duration-150 box-border focus:border-blue-500 ${value ? 'text-fg' : 'text-fg-muted'}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-card transition-shadow duration-250 ease-in-out ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grain overlay                                                      */
/* ------------------------------------------------------------------ */

export function Grain({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none bg-repeat bg-size-[128px_128px]"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
