/**
 * Day 3 — "Apollo 8 vs Artemis II — Same Path, 56 Years Apart"
 * Series: HiddenWorld (Artemis II mini-series)
 * Total: 3368 frames @ 30fps = ~112.3s
 * Audio: public/audio/arti_first.wav (90.200s)
 *
 * SCENE SEQUENCE:
 * Scene01  frames    0–149    ScrollTimeline (SILENT)
 * Scene02  frames  150–342    Two crews 56 years apart
 * Scene03  frames  350–433    What changed?
 * Scene04  frames  445–592    Day three intro
 * Scene05  frames  594–857    Last day recap (Artemis II importance)
 * Scene06  frames  859–1070   Apollo 8 December 1968
 * Scene07  frames 1072–1223   No landing, just a loop
 * Scene08  frames 1225–1356   Artemis 2025
 * Scene09  frames 1358–1501   Four astronauts trajectory
 * Scene10  frames 1503–1760   Fundamental question — survival
 * Scene11  frames 1762–1880   Unrecognizable technology
 * Scene12  frames 1882–2022   Wristwatch computers
 * Scene13  frames 2024–2173   Radiation detection
 * Scene14  frames 2175–2378   Trajectory adjustment + comms
 * Scene15  frames 2380–2534   Different civilization
 * Scene16  frames 2536–2696   56 years refusing to stop
 * Scene17  frames 2698–2916   Tomorrow teaser — abort button
 * Scene18  frames 2886–3005   Key Takeaway
 * Scene19  frames 3006–3367   Outro + next day preview
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_ScrollTimeline } from './frames/Scene01_ScrollTimeline';
import { Scene02_TwoCrews } from './frames/Scene02_TwoCrews';
import { Scene03_WhatChanged } from './frames/Scene03_WhatChanged';
import { Scene04_DayThreeCard } from './frames/Scene04_DayThreeCard';
import { Scene05_LastDayRecap } from './frames/Scene05_LastDayRecap';
import { Scene06_Apollo8December } from './frames/Scene06_Apollo8December';
import { Scene07_NoLandingJustALoop } from './frames/Scene07_NoLandingJustALoop';
import { Scene08_Artemis2025 } from './frames/Scene08_Artemis2025';
import { Scene09_FourAstronauts } from './frames/Scene09_FourAstronauts';
import { Scene10_FundamentalQuestion } from './frames/Scene10_FundamentalQuestion';
import { Scene11_Unrecognizable } from './frames/Scene11_Unrecognizable';
import { Scene12_WristwatchComputers } from './frames/Scene12_WristwatchComputers';
import { Scene13_RadiationDetection } from './frames/Scene13_RadiationDetection';
import { Scene14_AdjustTrajectory } from './frames/Scene14_AdjustTrajectory';
import { Scene15_DifferentCivilization } from './frames/Scene15_DifferentCivilization';
import { Scene16_FiftySixYears } from './frames/Scene16_FiftySixYears';
import { Scene17_TomorrowTeaser } from './frames/Scene17_TomorrowTeaser';
import { Scene18_KeyTakeaway } from './frames/Scene18_KeyTakeaway';
import { Scene19_Outro } from './frames/Scene19_Outro';

export const ArtemisDay3Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      {/* Audio starts at composition frame 150 (after silent scroll) */}
      <Sequence from={150} durationInFrames={2706}>
        <Audio src={staticFile('audio/arti_first.wav')} startFrom={0} />
      </Sequence>

      {/* Scene 01 — Scrolling Timeline (SILENT) */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_ScrollTimeline currentDay={3} totalDays={100} seriesTitle="HIDDEN WORLD SECRETS" />
      </Sequence>

      {/* Scene 02 */}
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_TwoCrews />
      </Sequence>

      {/* Scene 03 */}
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_WhatChanged />
      </Sequence>

      {/* Scene 04 */}
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_DayThreeCard />
      </Sequence>

      {/* Scene 05 */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_LastDayRecap />
      </Sequence>

      {/* Scene 06 */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_Apollo8December />
      </Sequence>

      {/* Scene 07 */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_NoLandingJustALoop />
      </Sequence>

      {/* Scene 08 */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_Artemis2025 />
      </Sequence>

      {/* Scene 09 */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_FourAstronauts />
      </Sequence>

      {/* Scene 10 */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_FundamentalQuestion />
      </Sequence>

      {/* Scene 11 */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_Unrecognizable />
      </Sequence>

      {/* Scene 12 */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_WristwatchComputers />
      </Sequence>

      {/* Scene 13 */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_RadiationDetection />
      </Sequence>

      {/* Scene 14 */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_AdjustTrajectory />
      </Sequence>

      {/* Scene 15 */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_DifferentCivilization />
      </Sequence>

      {/* Scene 16 */}
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_FiftySixYears />
      </Sequence>

      {/* Scene 17 */}
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_TomorrowTeaser />
      </Sequence>

      {/* Scene 18 — Key Takeaway */}
      <Sequence from={SCENE_TIMING.s_takeaway.from} durationInFrames={SCENE_TIMING.s_takeaway.duration} premountFor={30}>
        <Scene18_KeyTakeaway />
      </Sequence>

      {/* Scene 19 — Outro */}
      <Sequence from={SCENE_TIMING.s_outro.from} durationInFrames={SCENE_TIMING.s_outro.duration} premountFor={30}>
        <Scene19_Outro
          currentDay={3}
          nextDay={4}
          nextTopic="The Abort Button"
          seriesTitle="HIDDEN WORLD SECRETS"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
