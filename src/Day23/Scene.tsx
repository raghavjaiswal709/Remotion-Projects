/**
 * Day 23 — "A Model Is Not An Agent"
 * Main scene orchestrator.
 *
 * Exports: Day23Scene (referenced by Root.tsx as HiddenWorldDay23 composition)
 * Total: 2700 frames @ 30fps = 90 seconds
 * Audio: day23_voiceover.wav — synced to all 25 scenes
 *
 * Scene sequence mapped to exact CSV transcript timestamps.
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING } from './helpers/timing';

import { Scene01_DayCard } from './frames/Scene01_DayCard';
import { Scene02_Introduction } from './frames/Scene02_Introduction';
import { Scene03_StructuredOutput } from './frames/Scene03_StructuredOutput';
import { Scene04_MachineReadable } from './frames/Scene04_MachineReadable';
import { Scene05_TextIntoAction } from './frames/Scene05_TextIntoAction';
import { Scene06_NotTheSame } from './frames/Scene06_NotTheSame';
import { Scene07_Interchangeable } from './frames/Scene07_Interchangeable';
import { Scene08_ModelIO } from './frames/Scene08_ModelIO';
import { Scene09_OneStepDone } from './frames/Scene09_OneStepDone';
import { Scene10_NoLoop } from './frames/Scene10_NoLoop';
import { Scene11_PromptDone } from './frames/Scene11_PromptDone';
import { Scene12_AgentDifferent } from './frames/Scene12_AgentDifferent';
import { Scene13_AgentTakesInput } from './frames/Scene13_AgentTakesInput';
import { Scene14_ObservesWorld } from './frames/Scene14_ObservesWorld';
import { Scene15_FeedsBack } from './frames/Scene15_FeedsBack';
import { Scene16_LoopIsAgent } from './frames/Scene16_LoopIsAgent';
import { Scene17_ModelAnswers } from './frames/Scene17_ModelAnswers';
import { Scene18_AgentActsWatches } from './frames/Scene18_AgentActsWatches';
import { Scene19_ModelFrozen } from './frames/Scene19_ModelFrozen';
import { Scene20_AgentKeepsMoving } from './frames/Scene20_AgentKeepsMoving';
import { Scene21_LoopDefinition } from './frames/Scene21_LoopDefinition';
import { Scene22_PowerfulCalculator } from './frames/Scene22_PowerfulCalculator';
import { Scene23_NavigateWorld } from './frames/Scene23_NavigateWorld';
import { Scene24_LoopEverything } from './frames/Scene24_LoopEverything';
import { Scene25_Outro } from './frames/Scene25_Outro';

export const Day23Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#F5F0E8' }}>
      {/* Audio track */}
      <Audio src={staticFile('audio/day23_voiceover.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration}><Scene01_DayCard /></Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration}><Scene02_Introduction /></Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration}><Scene03_StructuredOutput /></Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration}><Scene04_MachineReadable /></Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration}><Scene05_TextIntoAction /></Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration}><Scene06_NotTheSame /></Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration}><Scene07_Interchangeable /></Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration}><Scene08_ModelIO /></Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration}><Scene09_OneStepDone /></Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration}><Scene10_NoLoop /></Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration}><Scene11_PromptDone /></Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration}><Scene12_AgentDifferent /></Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration}><Scene13_AgentTakesInput /></Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration}><Scene14_ObservesWorld /></Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration}><Scene15_FeedsBack /></Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration}><Scene16_LoopIsAgent /></Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration}><Scene17_ModelAnswers /></Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration}><Scene18_AgentActsWatches /></Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration}><Scene19_ModelFrozen /></Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration}><Scene20_AgentKeepsMoving /></Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration}><Scene21_LoopDefinition /></Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration}><Scene22_PowerfulCalculator /></Sequence>
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration}><Scene23_NavigateWorld /></Sequence>
      <Sequence from={SCENE_TIMING.s24.from} durationInFrames={SCENE_TIMING.s24.duration}><Scene24_LoopEverything /></Sequence>
      <Sequence from={SCENE_TIMING.s25.from} durationInFrames={SCENE_TIMING.s25.duration}><Scene25_Outro /></Sequence>
    </AbsoluteFill>
  );
};
