import { useCallback, useRef } from "react";

export default function useIntersectionObserver(callback: () => void) {
  const observer = useRef<IntersectionObserver | null>(null);

  const observe = useCallback(
    (el: Element) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver( //IntersectionObserver 생성
        (entries) => {
          console.log(entries);
          if (entries[0].isIntersecting) {
            //대상 요소가 관찰자 루트와 교차할 경우
            callback(); //callback fn 실행
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
