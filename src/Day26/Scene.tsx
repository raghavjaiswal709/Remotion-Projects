/**
 * Day 26 — "Observations"
 * Main scene orchestrator.
 *
 * Exports: Day26Scene (referenced by Root.tsx)
 * Total: 2200 frames @ 30fps = ~73.3 seconds
 * Audio: ai26.wav — synced to all 18 scenes
 *
 * Scene sequence mapped to exact CSV transcript timestamps.
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING } from './helpers/timing';

import { Scene01_DayCard } from './frames/Scene01_DayCard';
import { Scene02_Introduction } from './frames/Scene02_Introduction';
import { Scene03_LastDayRecap } from './frames/Scene03_LastDayRecap';
import { Scene04_ObservationDefined } from './frames/Scene04_ObservationDefined';
import { Scene05_ReturnToAgent } from './frames/Scene05_ReturnToAgent';
import { Scene06_SearchAPI } from './frames/Scene06_SearchAPI';
import { Scene07_FileWrite } from './frames/Scene07_FileWrite';
import { Scene08_DatabaseQuery } from './frames/Scene08_DatabaseQuery';
import { Scene09_WorldsReply } from './frames/Scene09_WorldsReply';
import { Scene10_ActsBlindly } from './frames/Scene10_ActsBlindly';
import { Scene11_NoWayToAdapt } from './frames/Scene11_NoWayToAdapt';
import { Scene12_LoopSteps } from './frames/Scene12_LoopSteps';
import { Scene13_FeedBack } from './frames/Scene13_FeedBack';
import { Scene14_LoopNotLine } from './frames/Scene14_LoopNotLine';
import { Scene15_KnowledgeBuilds } from './frames/Scene15_KnowledgeBuilds';
import { Scene16_LoopGoesDark } from './frames/Scene16_LoopGoesDark';
import { Scene17_KeyTakeaway } from './frames/Scene17_KeyTakeaway';
import { Scene18_Outro } from './frames/Scene18_Outro';

export const Day26Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#F5F0E8' }}>
      <Audio src={staticFile('audio/ai26.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration}><Scene01_DayCard /></Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration}><Scene02_Introduction /></Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration}><Scene03_LastDayRecap /></Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration}><Scene04_ObservationDefined /></Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration}><Scene05_ReturnToAgent /></Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration}><Scene06_SearchAPI /></Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration}><Scene07_FileWrite /></Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration}><Scene08_DatabaseQuery /></Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration}><Scene09_WorldsReply /></Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration}><Scene10_ActsBlindly /></Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration}><Scene11_NoWayToAdapt /></Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration}><Scene12_LoopSteps /></Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration}><Scene13_FeedBack /></Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration}><Scene14_LoopNotLine /></Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration}><Scene15_KnowledgeBuilds /></Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration}><Scene16_LoopGoesDark /></Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration}><Scene17_KeyTakeaway /></Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration}><Scene18_Outro /></Sequence>
    </AbsoluteFill>
  );
};
