import { CircularProgress, Backdrop } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { animated as a, useSpring, useTransition } from "react-spring";

import {
  faGem,
  faRing,
  faPaw,
  faHammer,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Catalogue = () => {
  const videoRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const borzSprites = ["borz_stand_r", "borz_nod_r", "borz_work_r"];
  const [borzSprite, setBorzSprite] = useState(borzSprites[0]);
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
    config: { friction: 10 },
    from: { opacity: 0, scale: 0.7 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.7 },
  });
  useEffect(() => {
    loaded && circularSpringApi.start({ scale: 0.8 });
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
      if (!videoRef.current.paused) {
        console.log("force playing video...");
        videoRef.current.play();
      }
      setLoaded(true);
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
  }, []);

  const borzMouseEnter = () => {
    setBorzImg(borzSprites[1]);
    borzSpringApi.start({ scale: 1.05, rotateZ: -2 });
  };

  const borzMouseLeave = () => {
    setBorzImg(borzSprite);
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
    const onResize = () => {
      catalogueTitleSpringApi.start({
        x: handleResize(document.body.clientWidth),
      });
    };
    if (catalogueOpen) {
      catalogueTitleSpringApi.start({
        x: handleResize(document.body.clientWidth),
      });
      window.addEventListener("resize", onResize);
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
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }
  }, [catalogueOpen]);

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
    if (catalogueOpen && e.target !== catalogueRef.current) {
      catalogueWindowSpringApi.start({
        opacity: 0,
        scale: 0.8,
      });
      setCatalogue(false);
    }
  };

  const catalogueWindowEnter = () => {
    catalogueWindowSpringApi.start({
      scale: 1.02,
    });
    pawSpringApi.start({
      opacity: 1,
    });
  };

  const catalogueWindowLeave = () => {
    catalogueWindowSpringApi.start({
      scale: 1,
    });
    pawSpringApi.start({
      opacity: 0,
    });
  };

  return (
    <>
      <div
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        onMouseMove={mouseMovement}
        onClick={clickHandler}>
        <a.div style={videoSpring} className="w-full h-screen fixed -z-50">
          <video
            playsInline={true}
            ref={videoRef}
            autoPlay
            loop
            className="object-cover w-full h-full sepia-[.25] saturate-150 blur-sm scale-[1.1]">
            <source type="video/webm" src="/bg/voldun_a.webm"></source>
            <source type="video/mp4" src="/bg/voldun_a.mp4"></source>
          </video>
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
                className="absolute left-14 py-12">
                View Catalogue
              </button>
            </a.div>
          )}
          {catalogueOpen && (
            <a.div
              className="left-6 absolute portrait:top-64 w-4/12 portrait:w-1/2 h-4/6 top-40 bg-[#7e5f3620] backdrop-saturate-150 backdrop-blur-3xl rounded-3xl"
              style={catalogueWindowSpring}
              ref={catalogueRef}
              onMouseEnter={catalogueWindowEnter}
              onMouseLeave={catalogueWindowLeave}>
              <div className="p-4 text-slate-200 font-[Poppins] text-2xl">
                haha yes sparkly gems <FontAwesomeIcon icon={faGem} /> and rings{" "}
                <FontAwesomeIcon icon={faRing} />
                <a.div style={pawSpring}>
                  <FontAwesomeIcon icon={faPaw} />
                </a.div>
                <p className="py-4">
                  work in progress of course <FontAwesomeIcon icon={faHammer} />
                  <FontAwesomeIcon icon={faPencil} />
                </p>
              </div>
            </a.div>
          )}
          {borzTransition((style, i) => (
            <a.div
              className="portrait:-right-32 lg:right-0 top-36 fixed portrait:w-80 landscape:-right-24 sm:right-20 md:-right-20 sm:w-[400px] md:w-[500px]"
              style={style}>
              <a.div
                style={borzSpring}
                onMouseEnter={borzMouseEnter}
                onMouseLeave={borzMouseLeave}
                className="">
                <Image src={require(`/public/${i}_web.webp`)} alt="borz" />
              </a.div>
            </a.div>
          ))}
        </a.div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!loaded}>
        <a.div style={circularSpring}>
          <span className="absolute text-6xl p-16">🐍</span>
          <CircularProgress
            sx={{ color: "#b67f3733" }}
            size={200}
            className="rounded-3xl"
          />
        </a.div>
      </Backdrop>
    </>
  );
};

export default Catalogue;
