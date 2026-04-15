/**
 * Day 39 — "Static Method"
 * Series: Java / National Railway
 * Total: 2698 frames @ 30fps = ~89.93s (= audio duration exactly)
 * Audio: public/audio/java39.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene01  frames    0–193   Day intro
 * Scene02  frames  194–399   Static variable recap
 * Scene03  frames  400–501   Static method intro
 * Scene04  frames  502–643   Regular method call
 * Scene05  frames  644–819   Operations belong to none
 * Scene06  frames  820–1019  Control room needs
 * Scene07  frames 1020–1245  Network level query
 * Scene08  frames 1246–1445  Declare static method
 * Scene09  frames 1446–1604  Station total call
 * Scene10  frames 1605–1808  Static data only
 * Scene11  frames 1809–2035  Cannot access instance
 * Scene12  frames 2036–2246  Utility operations
 * Scene13  frames 2036–2246  Java utility examples
 * Scene14  frames 2247–2347  Invoked on class
 * Scene15  frames 2348–2554  Code before objects
 * Scene16  frames 2555–2697  Static block teaser
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_StaticVarRecap } from './frames/Scene02_StaticVarRecap';
import { Scene03_StaticMethodIntro } from './frames/Scene03_StaticMethodIntro';
import { Scene04_RegularMethodCall } from './frames/Scene04_RegularMethodCall';
import { Scene05_OperationsBelongToNone } from './frames/Scene05_OperationsBelongToNone';
import { Scene06_ControlRoomNeeds } from './frames/Scene06_ControlRoomNeeds';
import { Scene07_NetworkLevelQuery } from './frames/Scene07_NetworkLevelQuery';
import { Scene08_DeclareStaticMethod } from './frames/Scene08_DeclareStaticMethod';
import { Scene09_StationTotalCall } from './frames/Scene09_StationTotalCall';
import { Scene10_StaticDataOnly } from './frames/Scene10_StaticDataOnly';
import { Scene11_CannotAccessInstance } from './frames/Scene11_CannotAccessInstance';
import { Scene12_UtilityOperations } from './frames/Scene12_UtilityOperations';
import { Scene13_JavaUtilityExamples } from './frames/Scene13_JavaUtilityExamples';
import { Scene14_InvokedOnClass } from './frames/Scene14_InvokedOnClass';
import { Scene15_CodeBeforeObjects } from './frames/Scene15_CodeBeforeObjects';
import { Scene16_StaticBlockTeaser } from './frames/Scene16_StaticBlockTeaser';

export const JavaDay39Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/java39.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_StaticVarRecap />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_StaticMethodIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_RegularMethodCall />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_OperationsBelongToNone />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_ControlRoomNeeds />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_NetworkLevelQuery />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_DeclareStaticMethod />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_StationTotalCall />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_StaticDataOnly />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_CannotAccessInstance />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_UtilityOperations />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_JavaUtilityExamples />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_InvokedOnClass />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_CodeBeforeObjects />
      </Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_StaticBlockTeaser />
      </Sequence>
    </AbsoluteFill>
  );
};
