/**
 * Day 32 — "Method Overriding"
 * Series: Java (National Railway OOPs)
 * Total: 3035 frames @ 30fps = ~101.2s
 * Audio: public/audio/java32.wav
 *
 * SCENE SEQUENCE:
 * Scene01  frames     0–149   ScrollTimeline (SILENT)
 * Scene02  frames   150–281   Day Intro
 * Scene03  frames   283–459   Static Block Recall
 * Scene04  frames   465–562   Method Overriding Title
 * Scene05  frames   565–693   Base Train CalcFare
 * Scene06  frames   694–864   Express Premium Pricing
 * Scene07  frames   857–966   Metro Slabs
 * Scene08  frames   961–1064  Fare Logic Different
 * Scene09  frames  1075–1266  Overriding Definition
 * Scene10  frames  1265–1393  Same Name Different Impl
 * Scene11  frames  1404–1685  Call CalcFare Express
 * Scene12  frames  1674–1830  Runtime Decision
 * Scene13  frames  1834–2109  Calling Code No Know
 * Scene14  frames  2105–2358  Railway Fare Rules
 * Scene15  frames  2351–2522  Same Diff Overriding
 * Scene16  frames  2553–2672  KeyTakeaway
 * Scene17  frames  2673–3034  Outro
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_ScrollTimeline } from './frames/Scene01_ScrollTimeline';
import { Scene02_DayIntro } from './frames/Scene02_DayIntro';
import { Scene03_StaticBlockRecall } from './frames/Scene03_StaticBlockRecall';
import { Scene04_MethodOverridingTitle } from './frames/Scene04_MethodOverridingTitle';
import { Scene05_BaseTrainCalcFare } from './frames/Scene05_BaseTrainCalcFare';
import { Scene06_ExpressPremium } from './frames/Scene06_ExpressPremium';
import { Scene07_MetroSlabs } from './frames/Scene07_MetroSlabs';
import { Scene08_FareLogicDifferent } from './frames/Scene08_FareLogicDifferent';
import { Scene09_OverridingDefinition } from './frames/Scene09_OverridingDefinition';
import { Scene10_SameNameDifferentImpl } from './frames/Scene10_SameNameDifferentImpl';
import { Scene11_CallCalcFareExpress } from './frames/Scene11_CallCalcFareExpress';
import { Scene12_RuntimeDecision } from './frames/Scene12_RuntimeDecision';
import { Scene13_CallingCodeNoKnow } from './frames/Scene13_CallingCodeNoKnow';
import { Scene14_RailwayFareRules } from './frames/Scene14_RailwayFareRules';
import { Scene15_SameDiffOverriding } from './frames/Scene15_SameDiffOverriding';
import { Scene16_KeyTakeaway } from './frames/Scene16_KeyTakeaway';
import { Scene17_Outro } from './frames/Scene17_Outro';

export const JavaDay32Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>

      {/* Audio starts at composition frame 150 (after silent scroll) */}
      <Sequence from={150} durationInFrames={2373}>
        <Audio src={staticFile('audio/java32.wav')} startFrom={0} />
      </Sequence>

      {/* Scene 01 — Scrolling Day Timeline (SILENT) */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_ScrollTimeline currentDay={32} seriesTitle="NATIONAL RAILWAY · JAVA" />
      </Sequence>

      {/* Scene 02 — Day Intro */}
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_DayIntro />
      </Sequence>

      {/* Scene 03 — Static Block Recall */}
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_StaticBlockRecall />
      </Sequence>

      {/* Scene 04 — Method Overriding Title */}
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_MethodOverridingTitle />
      </Sequence>

      {/* Scene 05 — Base Train calculateFare() */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_BaseTrainCalcFare />
      </Sequence>

      {/* Scene 06 — Express Premium Pricing */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_ExpressPremium />
      </Sequence>

      {/* Scene 07 — Metro Slabs */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_MetroSlabs />
      </Sequence>

      {/* Scene 08 — Fare Logic Different */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_FareLogicDifferent />
      </Sequence>

      {/* Scene 09 — Overriding Definition */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_OverridingDefinition />
      </Sequence>

      {/* Scene 10 — Same Name Different Impl */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_SameNameDifferentImpl />
      </Sequence>

      {/* Scene 11 — Call CalcFare Express */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_CallCalcFareExpress />
      </Sequence>

      {/* Scene 12 — Runtime Decision */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_RuntimeDecision />
      </Sequence>

      {/* Scene 13 — Calling Code No Know */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_CallingCodeNoKnow />
      </Sequence>

      {/* Scene 14 — Railway Fare Rules */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_RailwayFareRules />
      </Sequence>

      {/* Scene 15 — Same Diff Overriding */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_SameDiffOverriding />
      </Sequence>

      {/* Scene 16 — Key Takeaway */}
      <Sequence from={SCENE_TIMING.s_takeaway.from} durationInFrames={SCENE_TIMING.s_takeaway.duration} premountFor={30}>
        <Scene16_KeyTakeaway />
      </Sequence>

      {/* Scene 17 — Outro */}
      <Sequence from={SCENE_TIMING.s_outro.from} durationInFrames={SCENE_TIMING.s_outro.duration} premountFor={30}>
        <Scene17_Outro
          currentDay={32}
          nextDay={33}
          nextTopic="@Override Annotation"
          seriesTitle="NATIONAL RAILWAY · JAVA"
        />
      </Sequence>

    </AbsoluteFill>
  );
};
