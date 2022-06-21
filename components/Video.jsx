import { useRef, useEffect } from "react";

const Video = ({ props }) => {
  const videoRef = useRef();
  useEffect(() => {
    if (!props.loaded) {
      const interval = setInterval(() => {
        let progressNum = 0;
        for (const i = 0; i < videoRef.current.buffered.length; i++) {
          progressNum = Math.floor(
            Math.round(
              (videoRef.current.buffered.end(i) / videoRef.current.duration) *
                100
            )
          );
        }
        props.setProgress(progressNum);
      }, 100);
      return () => clearInterval(interval);
    } else {
      props.setProgress(100);
    }
  }, []);

  useEffect(() => {
    props.progress === 100 && props.setVideoLoaded(true);
  }, [props]);

  return (
    <video
      playsInline={true}
      ref={videoRef}
      autoPlay
      muted
      loop
      className="object-cover w-full h-full sepia-[.25] saturate-150 blur-sm scale-[1.1]">
      <source type="video/webm" src="/bg/voldun_a.webm"></source>
      <source type="video/mp4" src="/bg/voldun_a.mp4"></source>
    </video>
  );
};

export default Video;
