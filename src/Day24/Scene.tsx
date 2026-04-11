/**
 * Day 24 — "The Agent Loop"
 * Main scene orchestrator.
 *
 * Exports: Day24Scene (referenced by Root.tsx)
 * Total: 2250 frames @ 30fps = 75 seconds
 * Audio: ai24.wav — synced to all 21 scenes
 *
 * Scene sequence mapped to exact CSV transcript timestamps.
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING } from './helpers/timing';

import { Scene01_DayCard } from './frames/Scene01_DayCard';
import { Scene02_Introduction } from './frames/Scene02_Introduction';
import { Scene03_ModelNotAgent } from './frames/Scene03_ModelNotAgent';
import { Scene04_Heartbeat } from './frames/Scene04_Heartbeat';
import { Scene05_FourSteps } from './frames/Scene05_FourSteps';
import { Scene06_PerceiveThinkActObserve } from './frames/Scene06_PerceiveThinkActObserve';
import { Scene07_Perceive } from './frames/Scene07_Perceive';
import { Scene08_Think } from './frames/Scene08_Think';
import { Scene09_Act } from './frames/Scene09_Act';
import { Scene10_Observe } from './frames/Scene10_Observe';
import { Scene11_LoopAgain } from './frames/Scene11_LoopAgain';
import { Scene12_NotMetaphor } from './frames/Scene12_NotMetaphor';
import { Scene13_ExecutionSequence } from './frames/Scene13_ExecutionSequence';
import { Scene14_SingleDirection } from './frames/Scene14_SingleDirection';
import { Scene15_MovesInCircle } from './frames/Scene15_MovesInCircle';
import { Scene16_CircleSeparates } from './frames/Scene16_CircleSeparates';
import { Scene17_EveryConcept } from './frames/Scene17_EveryConcept';
import { Scene18_LoopMoreCapable } from './frames/Scene18_LoopMoreCapable';
import { Scene19_LoopIsEverything } from './frames/Scene19_LoopIsEverything';
import { Scene20_KeyTakeaway } from './frames/Scene20_KeyTakeaway';
import { Scene21_Outro } from './frames/Scene21_Outro';

export const Day24Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#F5F0E8' }}>
      <Audio src={staticFile('audio/ai24.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration}><Scene01_DayCard /></Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration}><Scene02_Introduction /></Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration}><Scene03_ModelNotAgent /></Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration}><Scene04_Heartbeat /></Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration}><Scene05_FourSteps /></Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration}><Scene06_PerceiveThinkActObserve /></Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration}><Scene07_Perceive /></Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration}><Scene08_Think /></Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration}><Scene09_Act /></Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration}><Scene10_Observe /></Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration}><Scene11_LoopAgain /></Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration}><Scene12_NotMetaphor /></Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration}><Scene13_ExecutionSequence /></Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration}><Scene14_SingleDirection /></Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration}><Scene15_MovesInCircle /></Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration}><Scene16_CircleSeparates /></Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration}><Scene17_EveryConcept /></Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration}><Scene18_LoopMoreCapable /></Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration}><Scene19_LoopIsEverything /></Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration}><Scene20_KeyTakeaway /></Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration}><Scene21_Outro /></Sequence>
    </AbsoluteFill>
  );
};
