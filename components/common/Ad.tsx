import React, { useEffect } from "react";

import { useAdSlot } from "../../hooks/useAdSlot";
import ads from "../../utils/constants/ads";
import { useUI } from "../context";

function Ad({ adId, className, index }: { adId: string; className?: string; index?: number }) {
  const { isTransitioning } = useUI();
  //@ts-ignore
  const ad = ads[adId];

  const divId = `div-gpt-ad-${adId}_${index || 0}`;

  useAdSlot({
    mapping: ad.mapping,
    sizes: ad.sizes,
    id: adId,
    isTransitioning,
    index: index,
  });

  return <div className={className} id={divId} />;
}

export default Ad;
