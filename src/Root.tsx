import React from "react";
import { Composition } from "remotion";
import { Day23Scene } from "./Day23/Scene";
import { Day24Scene } from "./Day24/Scene";
import { Day25Scene } from "./Day25/Scene";
import { Day26Scene } from "./Day26/Scene";
import { Day27Scene } from "./Day27/Scene";
import { MoonScene } from "./Moon/Scene";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MoonShadow"
        component={MoonScene}
        durationInFrames={2903}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HiddenWorldDay23"
        component={Day23Scene}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HiddenWorldDay24"
        component={Day24Scene}
        durationInFrames={2250}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HiddenWorldDay25"
        component={Day25Scene}
        durationInFrames={2250}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HiddenWorldDay26"
        component={Day26Scene}
        durationInFrames={2200}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HiddenWorldDay27"
        component={Day27Scene}
        durationInFrames={2842}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
