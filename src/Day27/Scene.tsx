/**
 * Day 27 — "Tools"
 * Main scene orchestrator.
 *
 * Exports: Day27Scene (referenced by Root.tsx)
 * Total: 2842 frames @ 30fps = ~94.7 seconds
 * Audio: ai27.wav — synced to all 17 scenes
 *
 * Scene sequence mapped to exact CSV transcript timestamps.
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING } from './helpers/timing';

import { Scene01_DayCard } from './frames/Scene01_DayCard';
import { Scene02_Introduction } from './frames/Scene02_Introduction';
import { Scene03_LastDayRecap } from './frames/Scene03_LastDayRecap';
import { Scene04_ToolDefined } from './frames/Scene04_ToolDefined';
import { Scene05_ToolExamples } from './frames/Scene05_ToolExamples';
import { Scene06_PreciseCapability } from './frames/Scene06_PreciseCapability';
import { Scene07_ModelGeneratesText } from './frames/Scene07_ModelGeneratesText';
import { Scene08_ToolCallDefined } from './frames/Scene08_ToolCallDefined';
import { Scene09_RuntimeExecutes } from './frames/Scene09_RuntimeExecutes';
import { Scene10_ModelDecides } from './frames/Scene10_ModelDecides';
import { Scene11_SeparationMatters } from './frames/Scene11_SeparationMatters';
import { Scene12_ToolExecution } from './frames/Scene12_ToolExecution';
import { Scene13_SearchTool } from './frames/Scene13_SearchTool';
import { Scene14_CodeTool } from './frames/Scene14_CodeTool';
import { Scene15_BrowserTool } from './frames/Scene15_BrowserTool';
import { Scene16_KeyTakeaway } from './frames/Scene16_KeyTakeaway';
import { Scene17_Outro } from './frames/Scene17_Outro';

export const Day27Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#F5F0E8' }}>
      <Audio src={staticFile('audio/ai27.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration}><Scene01_DayCard /></Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration}><Scene02_Introduction /></Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration}><Scene03_LastDayRecap /></Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration}><Scene04_ToolDefined /></Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration}><Scene05_ToolExamples /></Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration}><Scene06_PreciseCapability /></Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration}><Scene07_ModelGeneratesText /></Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration}><Scene08_ToolCallDefined /></Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration}><Scene09_RuntimeExecutes /></Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration}><Scene10_ModelDecides /></Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration}><Scene11_SeparationMatters /></Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration}><Scene12_ToolExecution /></Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration}><Scene13_SearchTool /></Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration}><Scene14_CodeTool /></Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration}><Scene15_BrowserTool /></Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration}><Scene16_KeyTakeaway /></Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration}><Scene17_Outro /></Sequence>
    </AbsoluteFill>
  );
};
