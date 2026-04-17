/**
 * Day 43 — "Compile-time Polymorphism"
 * Series: Java / National Railway
 * Total: 3236 frames @ 30fps = ~107.9s (= audio duration exactly)
 * Audio: public/audio/java43.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * 28 content scenes mapped 1:1 to CSV phrase groups.
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_ObjectClassRecap } from './frames/Scene02_ObjectClassRecap';
import { Scene03_FreeMethods } from './frames/Scene03_FreeMethods';
import { Scene04_CompileTimePoly } from './frames/Scene04_CompileTimePoly';
import { Scene05_BookATicket } from './frames/Scene05_BookATicket';
import { Scene06_NotSameRequest } from './frames/Scene06_NotSameRequest';
import { Scene07_JustIdRoute } from './frames/Scene07_JustIdRoute';
import { Scene08_AddSeatClass } from './frames/Scene08_AddSeatClass';
import { Scene09_ConcessionOnTop } from './frames/Scene09_ConcessionOnTop';
import { Scene10_ThreeScenarios } from './frames/Scene10_ThreeScenarios';
import { Scene11_ThreeSetsOfInfo } from './frames/Scene11_ThreeSetsOfInfo';
import { Scene12_OneSolutionThreeMethods } from './frames/Scene12_OneSolutionThreeMethods';
import { Scene13_DifferentParamList } from './frames/Scene13_DifferentParamList';
import { Scene14_BookTicketTwo } from './frames/Scene14_BookTicketTwo';
import { Scene15_BookTicketThree } from './frames/Scene15_BookTicketThree';
import { Scene16_BookTicketFour } from './frames/Scene16_BookTicketFour';
import { Scene17_CallingCode } from './frames/Scene17_CallingCode';
import { Scene18_CompilerPicks } from './frames/Scene18_CompilerPicks';
import { Scene19_BeforeProgramRuns } from './frames/Scene19_BeforeProgramRuns';
import { Scene20_JVMNeverDecides } from './frames/Scene20_JVMNeverDecides';
import { Scene21_CompilerDoes } from './frames/Scene21_CompilerDoes';
import { Scene22_SameNameDiffSig } from './frames/Scene22_SameNameDiffSig';
import { Scene23_CompileTimeSelect } from './frames/Scene23_CompileTimeSelect';
import { Scene24_MethodOverloading } from './frames/Scene24_MethodOverloading';
import { Scene25_CompileVsRunTime } from './frames/Scene25_CompileVsRunTime';
import { Scene26_RuntimePolyArrives } from './frames/Scene26_RuntimePolyArrives';
import { Scene27_RulesAndEdgeCases } from './frames/Scene27_RulesAndEdgeCases';
import { Scene28_CoverNext } from './frames/Scene28_CoverNext';

export const JavaDay43Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/java43.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_ObjectClassRecap />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_FreeMethods />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_CompileTimePoly />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_BookATicket />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_NotSameRequest />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_JustIdRoute />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_AddSeatClass />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_ConcessionOnTop />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_ThreeScenarios />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_ThreeSetsOfInfo />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_OneSolutionThreeMethods />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_DifferentParamList />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_BookTicketTwo />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_BookTicketThree />
      </Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_BookTicketFour />
      </Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_CallingCode />
      </Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_CompilerPicks />
      </Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_BeforeProgramRuns />
      </Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_JVMNeverDecides />
      </Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_CompilerDoes />
      </Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_SameNameDiffSig />
      </Sequence>
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}>
        <Scene23_CompileTimeSelect />
      </Sequence>
      <Sequence from={SCENE_TIMING.s24.from} durationInFrames={SCENE_TIMING.s24.duration} premountFor={30}>
        <Scene24_MethodOverloading />
      </Sequence>
      <Sequence from={SCENE_TIMING.s25.from} durationInFrames={SCENE_TIMING.s25.duration} premountFor={30}>
        <Scene25_CompileVsRunTime />
      </Sequence>
      <Sequence from={SCENE_TIMING.s26.from} durationInFrames={SCENE_TIMING.s26.duration} premountFor={30}>
        <Scene26_RuntimePolyArrives />
      </Sequence>
      <Sequence from={SCENE_TIMING.s27.from} durationInFrames={SCENE_TIMING.s27.duration} premountFor={30}>
        <Scene27_RulesAndEdgeCases />
      </Sequence>
      <Sequence from={SCENE_TIMING.s28.from} durationInFrames={SCENE_TIMING.s28.duration} premountFor={30}>
        <Scene28_CoverNext />
      </Sequence>
    </AbsoluteFill>
  );
};
