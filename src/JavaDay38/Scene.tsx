/**
 * Day 38 — "Static Variable"
 * Series: Java / National Railway
 * Total: 2447 frames @ 30fps = ~81.6s (= audio duration exactly)
 * Audio: public/audio/java38.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene01 frames    0–202   Day intro
 * Scene02 frames  203–397   Final class recap
 * Scene03 frames  398–484   Static variable intro
 * Scene04 frames  485–639   Instance variables
 * Scene05 frames  640–836   Control room needs
 * Scene06 frames  837–1024  How many trains
 * Scene07 frames 1025–1237  Belongs to class
 * Scene08 frames 1238–1428  Static int declaration
 * Scene09 frames 1429–1629  Counter increments
 * Scene10 frames 1630–1837  Counter decrements
 * Scene11 frames 1838–2018  One copy shared
 * Scene12 frames 2019–2200  Instance vs static
 * Scene13 frames 2201–2385  Method teaser
 * Scene14 frames 2386–2446  Cover next
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_FinalClassRecap } from './frames/Scene02_FinalClassRecap';
import { Scene03_StaticVariableIntro } from './frames/Scene03_StaticVariableIntro';
import { Scene04_InstanceVariables } from './frames/Scene04_InstanceVariables';
import { Scene05_ControlRoomNeeds } from './frames/Scene05_ControlRoomNeeds';
import { Scene06_HowManyTrains } from './frames/Scene06_HowManyTrains';
import { Scene07_BelongsToClass } from './frames/Scene07_BelongsToClass';
import { Scene08_StaticIntDeclaration } from './frames/Scene08_StaticIntDeclaration';
import { Scene09_CounterIncrements } from './frames/Scene09_CounterIncrements';
import { Scene10_CounterDecrements } from './frames/Scene10_CounterDecrements';
import { Scene11_OneCopyShared } from './frames/Scene11_OneCopyShared';
import { Scene12_InstanceVsStatic } from './frames/Scene12_InstanceVsStatic';
import { Scene13_MethodTeaser } from './frames/Scene13_MethodTeaser';
import { Scene14_CoverNext } from './frames/Scene14_CoverNext';

export const JavaDay38Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/java38.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>

      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_FinalClassRecap />
      </Sequence>

      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_StaticVariableIntro />
      </Sequence>

      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_InstanceVariables />
      </Sequence>

      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_ControlRoomNeeds />
      </Sequence>

      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_HowManyTrains />
      </Sequence>

      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_BelongsToClass />
      </Sequence>

      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_StaticIntDeclaration />
      </Sequence>

      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_CounterIncrements />
      </Sequence>

      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_CounterDecrements />
      </Sequence>

      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_OneCopyShared />
      </Sequence>

      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_InstanceVsStatic />
      </Sequence>

      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_MethodTeaser />
      </Sequence>

      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_CoverNext />
      </Sequence>
    </AbsoluteFill>
  );
};
