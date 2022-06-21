import { CircularProgress, Backdrop, LinearProgress } from "@mui/material";
import { useState, useEffect, useRef, Suspense } from "react";
import { animated as a, useSpring, useTransition } from "react-spring";

import {
  faGem,
  faRing,
  faPaw,
  faHammer,
  faPencil,
  faXmark,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

import borzNodR from "/public/borz_nod_r_web.webp";
import borzStandR from "/public/borz_nod_r_web.webp";
import borzWorkR from "/public/borz_work_r_web.webp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
import Load from "./Load";

const CatalogueComponent = dynamic(
  () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./CatalogueList")), 2000);
    });
  },
  {
    ssr: false,
    suspense: true,
  }
);

const VideoComponent = dynamic(() => import("./Video"), { ssr: false });

const Catalogue = ({ data }) => {
  const [loaded, setLoaded] = useState(false);
  const borzSprites = [borzStandR.src, borzNodR.src, borzWorkR.src];
  const [borzSprite, setBorzSprite] = useState(borzSprites[0]);
  const [renderLoad, setRenderLoad] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const catalogueRef = useRef();
  const [borzImg, setBorzImg] = useState(borzSprite);
  const [catalogueOpen, setCatalogue] = useState(false);
  const [catalogueRender, setCatalogueRender] = useState(false);
  const [circularSpring, circularSpringApi] = useSpring(() => ({
    config: { friction: 10 },
    scale: 1,
  }));

  const [videoSpring, videoSpringApi] = useSpring(() => ({
    scale: 0.9,
    opacity: 0,
    x: 0,
    y: 0,
  }));

  const [catalogueSpring, catalogueSpringApi] = useSpring(() => ({
    scale: 0.9,
    opacity: 0,
  }));

  const [borzSpring, borzSpringApi] = useSpring(() => ({
    config: { friction: 10 },
    scale: 0.7,
    opacity: 0,
    rotateZ: 0,
    x: 0,
  }));

  const [catalogueTitleSpring, catalogueTitleSpringApi] = useSpring(() => ({
    config: { friction: 10 },
    scale: 0.8,
    opacity: 0,
    x: 0,
  }));

  const [catalogueWindowSpring, catalogueWindowSpringApi] = useSpring(() => ({
    config: { friction: 5 },
    opacity: 0,
    scale: 0.8,
    padding: 0,
  }));

  const [catalogueTextSpring, catalogueTextSpringApi] = useSpring(() => ({
    config: { friction: 15 },
    scale: 1,
    opacity: 1,
  }));

  const [pawSpring, pawSpringApi] = useSpring(() => ({
    opacity: 0,
  }));

  const borzTransition = useTransition(borzImg, {
    key: borzImg,
    config: { friction: 10 },
    from: { opacity: 0, scale: 0.7 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.7 },
  });

  useEffect(() => {
    loaded &&
      circularSpringApi.start({
        scale: 0.8,
        onRest: () => setRenderLoad(false),
      });
    loaded && videoSpringApi.start({ scale: 1.1, opacity: 1 });
    loaded && catalogueSpringApi.start({ scale: 1, opacity: 1 });
    loaded && borzSpringApi.start({ scale: 0.9, opacity: 1 });
    loaded && catalogueTitleSpringApi.start({ scale: 1, opacity: 1 });
  }, [loaded]);

  const mouseEnter = () => {
    videoSpringApi.start({ config: { friction: 10 }, scale: 1.2 });
  };

  const mouseLeave = () => {
    videoSpringApi.start({ config: { friction: 25 }, scale: 1, x: 0, y: 0 });
  };

  const catalogueTitleEnter = () => {
    catalogueTitleSpringApi.start({ scale: 1.1 });
  };

  const catalogueTitleLeave = () => {
    catalogueTitleSpringApi.start({ scale: 1 });
  };

  const mouseMovement = (e) => {
    videoSpringApi.start({
      config: { friction: 10 },
      x: -e.clientX * 0.02,
      y: -e.clientY * 0.02,
    });
  };

  useEffect(() => {
    const onPageLoad = () => {
      videoLoaded && setLoaded(true);
    };

    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      return () => {
        window.removeEventListener("load", onPageLoad);
      };
    }
  }, [videoLoaded]);

  const borzMouseEnter = () => {
    borzSpringApi.start({ scale: 1.05, rotateZ: 0 });
  };

  const borzMouseLeave = () => {
    borzSpringApi.start({ scale: 1, rotateZ: 0 });
  };

  const handleResize = (width) => {
    const num = Math.abs(width);
    let scale = 0;
    if (num > 1900) {
      scale = -document.body.clientWidth * 0.63;
    } else if (num > 1200) {
      scale = -document.body.clientWidth * 0.4;
    } else {
      scale = 0;
    }
    return scale;
  };

  useEffect(() => {
    if (catalogueOpen) {
      setCatalogueRender(true);
      setBorzSprite(borzSprites[2]);
      setBorzImg(borzSprites[2]);
      catalogueWindowSpringApi.start({
        opacity: 1,
        scale: 1,
      });
    } else {
      setBorzSprite(borzSprites[0]);
      setBorzImg(borzSprites[0]);
      catalogueTextSpringApi.start({
        opacity: 1,
        scale: 1,
      });
      catalogueTitleSpringApi.start({
        x: 0,
      });
    }
  }, [catalogueOpen]);

  useEffect(() => {
    const onResize = () => {
      if (catalogueRender) {
        catalogueTitleSpringApi.start({
          x: handleResize(document.body.clientWidth),
        });
      } else {
        catalogueTitleSpringApi.start({
          x: 0,
        });
      }
    };
    if (catalogueRender) {
      catalogueTitleSpringApi.start({
        x: handleResize(document.body.clientWidth),
      });
      window.addEventListener("resize", onResize);
    } else {
      catalogueTitleSpringApi.start({
        x: 0,
      });
    }
    return () => window.removeEventListener("resize", onResize);
  }, [catalogueRender]);

  const openCatalogue = () => {
    console.log(document.body.clientWidth);
    catalogueTextSpringApi.start({
      scale: 0.8,
      opacity: 0,
      config: { friction: 25 },
      onRest: () => setCatalogue(true),
    });
  };

  const clickHandler = (e) => {
    catalogueWindowSpringApi.start({
      opacity: 0,
      scale: 0.8,
    });
    setCatalogue(false);
  };

  const catalogueWindowEnter = () => {
    if (catalogueRender) {
      catalogueWindowSpringApi.start({
        scale: 1.02,
      });
      pawSpringApi.start({
        opacity: 1,
      });
    }
  };

  const catalogueWindowLeave = () => {
    if (catalogueRender) {
      catalogueWindowSpringApi.start({
        scale: 1,
      });
      pawSpringApi.start({
        opacity: 0,
      });
    }
  };

  const [catalogueExitSpring, catalogueExitSpringApi] = useSpring(() => ({
    config: { friction: 5 },
    scale: 1,
  }));

  const catalogueExitEnter = () => {
    catalogueRender && catalogueExitSpringApi.start({ scale: 1.7 });
  };

  const catalogueExitLeave = () => {
    catalogueRender && catalogueExitSpringApi.start({ scale: 1 });
  };

  const catalogueExitClick = () => {
    // reset the scale back when the catalogue closes
    setCatalogueRender(false);
    catalogueExitSpringApi.start({ scale: 1 });
    catalogueWindowSpringApi.start({
      config: { friction: 25 },
      scale: 0.9,
      opacity: 0,
      onRest: () => setCatalogue(false),
    });
  };

  const borzDrag = (e) => {
    const num = e.clientX - document.body.clientWidth + 200;
    if (num < 0) {
      return;
    }
    num *= 2;
    borzSpringApi.start({ x: num });
    const borzPos = borzSpring.x.get();
    if (borzPos > 200) {
      catalogueOpen ? catalogueExitClick() : openCatalogue();
    }
  };

  const borzMouseUp = () => {
    borzSpringApi.start({ x: 0 });
  };

  const borzMouseClick = () => {
    borzSpringApi.start({ x: 0 });
  };

  const progressTest = (e) => {
    console.log(e);
  };

  return (
    <>
      <div
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        onMouseMove={mouseMovement}>
        <a.div style={videoSpring} className="w-full h-screen fixed -z-50">
          <Suspense>
            <VideoComponent
              props={{
                loaded,
                progress,
                setProgress,
                videoSpring,
                setVideoLoaded,
              }}
            />
          </Suspense>
        </a.div>
        <div className="bg-[rgba(65,33,3,0.4)] w-full h-full absolute -z-20"></div>
        <a.div style={catalogueSpring} className="w-screen h-screen fixed">
          <a.div
            style={catalogueTitleSpring}
            className="absolute px-20 right-0 py-5">
            <div
              onMouseEnter={catalogueTitleEnter}
              onMouseLeave={catalogueTitleLeave}
              className="bg-[#7e5f3620] backdrop-saturate-150 backdrop-blur-3xl before:absolute before:bg-cover bg-blend-screen rounded-3xl">
              <div className="font-[Poppins] text-[#c7a360] text-4xl px-12 py-2">
                <div className="p-8 font-[Poppins] text-4xl">
                  <FontAwesomeIcon icon={faGem} /> <b>The Snek Catalogue</b>
                </div>
              </div>
            </div>
          </a.div>
          {!catalogueOpen && (
            <a.div
              style={catalogueTextSpring}
              className="text-white text-lg lg:left-48 portrait:text-sm portrait:w-48 sm:top-36 w-72 left-12 bottom-72 portrait:top-52 absolute font-[Poppins]">
              <p className="py-8 lg:text-8xl portrait:text-3xl sm:text-2xl">
                <b>Welcome.</b>
              </p>
              <p className="py-8">
                Here, you will find all assortments of my precious wares for
                sale, however it may come by.
              </p>
              <p>Feel free to gaze at your leisure.</p>
              <p>
                <b>(OOC information included!)</b>
              </p>
              <button
                onClick={openCatalogue}
                className="absolute left-14 my-12 p-4 bg-[rgba(75,54,26,0.4)] rounded-xl">
                View Catalogue
              </button>
            </a.div>
          )}
          {catalogueOpen && (
            <a.div
              className="left-6 absolute portrait:top-64 w-4/12 portrait:w-1/2 h-4/6 top-40 bg-[#7e5f3620] backdrop-saturate-150 backdrop-blur-3xl rounded-3xl"
              style={catalogueWindowSpring}
              onMouseEnter={catalogueWindowEnter}
              onMouseLeave={catalogueWindowLeave}>
              <div className="text-slate-200 font-[Poppins] text-2xl">
                <a.button
                  onMouseEnter={catalogueExitEnter}
                  onMouseLeave={catalogueExitLeave}
                  style={catalogueExitSpring}
                  onClick={catalogueExitClick}
                  className="absolute right-4 top-1">
                  <FontAwesomeIcon icon={faXmark} />
                </a.button>
                <div className="p-4">
                  haha yes sparkly gems <FontAwesomeIcon icon={faGem} /> and
                  rings <FontAwesomeIcon icon={faRing} />
                  <a.div style={pawSpring}>
                    <FontAwesomeIcon icon={faPaw} className="fa-bounce" />
                  </a.div>
                  <p className="py-4">
                    work in progress of course{" "}
                    <FontAwesomeIcon icon={faHammer} />
                    <FontAwesomeIcon icon={faPencil} />
                  </p>
                  <div>
                    <Suspense
                      fallback={<Load props={{ circularSpring, progress }} />}>
                      <CatalogueComponent />
                    </Suspense>
                    <div>
                      <button className="bottom-0 absolute mx-4 my-4 bg-[rgba(75,54,26,0.4)] p-2 rounded-xl disabled:text-slate-500">
                        <FontAwesomeIcon icon={faAngleLeft} />
                        <span className="px-2">Previous</span>
                      </button>
                      <button className="bottom-0 right-0 absolute mx-8 my-4 bg-[rgba(75,54,26,0.4)] p-2 rounded-xl disabled:text-slate-500">
                        <span className="px-2">Next</span>
                        <FontAwesomeIcon icon={faAngleRight} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </a.div>
          )}
          {borzTransition((style, i) => (
            <a.div
              onDragOver={borzDrag}
              onMouseUp={borzMouseUp}
              onDragEnd={borzMouseUp}
              onClick={borzMouseClick}
              onDragStart={(e) => {
                e.dataTransfer.setDragImage(new Image(), 0, 0);
              }}
              draggable="true"
              className="cursor-grab top-36 fixed z-30 -right-80 sm:-right-52 md:-right-48 lg:-right-24"
              style={style}>
              <a.div
                draggable="false"
                style={borzSpring}
                onMouseEnter={borzMouseEnter}
                onMouseLeave={borzMouseLeave}>
                <div
                  style={{ backgroundImage: `url(${i})` }}
                  className={`bg-cover w-[586px] h-[1080px]`}></div>
              </a.div>
            </a.div>
          ))}
        </a.div>
      </div>
      <div>
        <LinearProgress
          color="inherit"
          variant="determinate"
          value={progress}
          sx={{
            color: "#b67f37ff",
            zIndex: (theme) => theme.zIndex.drawer + 2,
          }}
        />
      </div>
      {renderLoad && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={!loaded}>
          <Load spring={circularSpring} progress={progress} />
        </Backdrop>
      )}
    </>
  );
};

export default Catalogue;
