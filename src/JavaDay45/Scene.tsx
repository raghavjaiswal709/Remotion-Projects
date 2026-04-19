/**
 * Day 45 — "Runtime Polymorphism"
 * Series: Java / National Railway
 * Total: 2358 frames @ 30fps = ~78.6s
 * Audio: public/audio/Java 45.wav
 *
 * NO structural scenes — video = audio duration only
 * Audio plays from frame 0
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_OverloadingRecap } from './frames/Scene02_OverloadingRecap';
import { Scene03_CompileTimeResolved } from './frames/Scene03_CompileTimeResolved';
import { Scene04_FareEngineReference } from './frames/Scene04_FareEngineReference';
import { Scene05_RuntimeReference } from './frames/Scene05_RuntimeReference';
import { Scene06_CallingCodeKnows } from './frames/Scene06_CallingCodeKnows';
import { Scene07_SpecificTypeUnknown } from './frames/Scene07_SpecificTypeUnknown';
import { Scene08_CalculatorCalled } from './frames/Scene08_CalculatorCalled';
import { Scene09_ActualObjectInMemory } from './frames/Scene09_ActualObjectInMemory';
import { Scene10_FindsExpress } from './frames/Scene10_FindsExpress';
import { Scene11_RunsThatVersion } from './frames/Scene11_RunsThatVersion';
import { Scene12_RuntimePolymorphism } from './frames/Scene12_RuntimePolymorphism';
import { Scene13_NotDecidedCompile } from './frames/Scene13_NotDecidedCompile';
import { Scene14_DecidedAtRuntime } from './frames/Scene14_DecidedAtRuntime';
import { Scene15_ObjectLivesAtReference } from './frames/Scene15_ObjectLivesAtReference';
import { Scene16_SwapWithoutChanging } from './frames/Scene16_SwapWithoutChanging';
import { Scene17_ReferenceSame } from './frames/Scene17_ReferenceSame';
import { Scene18_BehaviorChanges } from './frames/Scene18_BehaviorChanges';
import { Scene19_MechanismConnection } from './frames/Scene19_MechanismConnection';
import { Scene20_ConnectionHasName } from './frames/Scene20_ConnectionHasName';
import { Scene21_CalledUpcasting } from './frames/Scene21_CalledUpcasting';
import { Scene22_BuildNext } from './frames/Scene22_BuildNext';

export const JavaDay45Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/Java 45.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_OverloadingRecap />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_CompileTimeResolved />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_FareEngineReference />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_RuntimeReference />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_CallingCodeKnows />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_SpecificTypeUnknown />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_CalculatorCalled />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_ActualObjectInMemory />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_FindsExpress />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_RunsThatVersion />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_RuntimePolymorphism />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_NotDecidedCompile />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_DecidedAtRuntime />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_ObjectLivesAtReference />
      </Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_SwapWithoutChanging />
      </Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_ReferenceSame />
      </Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_BehaviorChanges />
      </Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_MechanismConnection />
      </Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_ConnectionHasName />
      </Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_CalledUpcasting />
      </Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_BuildNext />
      </Sequence>
    </AbsoluteFill>
  );
};
