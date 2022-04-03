import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import truncateString from "../../utils/helpers/truncateString";

interface ResultsProps {
  resultsData: { [any: string]: any };
}

function Results({ resultsData = [] }: ResultsProps) {
  return (
    <div className="bg-main-black p-4 lg:p-2 shadow-md flex lg:flex-col flex-nowrap space-x-4 lg:space-x-0 lg:space-y-2 overflow-y-scroll lg:overflow-y-hidden">
      {resultsData.posts.edges.map((result: { [key: string]: any }, i: number) => (
        <ResultItem key={i} data={result.node} />
      ))}
    </div>
  );
}

function ResultItem({ data, skeleton }: { data?: { [key: string]: any }; skeleton?: boolean }) {
  const imageLink = useMemo(() => {
    if (!data) return;
    const srcSetArray = data?.featuredImage.node.srcSet.split(", ").map((srcSet: string) => srcSet.split(" ")[0]);
    if (srcSetArray) {
      return srcSetArray[0];
    } else {
      return data?.featuredImage.node.link;
    }
  }, [data]);
  return (
    <Link href={data?.uri || "#"}>
      <a>
        <article className="bg-[#222222] hover:bg-[#333333] rounded-md shadow-md lg:flex overflow-hidden w-52 lg:w-auto">
          <div className="relative">
            <div className="flex-shrink-0 relative aspect-w-8 aspect-h-6 lg:aspect-none lg:w-24">
              <Image src={imageLink} objectFit="cover" layout="fill" alt={data?.featuredImage.node.altText} />
            </div>
          </div>
          <div className="h-24 lg:h-20 text-white !leading-5 font-medium font-khand-headers text-[17px] p-2 lg:p-1 xl:p-2 relative">
            {truncateString(data!.title, 100)}
          </div>
        </article>
      </a>
    </Link>
  );
}

export default Results;
