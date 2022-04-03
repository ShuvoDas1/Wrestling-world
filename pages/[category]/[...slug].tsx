import request from 'graphql-request';
import { GetStaticPaths, GetStaticProps } from 'next';
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import GRAPHQL_QUERIES from '../../services/GraphQLQueries';
import Head from 'next/head';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import parse from 'html-react-parser';
const Navbar = dynamic(()=> import('../../components/common/Navbar'))
const Footer = dynamic(()=> import('../../components/common/Footer'))
import { useState } from 'react';


import useSWR from 'swr';
import { Waypoint } from 'react-waypoint';
import { useRouter } from 'next/router';

const Ad = dynamic(() => import('../../components/common/Ad'), { ssr: false });
const LoadingSpinner = dynamic(
  () => import('../../components/common/LoadingSpinner')
);
const PostTemplateOne = dynamic(
  () => import('../../components/posts/PostTemplateOne')
);
const PostTemplateTwo = dynamic(
  () => import('../../components/posts/PostTemplateTwo')
);
const FooterNewsTemplateTwo = dynamic(
  () => import('../../components/posts/FooterNewsTemplateTwo')
);

interface SlugProps {
  postData: { [any: string]: any };
  hasPagination: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  actualPage: number;
  newsOrRumorsCategory: boolean;
}

const fetcher = (query: string) =>
  request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, query);

function Slug({
  postData,
  newsOrRumorsCategory,
  actualPage,
  hasPagination,
  hasNext,
  hasPrevious,
}: SlugProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nextPosts, setNextPosts] = useState<Array<{ [any: string]: any }>>([]);
  const router = useRouter();

  const { data: newsAndRumors, error: newsAndRumorsError } = useSWR(
    !newsOrRumorsCategory ? GRAPHQL_QUERIES.NEWS_AND_RUMORS_ARTICLES(8) : null,
    fetcher
  );

  const loadMoreArticle = async () => {
    setIsLoading(true);
    const lastPostId =
      nextPosts.length > 0
        ? nextPosts[nextPosts.length - 1].databaseId
        : postData.databaseId;
    const cursor = await request(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
      GRAPHQL_QUERIES.GET_POST_CURSOR(lastPostId)
    );
    if (cursor) {
      const { posts: nextPost } = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
        GRAPHQL_QUERIES.GET_NEXT_POST(cursor.posts.pageInfo.endCursor)
      );
      const postContentArray =
        nextPost.nodes[0].content?.split('<!--nextpage-->');
      if (postContentArray && postContentArray.length > 1) {
        nextPost.nodes[0].hasPagination = true;
        nextPost.nodes[0].hasNext = true;
        nextPost.nodes[0].content = postContentArray[0];
      }
      setNextPosts((prev) => [...prev, nextPost.nodes[0]]);
    }
    setIsLoading(false);
  };

  const changeBrowserURL = (url: string) => {
    router.replace(url, undefined, { shallow: true });
  };

  useScrollPosition(
    ({ prevPos, currPos }) => {
      if (!newsOrRumorsCategory) return;
      const maxPosScrollPage = -(
        document.body.scrollHeight - window.innerHeight
      );
      if (currPos.y <= maxPosScrollPage + 600 && !isLoading) {
        loadMoreArticle();
      }
    },
    [isLoading]
  );

  const fullHead = useMemo(() => {
    return parse(postData?.seo.fullHead);
  }, [postData]);

  return (
    <>
      <Head>
        <title>{postData?.seo.title}</title>
        {fullHead}
      </Head>
      <Navbar />
      <div className="sm:bg-[#f3f4f6]">
        <div className="max-w-[1440px] mx-auto h-full py-4">
          {newsOrRumorsCategory ? (
            <>
              <Waypoint onEnter={() => changeBrowserURL(postData.uri)}>
                <div>
                  <PostTemplateOne
                    postData={postData}
                    actualPage={actualPage}
                    hasPagination={hasPagination}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                  />
                </div>
              </Waypoint>
              {nextPosts.map((post, i) => (
                <>
                  <div className="items-center justify-center hidden my-4 md:flex">
                    <Ad adId="ww_a_ic_2" index={i + 1} />
                  </div>
                  <Waypoint
                    onEnter={() => changeBrowserURL(post.uri)}
                    key={`${post.slug} ${i}`}
                  >
                    <div>
                      {post.categories.edges.find(
                        (category: any) => category.isPrimary
                      ).node.name === 'News' ||
                      post.categories.edges.find(
                        (category: any) => category.isPrimary
                      ).node.name === 'Rumors' ? (
                        <PostTemplateOne
                          postData={post}
                          actualPage={1}
                          hasPagination={post.hasPagination}
                          hasNext={post.hasNext}
                          hasPrevious={false}
                          index={i + 1}
                        />
                      ) : (
                        <PostTemplateTwo
                          postData={post}
                          actualPage={1}
                          hasPagination={post.hasPagination}
                          hasNext={post.hasNext}
                          hasPrevious={false}
                          index={i + 1}
                        />
                      )}
                    </div>
                  </Waypoint>
                </>
              ))}
              <div
                className={`my-8 flex justify-center ${
                  !isLoading && 'invisible'
                }`}
              >
                <LoadingSpinner />
              </div>
            </>
          ) : (
            <>
              <PostTemplateTwo
                postData={postData}
                actualPage={actualPage}
                hasPagination={hasPagination}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
              />
            </>
          )}
        </div>
        {!newsOrRumorsCategory && (
          <FooterNewsTemplateTwo newsData={newsAndRumors} />
        )}
        {!newsOrRumorsCategory && (
          <div className="fixed left-0 right-0 flex items-center justify-center bottom-4 md:hidden">
            <Ad adId="ww_mob_stickyfooter" />
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { posts: postsLists } = await request(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
    GRAPHQL_QUERIES.GET_URI_POSTS
  );

  let paths: (
    | string
    | {
        params: any;
        locale?: string | undefined;
      }
  )[] = [];

  postsLists.nodes.forEach(({ uri, content }: { [any: string]: any }) => {
    const [_, category, slug] = uri.split('/');
    const postContentArray = content.split('<!--nextpage-->');
    paths.push({ params: { category, slug: [slug] } });

    if (postContentArray.length >= 2) {
      for (let i = 2; i <= postContentArray.length; i++) {
        paths.push({ params: { category, slug: [slug, i.toString()] } });
      }
    }
  });
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  //@ts-ignore
  const { category, slug: slugArr } = params;
  const [slug, number] = slugArr;
  if (slugArr.length > 2) {
    return {
      notFound: true,
    };
  }
  const numPaginationPost = parseInt(number);
  const { post } = await request(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
    GRAPHQL_QUERIES.GET_POST(slug)
  );

  let hasPagination = false;
  let hasPrevious = false;
  let hasNext = false;
  let actualPage =
    !isNaN(numPaginationPost) && Boolean(numPaginationPost)
      ? numPaginationPost
      : 1;

  if (!post) {
    return {
      notFound: true,
    };
  }
  const postContentArray = post.content?.split('<!--nextpage-->');

  if (postContentArray) {
    if (postContentArray.length > 1) {
      hasPagination = true;
      if (actualPage < postContentArray.length) {
        hasNext = true;
      }
      if (actualPage && actualPage > 1) {
        hasPrevious = true;
      }
    }
    post.content = postContentArray[actualPage - 1];
  }

  return {
    props: {
      postData: post,
      newsOrRumorsCategory: category === 'news' || category === 'rumors',
      hasPagination,
      hasNext,
      hasPrevious,
      actualPage,
    },
    revalidate: 60 * 60, // one hour
  };
};

export default Slug;
