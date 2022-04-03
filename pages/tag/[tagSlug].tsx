import request from "graphql-request";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React from "react";

import GRAPHQL_QUERIES from "../../services/GraphQLQueries";
import dynamic from 'next/dynamic';

const Navbar = dynamic(()=> import('../../components/common/Navbar'),{ ssr: false });
const Footer = dynamic(()=> import('../../components/common/Footer'),{ ssr: false });
const ResultList = dynamic(()=> import("../../components/results/ResultList"));

interface TagPageProps {
  slugData: { [any: string]: any };
}

function TagPage({ slugData }: TagPageProps) {
  return (
    <>
      <Head>
        <title>{slugData.seo.title}</title>
      </Head>
      <Navbar />
      <div className="max-w-[1240px] mx-auto h-full">
        <div className="text-center my-8">
          <div className="text-[#919191] font-semibold text-xs uppercase -mb-2">tag</div>
          <h1 className="text-[41px] text-[#111111] font-black">{slugData.name}</h1>
        </div>

        <ResultList query={(offset: number) => GRAPHQL_QUERIES.GET_TAG_POSTS(slugData.databaseId, offset)} />
      </div>

      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { tags } = await request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, GRAPHQL_QUERIES.GET_ALL_TAGS);
  const paths = tags.nodes.map((tag: { [any: string]: any }) => ({
    params: { tagSlug: tag.slug },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tagSlug = params!.tagSlug as string;

  const { tags } = await request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, GRAPHQL_QUERIES.GET_TAG_DATA(tagSlug));

  if (tags?.nodes.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      slugData: tags.nodes[0],
    },
    revalidate: 60,
  };
};

export default TagPage;
