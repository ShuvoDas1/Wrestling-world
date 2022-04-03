import React, { Dispatch, SetStateAction, useState, useEffect, useCallback } from "react";
import { RiPlayFill } from "react-icons/ri";
import Image from "next/image";
import YoutubeServices from "../../services/YoutubeServices";
import parseISO8601Duration from "../../utils/helpers/parseISO8601Duration";
import getYoutubeThumbnailUrl from "../../utils/helpers/getYoutubeThumbnailUrl";

interface VideoMetadata {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

function YoutubePlaylist({ youtubeVideoIds }: { youtubeVideoIds: Array<string> }) {
  const [videoMetadata, setVideoMetadata] = useState<Array<VideoMetadata>>([]);
  const [videoPlaying, setVideoPlaying] = useState<VideoMetadata>();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = useCallback(() => {
    setIsClicked(true);
  }, []);

  useEffect(() => {
    async function fetchVideoData() {
      const metadata: Array<VideoMetadata> = [];
      for (let i = 0; i < youtubeVideoIds.length; i++) {
        const id = youtubeVideoIds[i];
        const videoMetadata = await YoutubeServices.getVideoInfoFromId(id);

        // Format duration in ISO8601 to MM:SS
        let duration = "";
        const durationISO = videoMetadata.items[0]?.contentDetails.duration;
        if (durationISO) {
          duration = parseISO8601Duration(durationISO);
        }

        metadata.push({
          id,
          title: videoMetadata.items[0]?.snippet.title || "",
          duration,
          thumbnail: videoMetadata.items[0]?.snippet.thumbnails.default.url || "",
        });
      }
      setVideoMetadata(metadata);
      setVideoPlaying(metadata[0]);
    }
    fetchVideoData();
  }, [youtubeVideoIds]);

  return (
    <>
      <div>
        {/* Video */}
        <div className={"aspect-w-16 aspect-h-9"}>
          {!isClicked ? (
            <button className="block group" aria-label="Play" onClick={handleClick}>
              <Image
                width={512}
                height={288}
                src={getYoutubeThumbnailUrl(videoPlaying?.id || youtubeVideoIds[0], "hqdefault")}
                alt="Embedded youtube"
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg version="1.1" viewBox="0 0 68 48" width="68px" height="48px" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                    fill="currentColor"
                    className="opacity-50 group-hover:opacity-100 transition-colors group-hover:text-[#f00]"
                  ></path>
                  <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                </svg>
              </div>
            </button>
          ) : (
            <iframe
              loading="lazy"
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${videoPlaying?.id || youtubeVideoIds[0]}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
              
            />
          )}
        </div>
        {/* Controls and title */}
        <div className="bg-main text-white p-2 flex">
          <div className="flex items-center px-2 mr-4">
            <div>
              <RiPlayFill className="w-8 h-8" />
            </div>
          </div>
          <div className="flex flex-col justify-start font-khand-headers">
            <div className="text-[13px] font-medium uppercase leading-3">{videoPlaying?.title || ""}</div>
            <small className="text-[11px]">{videoPlaying?.duration || ""}</small>
          </div>
        </div>
        {/* Video List */}
        <div className="bg-[#222222] max-h-[238px] overflow-y-auto shadow-inner">
          {videoMetadata.map((videoData) => (
            <VideoItem
              key={videoData.id}
              videoData={videoData}
              videoPlaying={videoPlaying}
              //@ts-ignore
              setVideoPlaying={setVideoPlaying}
            />
          ))}
        </div>
      </div>
    </>
  );
}

interface VideoItemProps {
  videoData: VideoMetadata;
  videoPlaying?: VideoMetadata;
  setVideoPlaying: Dispatch<SetStateAction<VideoMetadata>>;
}

function VideoItem({ videoData, videoPlaying, setVideoPlaying }: VideoItemProps) {
  const isThisVideoPlaying = videoPlaying?.id === videoData.id;

  return (
    <button
      onClick={() => setVideoPlaying(videoData)}
      className={`py-2 text-left px-4 flex w-full hover:bg-[#333333] space-x-4 ${
        isThisVideoPlaying && "bg-[#404040] border-l-4 border-main"
      }`}
    >
      {/* Thumbnail */}
      <div className="overflow-hidden relative h-[40px] flex-shrink-0">
        <div className="">
          <Image
            objectPosition="0px -7px"
            src={getYoutubeThumbnailUrl(videoData.id, "default")}
            width={72}
            height={54}
            alt="Video Thumbnail"
          />
        </div>
      </div>
      {/* Title - Duration */}
      <div className="flex flex-col text-white font-khand-headers">
        <div className="text-[13px] font-medium leading-3 uppercase">{videoData.title}</div>
        <small className="text-[10px] text-gray-300">{videoData.duration}</small>
      </div>
    </button>
  );
}

export default YoutubePlaylist;
