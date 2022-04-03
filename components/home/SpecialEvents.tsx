import React from "react";
import { RiStarFill } from "react-icons/ri";

function SpecialEvents({ specialEvents }: { specialEvents: Array<string> }) {
  return (
    <div className="bg-main-black py-4 lg:py-1 px-2 shadow-md">
      <h3 className="lg:hidden uppercase text-2xl lg:text-xl font-semibold text-white text-center border-b-4 border-main max-w-lg mx-auto mb-4">
        ppv & special events schedule
      </h3>
      <ul>
        {specialEvents.map((specialEvent, i) => (
          <li key={specialEvent + i} className="py-2 text-center lg:flex items-center justify-center">
            <RiStarFill className="text-main w-3 h-3 mr-2 inline lg:block" />
            <div className="uppercase text-white text-[13px] flex-1 font-exo-nav inline lg:block">{specialEvent}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SpecialEvents;
