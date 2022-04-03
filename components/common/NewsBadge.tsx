import React from "react";

interface NewsBadgeProps {
  text: string;
  colorText?: "red" | "white";
}

function NewsBadge({ text, colorText = "red" }: NewsBadgeProps) {
  return (
    <div
      className={`leading-[1] font-quattrocento-sans font-bold mb-1 ${
        colorText === "white" ? "text-white" : "text-main"
      }`}
    >
      <div className="inline-block border-main border rounded-sm uppercase text-[10px] font-semibold px-1.5 pt-1 pb-0.5">
        {text}
      </div>
    </div>
  );
}

export default NewsBadge;
