import React from "react";
import { Composition } from "remotion";
import { AiDay27Scene } from "./AiDay27/Scene";
import { Day28Scene as AiDay28Scene } from "./AiDay28/Scene";
import { AiDay29Scene } from "./AiDay29/Scene";
import { JavaDay38Scene } from "./JavaDay38/Scene";
import { JavaDay39Scene } from "./JavaDay39/Scene";
import { JavaDay40Scene } from "./JavaDay40/Scene";
import { JavaDay41Scene } from "./JavaDay41/Scene";
import { JavaDay42Scene } from "./JavaDay42/Scene";
import { JavaDay43Scene } from "./JavaDay43/Scene";
import { JavaDay44Scene } from "./JavaDay44/Scene";
import { JavaDay45Scene } from "./JavaDay45/Scene";
import { JavaDay46Scene } from "./JavaDay46/Scene";
import { JavaDay47Scene } from "./JavaDay47/Scene";
import { JavaDay48Scene } from "./JavaDay48/Scene";
import { AiDay30Scene } from "./AiDay30/Scene";
import { AiDay31Scene } from "./AiDay31/Scene";
import { AiDay32Scene } from "./AiDay32/Scene";
import { Day33Scene as AiDay33Scene } from "./AiDay33/Scene";
import { AiDay34Scene } from "./AiDay34/Scene";
import { AiDay35Scene } from "./AiDay35/Scene";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Agentic AI Series ───────────────────────────────── */}
      <Composition
        id="AiDay27"
        component={AiDay27Scene}
        durationInFrames={2371}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiDay28"
        component={AiDay28Scene}
        durationInFrames={2453}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiDay29"
        component={AiDay29Scene}
        durationInFrames={2116}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiDay30"
        component={AiDay30Scene}
        durationInFrames={2323}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiDay31"
        component={AiDay31Scene}
        durationInFrames={2659}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiDay32"
        component={AiDay32Scene}
        durationInFrames={2536}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiDay33"
        component={AiDay33Scene}
        durationInFrames={2675}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="AiDay34"
        component={AiDay34Scene}
        durationInFrames={2660}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiDay35"
        component={AiDay35Scene}
        durationInFrames={2388}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Java OOP Series ─────────────────────────────────── */}
      <Composition
        id="JavaDay38"
        component={JavaDay38Scene}
        durationInFrames={2447}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay39"
        component={JavaDay39Scene}
        durationInFrames={2698}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay40"
        component={JavaDay40Scene}
        durationInFrames={2729}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay41"
        component={JavaDay41Scene}
        durationInFrames={3502}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay42"
        component={JavaDay42Scene}
        durationInFrames={3173}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay43"
        component={JavaDay43Scene}
        durationInFrames={3236}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay44"
        component={JavaDay44Scene}
        durationInFrames={2216}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay45"
        component={JavaDay45Scene}
        durationInFrames={2358}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay46"
        component={JavaDay46Scene}
        durationInFrames={2324}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay47"
        component={JavaDay47Scene}
        durationInFrames={2641}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JavaDay48"
        component={JavaDay48Scene}
        durationInFrames={2683}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
