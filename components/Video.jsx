import { useRef } from "react";

const Video = ({ videoRef }) => {
  return (
    <video
      playsInline={true}
      autoPlay
      loop
      className="object-cover w-full h-full sepia-[.25] saturate-150 blur-sm scale-[1.1]"
      ref={videoRef}>
      <source type="video/webm" src="/bg/voldun_a.webm"></source>
      <source type="video/mp4" src="/bg/voldun_a.mp4"></source>
    </video>
  );
};

export default Video;
