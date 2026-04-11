/**
 * Day 34 — "Covariant Return Type"
 * Series: Java (National Railway)
 * Total: 3146 frames @ 30fps = ~104.9s
 * Audio: public/audio/java34.wav (82.8s = 2484 frames)
 *
 * SCENE SEQUENCE:
 * Scene01  frames    0–149   ScrollTimeline (SILENT)
 * Scene02  frames  150–298   Day intro
 * Scene03  frames  305–523   Recap yesterday
 * Scene04  frames  530–653   Today's topic
 * Scene05  frames  652–859   Base class
 * Scene06  frames  842–1097  Child override
 * Scene07  frames 1095–1223  Subtype intro
 * Scene08  frames 1231–1504  Covariant explained
 * Scene09  frames 1505–1667  More specific
 * Scene10  frames 1650–1835  Legal because
 * Scene11  frames 1833–1934  Contract not broken
 * Scene12  frames 1933–2058  More precise
 * Scene13  frames 2071–2267  No casting
 * Scene14  frames 2274–2437  No surprises
 * Scene15  frames 2420–2565  Narrow not widen
 * Scene16  frames 2566–2651  Summary
 * Scene17  frames 2664–2783  Key Takeaway
 * Scene18  frames 2784–3145  Outro
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_ScrollTimeline } from './frames/Scene01_ScrollTimeline';
import { Scene02_DayIntro } from './frames/Scene02_DayIntro';
import { Scene03_RecapYesterday } from './frames/Scene03_RecapYesterday';
import { Scene04_TodayTopic } from './frames/Scene04_TodayTopic';
import { Scene05_BaseClass } from './frames/Scene05_BaseClass';
import { Scene06_ChildOverride } from './frames/Scene06_ChildOverride';
import { Scene07_SubtypeIntro } from './frames/Scene07_SubtypeIntro';
import { Scene08_CovariantExplained } from './frames/Scene08_CovariantExplained';
import { Scene09_MoreSpecific } from './frames/Scene09_MoreSpecific';
import { Scene10_LegalBecause } from './frames/Scene10_LegalBecause';
import { Scene11_ContractNotBroken } from './frames/Scene11_ContractNotBroken';
import { Scene12_MorePrecise } from './frames/Scene12_MorePrecise';
import { Scene13_NoCasting } from './frames/Scene13_NoCasting';
import { Scene14_NoSurprises } from './frames/Scene14_NoSurprises';
import { Scene15_NarrowNotWiden } from './frames/Scene15_NarrowNotWiden';
import { Scene16_Summary } from './frames/Scene16_Summary';
import { Scene17_KeyTakeaway } from './frames/Scene17_KeyTakeaway';
import { Scene18_Outro } from './frames/Scene18_Outro';

export const JavaDay34Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>

      {/* Audio starts at frame 150 (after silent scroll) — 82.8s = 2484 frames */}
      <Sequence from={150} durationInFrames={2484}>
        <Audio src={staticFile('audio/java34.wav')} startFrom={0} />
      </Sequence>

      {/* Scene 01 — Scrolling Timeline (SILENT) */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_ScrollTimeline currentDay={34} seriesTitle="NATIONAL RAILWAY · JAVA" />
      </Sequence>

      {/* Scene 02 — Day intro */}
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_DayIntro />
      </Sequence>

      {/* Scene 03 — Recap yesterday */}
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_RecapYesterday />
      </Sequence>

      {/* Scene 04 — Today's topic */}
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_TodayTopic />
      </Sequence>

      {/* Scene 05 — Base class */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_BaseClass />
      </Sequence>

      {/* Scene 06 — Child override */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_ChildOverride />
      </Sequence>

      {/* Scene 07 — Subtype intro */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_SubtypeIntro />
      </Sequence>

      {/* Scene 08 — Covariant explained */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_CovariantExplained />
      </Sequence>

      {/* Scene 09 — More specific */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_MoreSpecific />
      </Sequence>

      {/* Scene 10 — Legal because */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_LegalBecause />
      </Sequence>

      {/* Scene 11 — Contract not broken */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_ContractNotBroken />
      </Sequence>

      {/* Scene 12 — More precise */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_MorePrecise />
      </Sequence>

      {/* Scene 13 — No casting */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_NoCasting />
      </Sequence>

      {/* Scene 14 — No surprises */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_NoSurprises />
      </Sequence>

      {/* Scene 15 — Narrow not widen */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_NarrowNotWiden />
      </Sequence>

      {/* Scene 16 — Summary */}
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_Summary />
      </Sequence>

      {/* Scene 17 — Key Takeaway */}
      <Sequence from={SCENE_TIMING.s_takeaway.from} durationInFrames={SCENE_TIMING.s_takeaway.duration} premountFor={30}>
        <Scene17_KeyTakeaway />
      </Sequence>

      {/* Scene 18 — Outro */}
      <Sequence from={SCENE_TIMING.s_outro.from} durationInFrames={SCENE_TIMING.s_outro.duration} premountFor={30}>
        <Scene18_Outro
          currentDay={34}
          nextDay={35}
          nextTopic="final variable"
          seriesTitle="NATIONAL RAILWAY · JAVA"
        />
      </Sequence>

    </AbsoluteFill>
  );
};
