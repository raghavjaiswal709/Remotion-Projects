import React from "react";
import { Composition } from "remotion";
import { Day23Scene } from "./Day23/Scene";
import { Day24Scene } from "./Day24/Scene";
import { Day25Scene } from "./Day25/Scene";
import { Day26Scene } from "./Day26/Scene";
import { Day27Scene } from "./Day27/Scene";
import { JavaDay32Scene } from "./JavaDay32/Scene";
import { JavaDay33Scene } from "./JavaDay33/Scene";
import { JavaDay34Scene } from "./JavaDay34/Scene";
import { ArtemisDay3Scene } from "./ArtemisDay3/Scene";
import { ArtemisDay4Scene } from "./ArtemisDay4/Scene";
import { ArtemisDay5Scene } from "./ArtemisDay5/Scene";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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

      {/* ── Java OOP Series ─────────────────────────────────── */}
      <Composition
        id="JavaDay32"
        component={JavaDay32Scene}
        durationInFrames={3035}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay33"
        component={JavaDay33Scene}
        durationInFrames={2817}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay34"
        component={JavaDay34Scene}
        durationInFrames={3146}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Artemis II Series ───────────────────────────────── */}
      <Composition
        id="ArtemisDay3"
        component={ArtemisDay3Scene}
        durationInFrames={3368}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ArtemisDay4"
        component={ArtemisDay4Scene}
        durationInFrames={3225}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ArtemisDay5"
        component={ArtemisDay5Scene}
        durationInFrames={3290}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
