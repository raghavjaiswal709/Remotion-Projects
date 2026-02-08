import { registerRoot } from "remotion";
import { Composition } from "remotion";
import { Scene } from "./KQueues/Scene";
import { TrionicArrayScene } from "./TrionicArray/Scene";
import { SlidingWindowScene } from "./SlidingWindow/Scene";
import TwoPointersScene from "./TwoPointers/Scene";
import FastAndSlowScene from "./FastAndSlow/Scene";
import IntervalsScene from "./Intervals/Scene";
import MonotonicStackScene from "./MonotonicStack/Scene";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KQueues"
        component={Scene}
        durationInFrames={5160} // 172 seconds * 30 fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TrionicArray"
        component={TrionicArrayScene}
        durationInFrames={2675} // ~89 seconds * 30 fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlidingWindow"
        component={SlidingWindowScene}
        durationInFrames={1754} // ~58.48 seconds * 30 fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TwoPointers"
        component={TwoPointersScene}
        durationInFrames={1820} // ~60.68 seconds * 30 fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FastAndSlow"
        component={FastAndSlowScene}
        durationInFrames={3860} // ~64.34 seconds * 60 fps
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="Intervals"
        component={IntervalsScene}
        durationInFrames={4048} // ~67.46 seconds * 60 fps
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="MonotonicStack"
        component={MonotonicStackScene}
        durationInFrames={4338} // ~72.30 seconds * 60 fps
        fps={60}
        width={1080}
        height={1920}
      />
    </>
  );
};
