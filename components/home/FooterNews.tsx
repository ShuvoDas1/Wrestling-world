import React from "react";
import useSWR from "swr";
import { fetcher } from "../../pages";
import GRAPHQL_QUERIES from "../../services/GraphQLQueries";
import { News } from "../../types/news";
import useSWROptions from "../../utils/constants/useSWROptions";
import dynamic from "next/dynamic";

const NewsItem = dynamic(()=> import("./NewsItem"))


function FooterNews() {
  const { data: newsData, error: bottomArticlesError } = useSWR(
    GRAPHQL_QUERIES.ARTICLES_BOTTOM_PAGE,
    fetcher,
    useSWROptions
  );
  return (
    <div className="bg-[#18191A]">
      <div className="max-w-[1440px] mx-auto h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 xl:gap-0 xl:flex justify-around xl:space-x-1 xl:space-y-0 px-4 py-14">
        {newsData
          ? newsData?.posts.edges.map((news: { [any: string]: any }, i: number) => (
              <div key={i} className="flex-1">
                <NewsItem noResponsive data={news.node} isLoading={false} theme="dark" />
              </div>
            ))
          : new Array(5).fill("1").map((x, i) => (
              <div key={i} className="flex-1">
                <NewsItem noResponsive key={i} isLoading theme="dark" />
              </div>
            ))}
      </div>
    </div>
  );
}

export default FooterNews;
