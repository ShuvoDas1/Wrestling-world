import { GetStaticProps } from "next";
import React from "react";
import { fetcher } from ".";
import dynamic from "next/dynamic";
import GRAPHQL_QUERIES from "../services/GraphQLQueries";
import { SOCIAL_LINKS } from "../utils/constants/links";  

const NextLink = dynamic(()=> import("../components/privacy-contact-abous/Link"));
const PrivacyContactAboutUsWrapper = dynamic(()=>import("../components/privacy-contact-abous/PageWrapper"))

function AboutUsPagee({ seoData }: { seoData: { [any: string]: any } }) {
  return (
    <PrivacyContactAboutUsWrapper seoData={seoData}>
      <article className="space-y-5 leading-7 mt-8">
        <p>
          <NextLink href="/">WrestlingWorld.co</NextLink> is committed to bringing you daily content related to WWE and
          AEW.
        </p>
        <p>
          Our information-based articles range from news, rumors, weekly results, pay-per-views and lists on a vast
          array of topics. From Raw, SmackDown, NXT, and Dynamite, to Royal Rumble, Survivor Series, WrestleMania,
          Double or Nothing, All Out, Revolution and more!
        </p>
        <p>
          Looking for the latest news or rumor about your favorite show? We have it! Maybe you want to know about what
          are your favorite Superstars up to, we have that information too! We don’t provide fake news – at best, it
          will be a rumor.
        </p>
        <p>
          Make sure to bookmark our website and follow us on{" "}
          <NextLink rel="noreferrer" target="_blank" href={SOCIAL_LINKS.FACEBOOK}>
            Facebook
          </NextLink>{" "}
          for all the latest updates in the pro wrestling world!
        </p>
      </article>
    </PrivacyContactAboutUsWrapper>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const seoData = await fetcher(GRAPHQL_QUERIES.GET_PAGE_HEAD_SEO("1891"));
  return {
    props: { seoData },
  };
};

export default AboutUsPagee;
