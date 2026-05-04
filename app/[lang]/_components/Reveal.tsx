'use client';

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';

interface RevealProps {
  children: ReactNode;
  /** Delay in ms before this element transitions in. Useful for staggered groups. */
  delay?: number;
  /** Extra classes applied to the wrapper. */
  className?: string;
}

/**
 * Wraps children in a div that fades + slides up when it enters the viewport.
 * Uses IntersectionObserver; observers disconnect after first reveal so the
 * cost stays bounded. Respects prefers-reduced-motion via CSS.
 */
export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If element is already in viewport on mount (e.g. above-the-fold content
    // on a tall screen), reveal immediately without waiting for an intersection.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-visible');
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            obs.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}ms` }
    : undefined;

  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
