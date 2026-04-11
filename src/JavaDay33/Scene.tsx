/**
 * Day 33 — "@Override Annotation"
 * Series: Java (National Railway)
 * Total: 2817 frames @ 30fps = ~93.9s
 * Audio: public/audio/java33.wav
 *
 * SCENE SEQUENCE:
 * Scene01  frames    0–149   ScrollTimeline (SILENT)
 * Scene02  frames  150–293   Day intro
 * Scene03  frames  294–459   Recap yesterday
 * Scene04  frames  463–574   Today's topic
 * Scene05  frames  579–865   Override mechanics
 * Scene06  frames  863–925   Typo question
 * Scene07  frames  923–1136  Lowercase f problem
 * Scene08  frames 1132–1213  Silent failure
 * Scene09  frames 1214–1305  Annotation solves
 * Scene10  frames 1304–1401  Place above
 * Scene11  frames 1397–1585  Compiler checks
 * Scene12  frames 1583–1681  Does not compile
 * Scene13  frames 1679–1939  Typo compile error
 * Scene14  frames 1943–2047  Does not change
 * Scene15  frames 2045–2211  Protects intention
 * Scene16  frames 2215–2322  One annotation
 * Scene17  frames 2335–2454  Key Takeaway
 * Scene18  frames 2455–2816  Outro
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_ScrollTimeline } from './frames/Scene01_ScrollTimeline';
import { Scene02_DayIntro } from './frames/Scene02_DayIntro';
import { Scene03_RecapYesterday } from './frames/Scene03_RecapYesterday';
import { Scene04_TodayTopic } from './frames/Scene04_TodayTopic';
import { Scene05_OverrideMechanics } from './frames/Scene05_OverrideMechanics';
import { Scene06_TypoQuestion } from './frames/Scene06_TypoQuestion';
import { Scene07_LowercaseF } from './frames/Scene07_LowercaseF';
import { Scene08_SilentFailure } from './frames/Scene08_SilentFailure';
import { Scene09_AnnotationSolves } from './frames/Scene09_AnnotationSolves';
import { Scene10_PlaceAbove } from './frames/Scene10_PlaceAbove';
import { Scene11_CompilerChecks } from './frames/Scene11_CompilerChecks';
import { Scene12_DoesNotCompile } from './frames/Scene12_DoesNotCompile';
import { Scene13_TypoCompileError } from './frames/Scene13_TypoCompileError';
import { Scene14_DoesNotChange } from './frames/Scene14_DoesNotChange';
import { Scene15_ProtectsIntention } from './frames/Scene15_ProtectsIntention';
import { Scene16_OneAnnotation } from './frames/Scene16_OneAnnotation';
import { Scene17_KeyTakeaway } from './frames/Scene17_KeyTakeaway';
import { Scene18_Outro } from './frames/Scene18_Outro';

export const JavaDay33Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>

      {/* Audio starts at frame 150 (after silent scroll) */}
      <Sequence from={150} durationInFrames={2155}>
        <Audio src={staticFile('audio/java33.wav')} startFrom={0} />
      </Sequence>

      {/* Scene 01 — Scrolling Timeline (SILENT) */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_ScrollTimeline currentDay={33} seriesTitle="NATIONAL RAILWAY · JAVA" />
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

      {/* Scene 05 — Override mechanics */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_OverrideMechanics />
      </Sequence>

      {/* Scene 06 — Typo question */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_TypoQuestion />
      </Sequence>

      {/* Scene 07 — Lowercase f problem */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_LowercaseF />
      </Sequence>

      {/* Scene 08 — Silent failure */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_SilentFailure />
      </Sequence>

      {/* Scene 09 — Annotation solves */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_AnnotationSolves />
      </Sequence>

      {/* Scene 10 — Place above */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_PlaceAbove />
      </Sequence>

      {/* Scene 11 — Compiler checks */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_CompilerChecks />
      </Sequence>

      {/* Scene 12 — Does not compile */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_DoesNotCompile />
      </Sequence>

      {/* Scene 13 — Typo compile error */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_TypoCompileError />
      </Sequence>

      {/* Scene 14 — Does not change */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_DoesNotChange />
      </Sequence>

      {/* Scene 15 — Protects intention */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_ProtectsIntention />
      </Sequence>

      {/* Scene 16 — One annotation */}
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_OneAnnotation />
      </Sequence>

      {/* Scene 17 — Key Takeaway */}
      <Sequence from={SCENE_TIMING.s_takeaway.from} durationInFrames={SCENE_TIMING.s_takeaway.duration} premountFor={30}>
        <Scene17_KeyTakeaway />
      </Sequence>

      {/* Scene 18 — Outro */}
      <Sequence from={SCENE_TIMING.s_outro.from} durationInFrames={SCENE_TIMING.s_outro.duration} premountFor={30}>
        <Scene18_Outro
          currentDay={33}
          nextDay={34}
          nextTopic="Covariant Return Type"
          seriesTitle="NATIONAL RAILWAY · JAVA"
        />
      </Sequence>

    </AbsoluteFill>
  );
};
