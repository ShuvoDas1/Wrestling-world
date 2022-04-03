import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";
import React, { FC, useEffect, useRef } from "react";
import getRandomInt from "../../utils/helpers/getRandomInt";
import { Element } from "domhandler/lib/node";
import dynamic from "next/dynamic";

const Ad  = dynamic(()=>import("../common/Ad"))

interface ArticleContentProps {
  contentData: string;
  template: 1 | 2;
}

const ArticleContent: FC<ArticleContentProps> = ({ contentData, template }) => {
  const numParsedParagraphs = useRef(0);
  const change = useRef(3);

  const content = React.useMemo(() => {
    const parserOpts: HTMLReactParserOptions = {
      replace: (domNode) => {
        if (domNode instanceof Element && domNode.attribs) {
          if (template === 2) {
            if (domNode.name === "script" && domNode?.attribs?.src === "https://platform.twitter.com/widgets.js") {
              return <></>;
            }
            if (domNode.name === "h2") {
              const index1 = getRandomInt(0, 100000);
              const index2 = getRandomInt(0, 100000);

              return (
                <>
                  <div className="justify-center items-center my-4 flex md:hidden">
                    <Ad adId="ww_mob_g_1" index={index1} />
                  </div>
                  <div className="justify-between items-center my-4 hidden md:flex">
                    <Ad adId="ww_g_ic_1" index={index1} />
                    <Ad adId="ww_g_ic_2" index={index2} />
                  </div>
                  <h2>{domToReact(domNode.childNodes, parserOpts)}</h2>
                </>
              );
            }
          } else if (template === 1) {
            if (
              ["p", "figure", "blockquote", "iframe"].includes(domNode.name) &&
              !domNode.attribs.class?.includes("twitter")
            ) {
              numParsedParagraphs.current++;
              if (numParsedParagraphs.current % 3 === 0) {
                const index = getRandomInt(0, 100000);
                return (
                  <>
                    <div className="justify-center items-center my-4 flex md:hidden">
                      <Ad adId="ww_mob_a_2" index={index} />
                    </div>
                    <p>{domToReact(domNode.childNodes, parserOpts)}</p>
                  </>
                );
              }

              if (numParsedParagraphs.current % change.current === 0) {
                const index = getRandomInt(0, 100000);
                change.current = change.current === 4 ? 3 : 4;
                return (
                  <>
                    <div className="justify-center items-center my-4 hidden md:flex">
                      <Ad adId="ww_a_ic_1" index={index} />
                    </div>
                    <p>{domToReact(domNode.childNodes, parserOpts)}</p>
                  </>
                );
              }
            }
          }
        }
      },
    };
    return parse(contentData, parserOpts);
  }, [contentData, template]);

  useEffect(() => {
    if (content) {
      const hasTwitterEmbeds = document.querySelectorAll(".twitter-tweet").length > 0;
      if (hasTwitterEmbeds) {
        const isScriptExist = document.getElementById("twitter-embed");

        //@ts-ignore
        const { twttr } = window;
        twttr && twttr.widgets.load();

        if (!isScriptExist) {
          const s = document.createElement("script");
          s.setAttribute("src", "https://platform.twitter.com/widgets.js");
          s.setAttribute("id", "twitter-embed");
          s.setAttribute("async", "true");
          document.head.appendChild(s);
        }
      }
    }
  }, [content]);

  return <article className="main-article mt-5 px-[15px] sm:px-0">{content}</article>;
};

export default ArticleContent;
