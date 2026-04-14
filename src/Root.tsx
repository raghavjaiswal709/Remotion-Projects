import React from "react";
import { Composition, Folder } from "remotion";
import { AiDay27Scene } from "./AiDay27/Scene";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Agentic AI Series ───────────────────────────────── */}
      <Folder name="AI-Series">
        <Composition
          id="AiDay27"
          component={AiDay27Scene}
          durationInFrames={3040}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
