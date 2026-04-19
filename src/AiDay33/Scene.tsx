/**
 * Day 33 — "What Is a Step?"
 * Series: Agentic AI
 * Total: 2675 frames @ 30fps = ~89.16s (= audio duration exactly)
 * Audio: public/audio/AI day 33.wav
 *
 * 28 content scenes, no structural scenes.
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_RecapTrajectory } from './frames/Scene02_RecapTrajectory';
import { Scene03_TrajectoryDefinition } from './frames/Scene03_TrajectoryDefinition';
import { Scene04_TodayDefineStep } from './frames/Scene04_TodayDefineStep';
import { Scene05_StepIteration } from './frames/Scene05_StepIteration';
import { Scene06_ObsInActionOut } from './frames/Scene06_ObsInActionOut';
import { Scene07_AtomicUnit } from './frames/Scene07_AtomicUnit';
import { Scene08_SearchObservation } from './frames/Scene08_SearchObservation';
import { Scene09_CallDocAction } from './frames/Scene09_CallDocAction';
import { Scene10_StepComplete } from './frames/Scene10_StepComplete';
import { Scene11_DozensOfSteps } from './frames/Scene11_DozensOfSteps';
import { Scene12_SometimesHundreds } from './frames/Scene12_SometimesHundreds';
import { Scene13_ChainOfSteps } from './frames/Scene13_ChainOfSteps';
import { Scene14_ControlledExchange } from './frames/Scene14_ControlledExchange';
import { Scene15_BoundaryValue } from './frames/Scene15_BoundaryValue';
import { Scene16_Auditable } from './frames/Scene16_Auditable';
import { Scene17_DecisionCorrect } from './frames/Scene17_DecisionCorrect';
import { Scene18_CostMeasurable } from './frames/Scene18_CostMeasurable';
import { Scene19_TokensCounted } from './frames/Scene19_TokensCounted';
import { Scene20_Retriable } from './frames/Scene20_Retriable';
import { Scene21_RetryStep17 } from './frames/Scene21_RetryStep17';
import { Scene22_NotEntireTask } from './frames/Scene22_NotEntireTask';
import { Scene23_StepLevelReliability } from './frames/Scene23_StepLevelReliability';
import { Scene24_GoalToSteps } from './frames/Scene24_GoalToSteps';
import { Scene25_RightOrder } from './frames/Scene25_RightOrder';
import { Scene26_OrderedSequence } from './frames/Scene26_OrderedSequence';
import { Scene27_ProblemHasName } from './frames/Scene27_ProblemHasName';
import { Scene28_SolveItNext } from './frames/Scene28_SolveItNext';

export const Day33Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/AI day 33.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}><Scene01_DayIntro /></Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}><Scene02_RecapTrajectory /></Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}><Scene03_TrajectoryDefinition /></Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}><Scene04_TodayDefineStep /></Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}><Scene05_StepIteration /></Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}><Scene06_ObsInActionOut /></Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}><Scene07_AtomicUnit /></Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}><Scene08_SearchObservation /></Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}><Scene09_CallDocAction /></Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}><Scene10_StepComplete /></Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}><Scene11_DozensOfSteps /></Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}><Scene12_SometimesHundreds /></Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}><Scene13_ChainOfSteps /></Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}><Scene14_ControlledExchange /></Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}><Scene15_BoundaryValue /></Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}><Scene16_Auditable /></Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}><Scene17_DecisionCorrect /></Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}><Scene18_CostMeasurable /></Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}><Scene19_TokensCounted /></Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}><Scene20_Retriable /></Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}><Scene21_RetryStep17 /></Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}><Scene22_NotEntireTask /></Sequence>
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}><Scene23_StepLevelReliability /></Sequence>
      <Sequence from={SCENE_TIMING.s24.from} durationInFrames={SCENE_TIMING.s24.duration} premountFor={30}><Scene24_GoalToSteps /></Sequence>
      <Sequence from={SCENE_TIMING.s25.from} durationInFrames={SCENE_TIMING.s25.duration} premountFor={30}><Scene25_RightOrder /></Sequence>
      <Sequence from={SCENE_TIMING.s26.from} durationInFrames={SCENE_TIMING.s26.duration} premountFor={30}><Scene26_OrderedSequence /></Sequence>
      <Sequence from={SCENE_TIMING.s27.from} durationInFrames={SCENE_TIMING.s27.duration} premountFor={30}><Scene27_ProblemHasName /></Sequence>
      <Sequence from={SCENE_TIMING.s28.from} durationInFrames={SCENE_TIMING.s28.duration} premountFor={30}><Scene28_SolveItNext /></Sequence>
    </AbsoluteFill>
  );
};
