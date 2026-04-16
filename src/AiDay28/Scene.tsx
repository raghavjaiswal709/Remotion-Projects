/**
 * Day 28 — "What Is Tool Calling?"
 * Series: Agentic AI
 * Total: 2453 frames @ 30fps = ~81.77s (= audio duration exactly)
 * Audio: public/audio/ai28.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene01  frames    0–162   "This is day twenty eight..."
 * Scene02  frames  163–242   "Last day, we learned what a tool is,"
 * Scene03  frames  243–422   "a named callable function that bridges..."
 * Scene04  frames  423–550   "Today, we look at how the model actually uses that tool."
 * Scene05  frames  551–623   "This is tool calling."
 * Scene06  frames  624–702   "The model does not execute functions."
 * Scene07  frames  703–755   "It does not run code."
 * Scene08  frames  756–860   "It does not reach into a system..."
 * Scene09  frames  861–966   "What the model does is write an instruction."
 * Scene10  frames  967–1048  "When the agent decides a tool is needed,"
 * Scene11  frames 1049–1116  "it generates a structured output,"
 * Scene12  frames 1117–1232  "not a prose answer, a formatted specification,"
 * Scene13  frames 1233–1369  "the name of the tool, the argument names..."
 * Scene14  frames 1370–1452  "That specification leaves the model."
 * Scene15  frames 1453–1517  "The surrounding system reads it."
 * Scene16  frames 1518–1616  "The surrounding system runs the actual function."
 * Scene17  frames 1617–1720  "The result returns as the next observation."
 * Scene18  frames 1721–1826  "The model never directly executes anything."
 * Scene19  frames 1827–1888  "Its job is to decide."
 * Scene20  frames 1889–2035  "Execution happens in code, outside the model entirely."
 * Scene21  frames 2036–2144  "Decision and execution are two separate things."
 * Scene22  frames 2145–2193  "The model owns one."
 * Scene23  frames 2194–2248  "The system owns the other."
 * Scene24  frames 2249–2392  "And the system that reads every decision..."
 * Scene25  frames 2393–2452  "that is exactly what we build next."
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_ToolRecap } from './frames/Scene02_ToolRecap';
import { Scene03_NamedFunction } from './frames/Scene03_NamedFunction';
import { Scene04_TodayTopic } from './frames/Scene04_TodayTopic';
import { Scene05_ToolCalling } from './frames/Scene05_ToolCalling';
import { Scene06_NoExecution } from './frames/Scene06_NoExecution';
import { Scene07_NoCode } from './frames/Scene07_NoCode';
import { Scene08_NoReach } from './frames/Scene08_NoReach';
import { Scene09_WriteInstruction } from './frames/Scene09_WriteInstruction';
import { Scene10_AgentDecides } from './frames/Scene10_AgentDecides';
import { Scene11_StructuredOutput } from './frames/Scene11_StructuredOutput';
import { Scene12_FormattedSpec } from './frames/Scene12_FormattedSpec';
import { Scene13_ToolArguments } from './frames/Scene13_ToolArguments';
import { Scene14_SpecLeavesModel } from './frames/Scene14_SpecLeavesModel';
import { Scene15_SystemReads } from './frames/Scene15_SystemReads';
import { Scene16_SystemRuns } from './frames/Scene16_SystemRuns';
import { Scene17_ResultReturns } from './frames/Scene17_ResultReturns';
import { Scene18_NeverExecutes } from './frames/Scene18_NeverExecutes';
import { Scene19_JobIsDecide } from './frames/Scene19_JobIsDecide';
import { Scene20_ExecutionInCode } from './frames/Scene20_ExecutionInCode';
import { Scene21_TwoSeparate } from './frames/Scene21_TwoSeparate';
import { Scene22_ModelOwnsOne } from './frames/Scene22_ModelOwnsOne';
import { Scene23_SystemOwnsOther } from './frames/Scene23_SystemOwnsOther';
import { Scene24_SystemReadsDecision } from './frames/Scene24_SystemReadsDecision';
import { Scene25_BuildNext } from './frames/Scene25_BuildNext';

export const Day28Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>

      {/* Audio plays from frame 0 — no Sequence wrapper, no delay */}
      <Audio src={staticFile('audio/ai28.wav')} startFrom={0} />

      {/* Scene 01 — Day intro */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>

      {/* Scene 02 — Tool recap */}
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_ToolRecap />
      </Sequence>

      {/* Scene 03 — Named callable function */}
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_NamedFunction />
      </Sequence>

      {/* Scene 04 — Today's topic */}
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_TodayTopic />
      </Sequence>

      {/* Scene 05 — Tool calling */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_ToolCalling />
      </Sequence>

      {/* Scene 06 — No execution */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_NoExecution />
      </Sequence>

      {/* Scene 07 — No code */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_NoCode />
      </Sequence>

      {/* Scene 08 — No reach into system */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_NoReach />
      </Sequence>

      {/* Scene 09 — Write instruction */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_WriteInstruction />
      </Sequence>

      {/* Scene 10 — Agent decides tool needed */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_AgentDecides />
      </Sequence>

      {/* Scene 11 — Structured output */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_StructuredOutput />
      </Sequence>

      {/* Scene 12 — Formatted specification */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_FormattedSpec />
      </Sequence>

      {/* Scene 13 — Tool arguments */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_ToolArguments />
      </Sequence>

      {/* Scene 14 — Spec leaves model */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_SpecLeavesModel />
      </Sequence>

      {/* Scene 15 — System reads */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_SystemReads />
      </Sequence>

      {/* Scene 16 — System runs function */}
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_SystemRuns />
      </Sequence>

      {/* Scene 17 — Result returns */}
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_ResultReturns />
      </Sequence>

      {/* Scene 18 — Never executes */}
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_NeverExecutes />
      </Sequence>

      {/* Scene 19 — Job is to decide */}
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_JobIsDecide />
      </Sequence>

      {/* Scene 20 — Execution in code */}
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_ExecutionInCode />
      </Sequence>

      {/* Scene 21 — Two separate things */}
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_TwoSeparate />
      </Sequence>

      {/* Scene 22 — Model owns one */}
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_ModelOwnsOne />
      </Sequence>

      {/* Scene 23 — System owns other */}
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}>
        <Scene23_SystemOwnsOther />
      </Sequence>

      {/* Scene 24 — System reads decision */}
      <Sequence from={SCENE_TIMING.s24.from} durationInFrames={SCENE_TIMING.s24.duration} premountFor={30}>
        <Scene24_SystemReadsDecision />
      </Sequence>

      {/* Scene 25 — Build next */}
      <Sequence from={SCENE_TIMING.s25.from} durationInFrames={SCENE_TIMING.s25.duration} premountFor={30}>
        <Scene25_BuildNext />
      </Sequence>

    </AbsoluteFill>
  );
};
