import React, { ReactNode } from "react";

function PostTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[26px] sm:text-[30px] lg:text-[32px] leading-[1.1] font-bold">{children}</h1>;
}

export default PostTitle;
