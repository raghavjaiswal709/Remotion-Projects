/**
 * Day 46 — "Upcasting"
 * Series: Java / National Railway
 * Total: 2324 frames @ 30fps = ~77.5s (= audio duration exactly)
 * Audio: public/audio/java 46.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0
 *
 * SCENE SEQUENCE (22 content scenes):
 * Scene01  frames   0–181    Day intro
 * Scene02  frames 182–399    Polymorphism recap
 * Scene03  frames 400–522    Express stored in train ref
 * Scene04  frames 523–602    Train T equals new ExpressTrain
 * Scene05  frames 603–694    Still express in memory
 * Scene06  frames 695–765    Reference sees only train
 * Scene07  frames 766–915    Express methods unreachable
 * Scene08  frames 916–1017   Java permits automatically
 * Scene09  frames 1018–1068  This is upcasting
 * Scene10  frames 1069–1177  Child in parent reference
 * Scene11  frames 1178–1226  Why useful
 * Scene12  frames 1227–1352  Control room processes
 * Scene13  frames 1353–1471  Doesn't need to know
 * Scene14  frames 1472–1530  Just needs a train
 * Scene15  frames 1531–1607  Upcasting generic processing
 * Scene16  frames 1608–1714  List of Train
 * Scene17  frames 1715–1827  All treated uniformly
 * Scene18  frames 1828–1983  Loop process uniformly
 * Scene19  frames 1984–2127  Need express back
 * Scene20  frames 2128–2211  Requires deliberate
 * Scene21  frames 2212–2261  That is downcasting
 * Scene22  frames 2262–2323  Cover next
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_PolymorphismRecap } from './frames/Scene02_PolymorphismRecap';
import { Scene03_ExpressStored } from './frames/Scene03_ExpressStored';
import { Scene04_TrainTEquals } from './frames/Scene04_TrainTEquals';
import { Scene05_StillExpressInMemory } from './frames/Scene05_StillExpressInMemory';
import { Scene06_ReferenceSeesOnlyTrain } from './frames/Scene06_ReferenceSeesOnlyTrain';
import { Scene07_ExpressMethodsUnreachable } from './frames/Scene07_ExpressMethodsUnreachable';
import { Scene08_JavaPermitsAutomatically } from './frames/Scene08_JavaPermitsAutomatically';
import { Scene09_ThisIsUpcasting } from './frames/Scene09_ThisIsUpcasting';
import { Scene10_ChildInParentRef } from './frames/Scene10_ChildInParentRef';
import { Scene11_WhyUseful } from './frames/Scene11_WhyUseful';
import { Scene12_ControlRoomProcesses } from './frames/Scene12_ControlRoomProcesses';
import { Scene13_DoesntNeedToKnow } from './frames/Scene13_DoesntNeedToKnow';
import { Scene14_JustNeedsATrain } from './frames/Scene14_JustNeedsATrain';
import { Scene15_UpcastingGenericProcessing } from './frames/Scene15_UpcastingGenericProcessing';
import { Scene16_ListOfTrain } from './frames/Scene16_ListOfTrain';
import { Scene17_AllTreatedUniformly } from './frames/Scene17_AllTreatedUniformly';
import { Scene18_LoopProcessUniformly } from './frames/Scene18_LoopProcessUniformly';
import { Scene19_NeedExpressBack } from './frames/Scene19_NeedExpressBack';
import { Scene20_RequiresDeliberate } from './frames/Scene20_RequiresDeliberate';
import { Scene21_ThatIsDowncasting } from './frames/Scene21_ThatIsDowncasting';
import { Scene22_CoverNext } from './frames/Scene22_CoverNext';

export const JavaDay46Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/java 46.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_PolymorphismRecap />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_ExpressStored />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_TrainTEquals />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_StillExpressInMemory />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_ReferenceSeesOnlyTrain />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_ExpressMethodsUnreachable />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_JavaPermitsAutomatically />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_ThisIsUpcasting />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_ChildInParentRef />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_WhyUseful />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_ControlRoomProcesses />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_DoesntNeedToKnow />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_JustNeedsATrain />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_UpcastingGenericProcessing />
      </Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_ListOfTrain />
      </Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_AllTreatedUniformly />
      </Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_LoopProcessUniformly />
      </Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_NeedExpressBack />
      </Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_RequiresDeliberate />
      </Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_ThatIsDowncasting />
      </Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_CoverNext />
      </Sequence>
    </AbsoluteFill>
  );
};
