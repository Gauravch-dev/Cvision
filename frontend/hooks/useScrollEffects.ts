"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface ScrollPosition {
  scrollY: number;
  scrollProgress: number;
  direction: "up" | "down" | null;
}

export function useScrollPosition(): ScrollPosition {
  const [scrollData, setScrollData] = useState<ScrollPosition>({
    scrollY: 0,
    scrollProgress: 0,
    direction: null,
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollPosition = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;
    const direction =
      scrollY > lastScrollY.current
        ? "down"
        : scrollY < lastScrollY.current
        ? "up"
        : null;

    lastScrollY.current = scrollY;

    setScrollData({
      scrollY,
      scrollProgress: Math.min(Math.max(scrollProgress, 0), 1),
      direction,
    });

    ticking.current = false;
  }, []);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateScrollPosition);
      ticking.current = true;
    }
  }, [updateScrollPosition]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollPosition(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, updateScrollPosition]);

  return scrollData;
}

// Hook for mouse position (for 3D tilt effects)
interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition(): MousePosition {
  const [mousePos, setMousePos] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const normalizedX = (clientX / window.innerWidth - 0.5) * 2;
      const normalizedY = (clientY / window.innerHeight - 0.5) * 2;

      setMousePos({
        x: clientX,
        y: clientY,
        normalizedX,
        normalizedY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePos;
}

// Hook for detecting element visibility (Intersection Observer)
export function useInView(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, options]);

  return { ref, isInView };
}
