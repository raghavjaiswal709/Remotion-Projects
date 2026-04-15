import React from "react";
import { Composition } from "remotion";
import { AiDay27Scene } from "./AiDay27/Scene";
import { JavaDay38Scene } from "./JavaDay38/Scene";
import { JavaDay39Scene } from "./JavaDay39/Scene";
import { JavaDay40Scene } from "./JavaDay40/Scene";
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
    </>
  );
};
