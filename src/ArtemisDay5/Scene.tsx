/**
 * Day 5 — "Orion Splashdown"
 * Series: HiddenWorld (Artemis II mini-series)
 * Total: 3290 frames @ 30fps = ~109.7s
 * Audio: public/audio/arti_third.wav
 *
 * SCENE SEQUENCE:
 * Scene01  frames   0–149    ScrollTimeline (SILENT)
 * Scene02  frames 150–393    Advanced Spacecraft
 * Scene03  frames 401–536    Day Five Intro
 * Scene04  frames 536–842    Abort Recap
 * Scene05  frames 849–1171   Pacific Splashdown
 * Scene06  frames 1166–1230  Not Tradition
 * Scene07  frames 1237–1543  Deceleration Forces
 * Scene08  frames 1542–1735  Water Impact
 * Scene09  frames 1737–1993  Drogue Chutes
 * Scene10  frames 1994–2114  Main Parachutes
 * Scene11  frames 2109–2280  Splashdown
 * Scene12  frames 2281–2491  Recovery Ships
 * Scene13  frames 2489–2565  Secured Minutes
 * Scene14  frames 2564–2669  Looks Like 1969
 * Scene15  frames 2669–2795  Different World
 * Scene16  frames 2808–2927  Key Takeaway
 * Scene17  frames 2928–3289  Outro
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING, COLORS, TOTAL_FRAMES } from './helpers/timing';

import { Scene01_ScrollTimeline } from './frames/Scene01_ScrollTimeline';
import { Scene02_AdvancedSpacecraft } from './frames/Scene02_AdvancedSpacecraft';
import { Scene03_DayFiveIntro } from './frames/Scene03_DayFiveIntro';
import { Scene04_AbortRecap } from './frames/Scene04_AbortRecap';
import { Scene05_PacificSplashdown } from './frames/Scene05_PacificSplashdown';
import { Scene06_NotTradition } from './frames/Scene06_NotTradition';
import { Scene07_DecelerationForces } from './frames/Scene07_DecelerationForces';
import { Scene08_WaterImpact } from './frames/Scene08_WaterImpact';
import { Scene09_DrogueChutes } from './frames/Scene09_DrogueChutes';
import { Scene10_MainParachutes } from './frames/Scene10_MainParachutes';
import { Scene11_Splashdown } from './frames/Scene11_Splashdown';
import { Scene12_RecoveryShips } from './frames/Scene12_RecoveryShips';
import { Scene13_SecuredMinutes } from './frames/Scene13_SecuredMinutes';
import { Scene14_LooksLike1969 } from './frames/Scene14_LooksLike1969';
import { Scene15_DifferentWorld } from './frames/Scene15_DifferentWorld';
import { Scene16_KeyTakeaway } from './frames/Scene16_KeyTakeaway';
import { Scene17_Outro } from './frames/Scene17_Outro';

export const ArtemisDay5Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>

      {/* Audio starts at composition frame 150 (after silent scroll) */}
      <Sequence from={150} durationInFrames={2628}>
        <Audio src={staticFile('audio/arti_third.wav')} startFrom={0} />
      </Sequence>

      {/* Scene 01 — Scrolling Timeline (SILENT) */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_ScrollTimeline currentDay={5} totalDays={5} seriesTitle="ARTEMIS II · HIDDEN WORLD" />
      </Sequence>

      {/* Scene 02 — Advanced Spacecraft */}
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_AdvancedSpacecraft />
      </Sequence>

      {/* Scene 03 — Day Five Intro */}
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_DayFiveIntro />
      </Sequence>

      {/* Scene 04 — Abort Recap */}
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_AbortRecap />
      </Sequence>

      {/* Scene 05 — Pacific Splashdown */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_PacificSplashdown />
      </Sequence>

      {/* Scene 06 — Not Tradition */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_NotTradition />
      </Sequence>

      {/* Scene 07 — Deceleration Forces */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_DecelerationForces />
      </Sequence>

      {/* Scene 08 — Water Impact */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_WaterImpact />
      </Sequence>

      {/* Scene 09 — Drogue Chutes */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_DrogueChutes />
      </Sequence>

      {/* Scene 10 — Main Parachutes */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_MainParachutes />
      </Sequence>

      {/* Scene 11 — Splashdown */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_Splashdown />
      </Sequence>

      {/* Scene 12 — Recovery Ships */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_RecoveryShips />
      </Sequence>

      {/* Scene 13 — Secured Minutes */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_SecuredMinutes />
      </Sequence>

      {/* Scene 14 — Looks Like 1969 */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_LooksLike1969 />
      </Sequence>

      {/* Scene 15 — Different World */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_DifferentWorld />
      </Sequence>

      {/* Scene 16 — Key Takeaway */}
      <Sequence from={SCENE_TIMING.s_takeaway.from} durationInFrames={SCENE_TIMING.s_takeaway.duration} premountFor={30}>
        <Scene16_KeyTakeaway />
      </Sequence>

      {/* Scene 17 — Outro */}
      <Sequence from={SCENE_TIMING.s_outro.from} durationInFrames={SCENE_TIMING.s_outro.duration} premountFor={30}>
        <Scene17_Outro currentDay={5} seriesTitle="ARTEMIS II · HIDDEN WORLD" />
      </Sequence>

    </AbsoluteFill>
  );
};
