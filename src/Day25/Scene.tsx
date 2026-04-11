/**
 * Day 25 — "Actions"
 * Main scene orchestrator.
 *
 * Exports: Day25Scene (referenced by Root.tsx)
 * Total: 2250 frames @ 30fps = 75 seconds
 * Audio: ai25.wav — synced to all 17 scenes
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING } from './helpers/timing';

import { Scene01_DayCard } from './frames/Scene01_DayCard';
import { Scene02_Introduction } from './frames/Scene02_Introduction';
import { Scene03_AgentLoopRecap } from './frames/Scene03_AgentLoopRecap';
import { Scene04_WhatIsAction } from './frames/Scene04_WhatIsAction';
import { Scene05_ActionExamples } from './frames/Scene05_ActionExamples';
import { Scene06_VerbExecution } from './frames/Scene06_VerbExecution';
import { Scene07_FourSteps } from './frames/Scene07_FourSteps';
import { Scene08_RealHappens } from './frames/Scene08_RealHappens';
import { Scene09_JustThinking } from './frames/Scene09_JustThinking';
import { Scene10_ReasonsForever } from './frames/Scene10_ReasonsForever';
import { Scene11_ConnectsWorld } from './frames/Scene11_ConnectsWorld';
import { Scene12_ToolDesign } from './frames/Scene12_ToolDesign';
import { Scene13_QualityActions } from './frames/Scene13_QualityActions';
import { Scene14_WeakOutcomes } from './frames/Scene14_WeakOutcomes';
import { Scene15_AgentReach } from './frames/Scene15_AgentReach';
import { Scene16_KeyTakeaway } from './frames/Scene16_KeyTakeaway';
import { Scene17_Outro } from './frames/Scene17_Outro';

export const Day25Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#F5F0E8' }}>
      <Audio src={staticFile('audio/ai25.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration}><Scene01_DayCard /></Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration}><Scene02_Introduction /></Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration}><Scene03_AgentLoopRecap /></Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration}><Scene04_WhatIsAction /></Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration}><Scene05_ActionExamples /></Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration}><Scene06_VerbExecution /></Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration}><Scene07_FourSteps /></Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration}><Scene08_RealHappens /></Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration}><Scene09_JustThinking /></Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration}><Scene10_ReasonsForever /></Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration}><Scene11_ConnectsWorld /></Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration}><Scene12_ToolDesign /></Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration}><Scene13_QualityActions /></Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration}><Scene14_WeakOutcomes /></Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration}><Scene15_AgentReach /></Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration}><Scene16_KeyTakeaway /></Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration}><Scene17_Outro /></Sequence>
    </AbsoluteFill>
  );
};
