import React from 'react';
import Skeleton from '../common/Skeleton';
import useFormatNewsItemData from '../../hooks/useFormatNewsItemData';
import Link from 'next/link';
import Image from 'next/image';
import truncateString from '../../utils/helpers/truncateString';
import request from 'graphql-request';
import { useMemo } from 'react';
import { useState } from 'react';
import dynamic from "next/dynamic";
import useSWR from 'swr';
import useSWROptions from '../../utils/constants/useSWROptions';

const Pagination = dynamic(()=> import('../common/Pagination'));

const RESULT_PER_PAGE = 10;

interface ResultListProps {
  query: (offset: number) => string;
  emptyResultsLabel?: string;
}

const fetcher = (query: string) =>
  request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, query);

function ResultList({ query, emptyResultsLabel }: ResultListProps) {
  const [offset, setOffset] = useState<number>(0);

  const {
    data: resultData,
    error: featuredArticlesError,
    isValidating,
  } = useSWR(query(offset), fetcher, useSWROptions);

  const hasMore = resultData?.posts.pageInfo.offsetPagination.hasMore;
  const hasPrevious = resultData?.posts.pageInfo.offsetPagination.hasPrevious;
  const total = resultData?.posts.pageInfo.offsetPagination.total;
  console.log(
    '🚀 ~ file: ResultList.tsx ~ line 34 ~ ResultList ~ hasMore',
    hasMore
  );
  console.log(
    '🚀 ~ file: ResultList.tsx ~ line 35 ~ ResultList ~ hasPrevious',
    hasPrevious
  );
  console.log(
    '🚀 ~ file: ResultList.tsx ~ line 35 ~ ResultList ~ total',
    total
  );

  const totalPages = useMemo(() => {
    return Math.ceil(total / RESULT_PER_PAGE);
  }, [total]);

  const actualPage = useMemo(() => {
    return offset / RESULT_PER_PAGE + 1;
  }, [offset]);

  const onClickNext = () => {
    window.scrollTo(0, 0);
    setOffset((prev) => prev + RESULT_PER_PAGE);
  };

  const onClickPrevious = () => {
    setOffset((prev) => prev - RESULT_PER_PAGE);
  };

  return (
    <>
      <div className="lg:grid grid-cols-6 mb-8">
        <main className="col-span-4 px-5 space-y-5">
          {!isValidating
            ? resultData?.posts.edges.map((newsData: any, i: number) =>(
                <ResultItem key={i} data={newsData.node} isLoading={false} />
              ))
            : new Array(12)
                .fill('1')
                .map((x, i) => <ResultItem key={i} isLoading />)}

          {!isValidating &&
            resultData &&
            resultData.posts.edges.length === 0 && (
              <h2 className="font-medium text-3xl">
                {emptyResultsLabel || 'No post found.'}
              </h2>
            )}
        </main>
        <div className="hidden lg:block col-span-2 px-5 border"></div>
      </div>
      <Pagination
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
        totalResults={total}
        nextDisabled={!hasMore}
        actualPage={actualPage}
        numPages={totalPages}
        prevDisabled={!hasPrevious}
      />
    </>
  );
}

interface ResultItemProps {
  data?: { [key: string]: any };
  isLoading: boolean;
}

function ResultItem({ data, isLoading }: ResultItemProps) {
  // console.log('🚀 ~ file: ResultList.tsx ~ line 107 ~ ResultItem ~ data', data);
  const [categoryName, postPreview, srcSetImage] = useFormatNewsItemData(
    3,
    data
  );

  return (
    <article className="flex max-h-[190px] overflow-hidden shadow-sm rounded-md border border-gray-100">
      <div className="w-[40%] relative">
        <Link href={data?.uri || '#'}>
          <a className="block relative h-full w-full aspect-w-6 aspect-h-4">
            {!isLoading && srcSetImage ? (
              <Image
                layout="fill"
                objectFit="cover"
                alt={data?.featuredImage.node.altText}
                src={srcSetImage}
              />
            ) : (
              <Skeleton className="inset-0 absolute !rounded-none" />
            )}
          </a>
        </Link>
        <div className="absolute bottom-0 left-0 bg-main text-[11px] tracking-wide px-2 text-white font-bold uppercase">
          {categoryName}
        </div>
      </div>
      <div className="w-[60%] px-5 py-2">
        <h3>
          <Link href={data?.uri || '#'}>
            <a className="block hover:text-main text-[#111111] text-xl sm:text-[28px] leading-5 sm:leading-7 font-bold">
              {!isLoading ? (
                <span>{truncateString(data?.title, 100)}</span>
              ) : (
                <Skeleton />
              )}
            </a>
          </Link>
        </h3>
        <p className="hidden sm:block text-[13px] text-[#555555] font-exo-nav font-medium flex-1 leading-4 mt-5">
          {!isLoading ? <div>{postPreview}</div> : <Skeleton count={3} />}
        </p>
      </div>
    </article>
  );
}

export default ResultList;
