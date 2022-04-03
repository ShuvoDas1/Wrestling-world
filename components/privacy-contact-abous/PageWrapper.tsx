import React, { ReactChild, useMemo } from "react";
import Footer from "../common/Footer";
import Navbar from "../common/Navbar";
import H1 from "./H1";
import Head from "next/head";
import parse from "html-react-parser";

function PageWrapper({
  children,
  title,
  noTitle,
  seoData,
}: {
  children: ReactChild;
  title?: string;
  noTitle?: boolean;
  seoData?: { [any: string]: any };
}) {
  const headSeoData = useMemo(() => {
    return seoData ? parse(seoData.page.seo.fullHead) : null;
  }, [seoData]);

  return (
    <>
      <Head>
        <title>{seoData ? seoData.page.seo.title : `${title} | WrestlingWorld`}</title>
        {headSeoData}
      </Head>
      <Navbar />
      <main className="max-w-[1068px] mx-auto h-full py-16">
        {!noTitle && <H1>{title!}</H1>}
        {children}
      </main>
      <Footer />
    </>
  );
}

export default PageWrapper;
