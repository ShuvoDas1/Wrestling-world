import React, { lazy, useMemo } from 'react';
import { useState } from 'react';
import Footer from '../components/common/Footer';
import GridSectionWrapper from '../components/common/GridSectionWrapper';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/common/Navbar';
import SectionTitle from '../components/home/SectionTitle';
import SpecialEvents from '../components/home/SpecialEvents';
import Head from 'next/head';
import { request } from 'graphql-request';
import GRAPHQL_QUERIES from '../services/GraphQLQueries';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import useMediaQuery from '../hooks/useMediaQuery';
import GoogleSheetsService from '../services/GoogleSheetsServices';
import parse from 'html-react-parser';

const Ad = dynamic(() => import('../components/common/Ad'), { ssr: false });
const YoutubePlaylist = dynamic(
  () => import('../components/home/YoutubePlaylist')
);
const FooterNews = dynamic(() => import('../components/home/FooterNews'));
const Results = dynamic(() => import('../components/home/Results'));
const MainImageNews = dynamic(() => import('../components/home/MainImageNews'));
const NewsItem = dynamic(() => import('../components/home/NewsItem'))

export const fetcher = (query: string) =>
  request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, query);

interface IndexPageProps {
  featuredArticles: { [any: string]: any };
  newsAndRumors: { [any: string]: any };
  ppvArticle: { [any: string]: any };
  resultsData: { [any: string]: any };
  specialEvents: Array<string>;
  youtubeVideoIds: Array<string>;
  seoData: { [any: string]: any };
}

