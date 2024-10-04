import { useCallback, useRef } from "react";

export default function useIntersectionObserver(callback: () => void) {
  const observer = useRef<IntersectionObserver | null>(null);

  const observe = useCallback(
    (el: Element) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            callback();
          }
        },
        { threshold: 0.1 }
      );
      if (el) observer.current.observe(el);
    },
    [callback]
  );

  const unobserve = useCallback((el: any) => {
    if (observer.current) {
      observer.current.unobserve(el);
    }
  }, []);

  return [observe, unobserve] as const;
}
