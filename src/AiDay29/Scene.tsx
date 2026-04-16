/**
 * Day 29 — "What Is an Agent Runtime?"
 * Series: Agentic AI
 * Total: 2116 frames @ 30fps = ~70.53s (= audio duration exactly)
 * Audio: public/audio/ai29.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE (24 scenes):
 * Scene01  0–155      "An agent by itself is just a program..."
 * Scene02  156–240    "a set of instructions."
 * Scene03  241–388    "It can reason, it can plan, it can decide."
 * Scene04  389–460    "But without something running it,"
 * Scene05  461–532    "it is stuck."
 * Scene06  533–633    "Think of it like a script written on paper."
 * Scene07  634–756    "The ideas are there, but nothing is executing them."
 * Scene08  757–817    "That is the gap."
 * Scene09  818–894    "The agent needs an engine,"
 * Scene10  895–951    "a system underneath it"
 * Scene11  952–1009   "that keeps it alive and moving."
 * Scene12  1010–1080  "This is the runtime."
 * Scene13  1081–1189  "The runtime is the layer that manages the agent's lifecycle."
 * Scene14  1190–1263  "It decides when the agent thinks,"
 * Scene15  1264–1338  "when it acts, when it observes."
 * Scene16  1339–1407  "It handles the flow of execution."
 * Scene17  1408–1512  "Without it, the agent has no pulse. No heartbeat."
 * Scene18  1513–1594  "The runtime is what turns a passive model"
 * Scene19  1595–1635  "into an active agent."
 * Scene20  1636–1749  "With the runtime, it becomes a continuous loop."
 * Scene21  1750–1876  "Acting on the world, receiving what the world says back, acting again."
 * Scene22  1877–1962  "Now, there is one thing this loop still needs. A purpose."
 * Scene23  1963–2056  "A defined goal to move toward."
 * Scene24  2057–2115  "That is exactly what we name next."
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_ToolCallingRecap } from './frames/Scene02_ToolCallingRecap';
import { Scene03_SpecExecution } from './frames/Scene03_SpecExecution';
import { Scene04_TodayTopic } from './frames/Scene04_TodayTopic';
import { Scene05_AgentRuntime } from './frames/Scene05_AgentRuntime';
import { Scene06_Infrastructure } from './frames/Scene06_Infrastructure';
import { Scene07_PureCode } from './frames/Scene07_PureCode';
import { Scene08_ExactSequence } from './frames/Scene08_ExactSequence';
import { Scene09_ReceivesInput } from './frames/Scene09_ReceivesInput';
import { Scene10_FormatsPrompt } from './frames/Scene10_FormatsPrompt';
import { Scene11_CallsAPI } from './frames/Scene11_CallsAPI';
import { Scene12_ReadsResponse } from './frames/Scene12_ReadsResponse';
import { Scene13_ExecutesTool } from './frames/Scene13_ExecutesTool';
import { Scene14_FormatsResult } from './frames/Scene14_FormatsResult';
import { Scene15_AppendsObservation } from './frames/Scene15_AppendsObservation';
import { Scene16_CallsAgain } from './frames/Scene16_CallsAgain';
import { Scene17_LoopExecutable } from './frames/Scene17_LoopExecutable';
import { Scene18_JustFunction } from './frames/Scene18_JustFunction';
import { Scene19_TextInOut } from './frames/Scene19_TextInOut';
import { Scene20_ContinuousLoop } from './frames/Scene20_ContinuousLoop';
import { Scene21_ActingOnWorld } from './frames/Scene21_ActingOnWorld';
import { Scene22_OneThing } from './frames/Scene22_OneThing';
import { Scene23_Purpose } from './frames/Scene23_Purpose';
import { Scene24_NameNext } from './frames/Scene24_NameNext';

export const AiDay29Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/ai29.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_ToolCallingRecap />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_SpecExecution />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_TodayTopic />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_AgentRuntime />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_Infrastructure />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_PureCode />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_ExactSequence />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_ReceivesInput />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_FormatsPrompt />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_CallsAPI />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_ReadsResponse />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_ExecutesTool />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_FormatsResult />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_AppendsObservation />
      </Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_CallsAgain />
      </Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_LoopExecutable />
      </Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_JustFunction />
      </Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_TextInOut />
      </Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_ContinuousLoop />
      </Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_ActingOnWorld />
      </Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_OneThing />
      </Sequence>
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}>
        <Scene23_Purpose />
      </Sequence>
      <Sequence from={SCENE_TIMING.s24.from} durationInFrames={SCENE_TIMING.s24.duration} premountFor={30}>
        <Scene24_NameNext />
      </Sequence>
    </AbsoluteFill>
  );
};
