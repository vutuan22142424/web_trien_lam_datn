'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add('motion-ready');

    let observer: IntersectionObserver | null = null;
    let fallbackTimer: number | undefined;

    const frame = window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

      const show = (target: HTMLElement) => target.classList.add('is-visible');

      if (reduceMotion.matches || !('IntersectionObserver' in window)) {
        targets.forEach(show);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            show(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
      );

      targets.forEach((target) => {
        target.classList.remove('is-visible');

        const rect = target.getBoundingClientRect();
        const isAlreadyInView = rect.top < window.innerHeight * 0.94 && rect.bottom > 0;

        if (isAlreadyInView) {
          show(target);
          return;
        }

        observer?.observe(target);
      });

      fallbackTimer = window.setTimeout(() => {
        targets.forEach(show);
      }, 1200);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
