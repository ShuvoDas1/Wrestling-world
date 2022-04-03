import React from "react";

interface SectionTitleProps {
  title: string;
  className?: string;
  labelPosition?: "right" | "left" | "center";
}

const labelPositionClassNames = {
  right: "justify-end",
  left: "justify-start",
  center: "justify-center",
};

function SectionTitle({ title, className, labelPosition = "left" }: SectionTitleProps) {
  return (
    <div className="relative mb-1 mx-4 lg:mx-0">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-4 border-main" />
      </div>
      <h2 className={`relative flex ${labelPositionClassNames[labelPosition]}`}>
        <span
          className={`${
            labelPosition === "center" ? "px-2" : labelPosition === "right" ? "pl-2" : "pr-2"
          } pr-4 bg-gray-100 text-2xl lg:text-xl font-semibold uppercase ${className}`}
        >
          {title}
        </span>
      </h2>
    </div>
  );
}

export default SectionTitle;
