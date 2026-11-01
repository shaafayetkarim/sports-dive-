'use client';
import { useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);
export function SmoothScroll({ children }: { children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null),
    content = useRef<HTMLDivElement>(null);
  const path = usePathname();
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let observer: ResizeObserver | undefined;
      mm.add(
        '(prefers-reduced-motion: no-preference) and (min-width: 1000px) and (pointer: fine)',
        () => {
          const smoother = ScrollSmoother.create({
            wrapper: wrapper.current!,
            content: content.current!,
            smooth: 1.05,
            effects: false,
            normalizeScroll: false,
          });
          const update = () => ScrollTrigger.refresh();
          observer = new ResizeObserver(update);
          observer.observe(content.current!);
          return () => {
            observer?.disconnect();
            smoother.kill();
          };
        },
      );
      return () => {
        observer?.disconnect();
        mm.revert();
      };
    },
    { scope: wrapper, dependencies: [path], revertOnUpdate: true },
  );
  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  );
}