function IndexPage({
  featuredArticles,
  newsAndRumors,
  specialEvents,
  ppvArticle,
  resultsData,
  youtubeVideoIds,
  seoData,
}: IndexPageProps) {
  const [isLoadingMoreNews, setIsLoadingMoreNews] = useState(false);
  const [actualCursor, setActualCursor] = useState('');
  const [totalNewsAndRumors, setTotalNewsAndRumors] = useState<Array<any>>([]);

  useEffect(() => {
    if (newsAndRumors && totalNewsAndRumors.length === 0) {
      setTotalNewsAndRumors(newsAndRumors.posts.edges);
      setActualCursor(newsAndRumors.posts.pageInfo.endCursor);
    }
  }, [newsAndRumors, totalNewsAndRumors]);

  const isScreenSmallSize = useMediaQuery(1023);

  const handleLoadMoreNews = () => {
    if (!newsAndRumors) return;
    setIsLoadingMoreNews(true);
    request(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
      GRAPHQL_QUERIES.LOAD_MORE_NEWS_AND_RUMORS_ARTICLES(
        actualCursor || newsAndRumors.posts.cursor
      )
    ).then((data) => {
      if (data) {
        setTotalNewsAndRumors([...totalNewsAndRumors, ...data.posts.edges]);
        setActualCursor(data.posts.pageInfo.endCursor);
        setIsLoadingMoreNews(false);
      }
    });
  };

  const fullHead = useMemo(() => parse(seoData.page.seo.fullHead), [seoData]);

  return (
    <div className="bg-gray-100 lg:bg-white">
      <Head>
        <title>{seoData.page.seo.title}</title>
        {fullHead}
      </Head>
      <Navbar />
      <main>
        <header>
          <GridSectionWrapper className="lg:py-8 h-full lg:h-[544px]">
            <>
              {/* Two smaller news */}
              {!isScreenSmallSize && (
                <div className="grid grid-rows-2 gap-3  lg:pr-[15px]">
                  <MainImageNews
                    isLoading={!featuredArticles}
                    data={featuredArticles?.posts.edges[1].node}
                    categoryBadge
                  />
                  <MainImageNews
                    isLoading={!featuredArticles}
                    data={featuredArticles?.posts.edges[2].node}
                    categoryBadge
                  />
                </div>
              )}

              {/* Main news */}
              <div className="sm:h-[500px] lg:px-3">
                <MainImageNews
                  isLoading={!featuredArticles}
                  data={featuredArticles?.posts.edges[0].node}
                  size="lg"
                />
              </div>

              {/* Youtube Player */}
              {!isScreenSmallSize && (
                <div className="block  lg:pl-[15px]">
                  <YoutubePlaylist youtubeVideoIds={youtubeVideoIds} />
                </div>
              )}

              {/* SmallScreen News */}
              {isScreenSmallSize && (
                <div className="mx-4 lg:mx-8 my-5 space-y-2.5">
                  <div>
                    <NewsItem
                      isLoading={!featuredArticles}
                      data={featuredArticles?.posts.edges[1].node}
                    />
                  </div>
                  <div>
                    <NewsItem
                      isLoading={!featuredArticles}
                      data={featuredArticles?.posts.edges[2].node}
                    />
                  </div>
                </div>
              )}
            </>
          </GridSectionWrapper>
        </header>
      </main>
      <div>
        <GridSectionWrapper className="relative bg-gray-100 lg:py-8">
          <>
            {/* Special Events and Pay-per-view */}
            <div className="h-full order-3 lg:order-1 mt-6 lg:mt-0 lg:pr-[15px]">
              <div className="space-y-5 lg:space-y-12 lg:sticky top-16">
                <section>
                  <div className="hidden lg:block">
                    <SectionTitle title="ppv & special events schedule" />
                  </div>
                  <SpecialEvents specialEvents={specialEvents} />
                </section>
                <section>
                  <SectionTitle title="pay-per-view" />
                  <div className="px-4 mt-4 mb-8 lg:px-0 lg:mb-0">
                    <NewsItem
                      data={ppvArticle?.posts.edges[0].node}
                      isLoading={!ppvArticle}
                    />
                  </div>
                  <div className="justify-center hidden w-full mt-4 lg:flex">
                    <Ad adId="ww_h_sb_1" />
                  </div>
                </section>
              </div>
            </div>
            {/* Latest wrestling news & rumors */}
            <div className="order-2 mt-6 lg:mt-0 lg:px-3">
              <section>
                <SectionTitle
                  className="!text-2xl"
                  title="latest wrestling news & rumors"
                />
                <div className="lg:grid grid-cols-2 space-y-2.5 lg:space-y-0 gap-x-2 gap-y-8 mt-4 px-4 lg:px-0">
                  {totalNewsAndRumors.length > 0
                    ? totalNewsAndRumors.map((newsData: any, i: number) => (
                        <NewsItem
                          key={i}
                          data={newsData.node}
                          isLoading={false}
                        />
                      ))
                    : new Array(12)
                        .fill('1')
                        .map((x, i) => <NewsItem key={i} isLoading />)}
                </div>
                <div className="flex items-center justify-center my-4 md:hidden">
                  <Ad adId="ww_mob_h_1" index={2} />
                </div>
                <div className="px-4 mt-6 lg:px-0">
                  {isLoadingMoreNews ? (
                    <div className="flex items-center justify-center w-full">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    newsAndRumors && (
                      <button
                        onClick={handleLoadMoreNews}
                        className="w-full rounded-md bg-main text-white h-[35px] sm:h-auto sm:py-2 font-khand-headers font-semibold text-[16px] sm:text-base"
                      >
                        Load more
                      </button>
                    )
                  )}
                </div>
              </section>
            </div>
            {/* Results */}
            <div className="h-full order-1 lg:order-3 lg:pl-[15px]">
              <div className="flex items-center justify-center my-4 md:hidden">
                <Ad adId="ww_mob_h_1" index={1} />
              </div>
              <div className="space-y-12 lg:sticky top-16">
                <section>
                  <SectionTitle title="results" />
                  <Results resultsData={resultsData} />
                  <div className="justify-center hidden w-full mt-4 lg:flex">
                    <Ad adId="ww_h_sb_2" />
                  </div>
                </section>
              </div>
            </div>
          </>
        </GridSectionWrapper>
      </div>
      <FooterNews />
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const featuredArticles = await fetcher(GRAPHQL_QUERIES.FEATURED_ARTICLES);
  const newsAndRumors = await fetcher(
    GRAPHQL_QUERIES.NEWS_AND_RUMORS_ARTICLES()
  );
  const ppvArticle = await fetcher(GRAPHQL_QUERIES.PAY_PER_VIEW_ARTICLE);
  const resultsData = await fetcher(GRAPHQL_QUERIES.RESULTS_ARTICES);
  const seoData = await fetcher(GRAPHQL_QUERIES.GET_PAGE_HEAD_SEO('27920'));

  const { specialEvents, youtubeVideoIds } =
    await GoogleSheetsService.getSpreadSheetData();

  return {
    props: {
      featuredArticles,
      newsAndRumors,
      specialEvents,
      youtubeVideoIds,
      ppvArticle,
      resultsData,
      seoData,
    },

    revalidate: 60 * 30, //30 minutes
  };
}

export default IndexPage;
