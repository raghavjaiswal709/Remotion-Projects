/**
 * Day 32 — "What Is a Trajectory?"
 * Series: Agentic AI
 * Total: 2536 frames @ 30fps = ~84.5s (= audio duration exactly)
 * Audio: public/audio/AI day 32.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0
 *
 * 28 content scenes
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_RecapAutonomy } from './frames/Scene02_RecapAutonomy';
import { Scene03_AutonomySpectrum } from './frames/Scene03_AutonomySpectrum';
import { Scene04_DefineTrajectory } from './frames/Scene04_DefineTrajectory';
import { Scene05_TrajectoryDefinition } from './frames/Scene05_TrajectoryDefinition';
import { Scene06_StartToFinish } from './frames/Scene06_StartToFinish';
import { Scene07_NotJustOutput } from './frames/Scene07_NotJustOutput';
import { Scene08_EveryStateActionObs } from './frames/Scene08_EveryStateActionObs';
import { Scene09_SimpleExample } from './frames/Scene09_SimpleExample';
import { Scene10_UserGivesGoal } from './frames/Scene10_UserGivesGoal';
import { Scene11_AgentCallsSearch } from './frames/Scene11_AgentCallsSearch';
import { Scene12_SearchReturns } from './frames/Scene12_SearchReturns';
import { Scene13_AgentReadsDoc } from './frames/Scene13_AgentReadsDoc';
import { Scene14_DocReturnsText } from './frames/Scene14_DocReturnsText';
import { Scene15_AgentProducesSummary } from './frames/Scene15_AgentProducesSummary';
import { Scene16_SixEntriesSixMoments } from './frames/Scene16_SixEntriesSixMoments';
import { Scene17_SequenceIsTrajectory } from './frames/Scene17_SequenceIsTrajectory';
import { Scene18_WhyDoesThisMatter } from './frames/Scene18_WhyDoesThisMatter';
import { Scene19_OutputAlone } from './frames/Scene19_OutputAlone';
import { Scene20_HallucinatedReasoning } from './frames/Scene20_HallucinatedReasoning';
import { Scene21_ItWasLucky } from './frames/Scene21_ItWasLucky';
import { Scene22_FullPicture } from './frames/Scene22_FullPicture';
import { Scene23_EveryDecision } from './frames/Scene23_EveryDecision';
import { Scene24_ProductionDebug } from './frames/Scene24_ProductionDebug';
import { Scene25_AuditTrail } from './frames/Scene25_AuditTrail';
import { Scene26_StepsIntro } from './frames/Scene26_StepsIntro';
import { Scene27_ObsInActionOut } from './frames/Scene27_ObsInActionOut';
import { Scene28_AtomicUnitName } from './frames/Scene28_AtomicUnitName';

export const AiDay32Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/AI day 32.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_RecapAutonomy />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_AutonomySpectrum />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_DefineTrajectory />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_TrajectoryDefinition />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_StartToFinish />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_NotJustOutput />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_EveryStateActionObs />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_SimpleExample />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_UserGivesGoal />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_AgentCallsSearch />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_SearchReturns />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_AgentReadsDoc />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_DocReturnsText />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_AgentProducesSummary />
      </Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_SixEntriesSixMoments />
      </Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_SequenceIsTrajectory />
      </Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_WhyDoesThisMatter />
      </Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_OutputAlone />
      </Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_HallucinatedReasoning />
      </Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_ItWasLucky />
      </Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_FullPicture />
      </Sequence>
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}>
        <Scene23_EveryDecision />
      </Sequence>
      <Sequence from={SCENE_TIMING.s24.from} durationInFrames={SCENE_TIMING.s24.duration} premountFor={30}>
        <Scene24_ProductionDebug />
      </Sequence>
      <Sequence from={SCENE_TIMING.s25.from} durationInFrames={SCENE_TIMING.s25.duration} premountFor={30}>
        <Scene25_AuditTrail />
      </Sequence>
      <Sequence from={SCENE_TIMING.s26.from} durationInFrames={SCENE_TIMING.s26.duration} premountFor={30}>
        <Scene26_StepsIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s27.from} durationInFrames={SCENE_TIMING.s27.duration} premountFor={30}>
        <Scene27_ObsInActionOut />
      </Sequence>
      <Sequence from={SCENE_TIMING.s28.from} durationInFrames={SCENE_TIMING.s28.duration} premountFor={30}>
        <Scene28_AtomicUnitName />
      </Sequence>
    </AbsoluteFill>
  );
};
