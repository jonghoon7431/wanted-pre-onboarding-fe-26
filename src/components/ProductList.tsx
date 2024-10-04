import { useCallback, useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { MOCK_DATA } from "../mockdata/mockdata";
import { MockData } from "../types/mockdataType";

const ProductList = () => {
  const PER_PAGE = 10;
  const [data, setData] = useState<MockData[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 페이지는 1부터 시작함
  const getMockData = (pageNum: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const datas: MockData[] = MOCK_DATA.slice(
          PER_PAGE * pageNum,
          PER_PAGE * (pageNum + 1)
        );
        const isEnd = PER_PAGE * (pageNum + 1) >= MOCK_DATA.length;

        resolve({ datas, isEnd });
      }, 1500);
    });
  };

  const loadMoreRef = useRef(null);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    getMockData(page).then((result: any) => {
      setIsLoading(false);
      setData((prev) => [...prev, ...result.datas]);
      setPage((prev) => prev + 1);
      setHasMore(!result.isEnd);
    });
  }, [page, isLoading, hasMore]);

  const [observe, unobserve] = useIntersectionObserver(loadMore);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observe(currentRef);
      }
    };
  }, [observe, unobserve]);

  return (
    <div className="">
      <h1 className="flex justify-center text-[32px] my-6">
        프리온보딩 FE 챌린지 10월 (2024) 리액트 오픈소스 펼쳐보기 사전 미션
      </h1>
      <ul className="flex flex-col gap-4 items-center">
        {data.map((data) => (
          <li key={data.productId} className="border-2 p-2 text-[20px]">
            <p>id: {data.productId}</p>
            <p>name : {data.productName}</p>
            <p>price : {data.price}</p>
            <p>bought date : {data.boughtDate}</p>
          </li>
        ))}
      </ul>
      {isLoading && (
        <div className="flex justify-center text-[24px] m-4">Loading</div>
      )}
      {!isLoading && hasMore && (
        <div className="flex justify-center text-[24px] m-4" ref={loadMoreRef}>
          Loading
        </div>
      )}
      {!hasMore && (
        <div className="flex justify-center text-[24px] m-4">
          No more products to load
        </div>
      )}
    </div>
  );
};

export default ProductList;
