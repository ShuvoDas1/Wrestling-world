import React from "react";
import Image from "next/image";
import Link from "next/link";
import NewsBadge from "../common/NewsBadge";
import truncateString from "../../utils/helpers/truncateString";
import Skeleton from "../common/Skeleton";
import useFormatNewsItemData from "../../hooks/useFormatNewsItemData";

interface NewsItemProps {
  data?: { [key: string]: any };
  isLoading: boolean;
  theme?: "light" | "dark";
  noResponsive?: boolean;
}

function NewsItem({ data, theme = "light", isLoading, noResponsive }: NewsItemProps) {
  const isThemeDark = theme === "dark";
  const [primaryCategoryName, postPreview, srcSetImage] = useFormatNewsItemData(3, data);

  return (
    <Link href={data?.uri || "#"}>
      <a className="block">
        <article
          className={`rounded-[4px] shadow flex ${
            !noResponsive
              ? "lg:h-[340px] lg:flex-col lg:overflow-hidden"
              : "h-[280px] sm:h-[340px] flex-col overflow-hidden"
          } ${!isLoading && "title-underline-animation-wrapper"} ${isThemeDark ? "bg-[#242526]" : "bg-white"}`}
        >
          {/* Image */}
          <div
            className={`relative ${
              !noResponsive
                ? "w-[120px] h-[115.4px] lg:w-full lg:h-[180px] lg:aspect-w-4 lg:aspect-h-2"
                : "w-full h-[180px]"
            } flex-shrink-0`}
          >
            {!isLoading && srcSetImage ? (
              <Image layout="fill" objectFit="cover"  alt={data?.featuredImage.node.altText} src={srcSetImage} />
            ) : (
              <Skeleton className="inset-0 absolute !rounded-none" />
            )}
          </div>
          {/* Title and Description */}
          <div className="px-2 py-4 space-y-2 flex-1 flex flex-col">
            <h3
              className={`leading-[18px] sm:leading-[20px] text-[18px] tracking-[0.32px] sm:tracking-normal sm:text-[22px] font-semibold ${
                isThemeDark && "text-white"
              }`}
            >
              {!isLoading ? <span>{truncateString(data?.title, 66)}</span> : <Skeleton />}
            </h3>
            {!isLoading ? (
              <div className={noResponsive ? "hidden sm:block" : ""}>
                {primaryCategoryName && <NewsBadge text={primaryCategoryName} />}
              </div>
            ) : (
              <Skeleton width={60} height={20} />
            )}
            <p
              className={`text-[13px] ${
                !noResponsive ? "hidden lg:flex" : "flex"
              }  flex-col justify-start sm:justify-end flex-1 leading-4 ${
                isThemeDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {!isLoading ? <span>{postPreview}</span> : <Skeleton count={3} />}
            </p>
          </div>
        </article>
      </a>
    </Link>
  );
}

export default NewsItem;
