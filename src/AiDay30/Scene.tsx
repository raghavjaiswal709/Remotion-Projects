/**
 * Day 30 — "What Is a Task?"
 * Series: Agentic AI
 * Total: 2323 frames @ 30fps = ~77.43s (= audio duration exactly)
 * Audio: public/audio/AI day 30.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene01  frames   0–160    "This is Day 30..."
 * Scene02  frames 161–265    "Last day, we learned what an agent runtime is."
 * Scene03  frames 266–365    "The code that wraps the model..."
 * Scene04  frames 366–450    "Today, we define the task."
 * Scene05  frames 451–567    "A task is a goal with three required components."
 * Scene06  frames 568–640    "A start state, a desired end state,"
 * Scene07  frames 641–720    "and a measurable success criterion."
 * Scene08  frames 721–833    "Without all three..."
 * Scene09  frames 834–925    "Here is a complete task."
 * Scene10  frames 926–1044   "Find the three cheapest flights..."
 * Scene11  frames 1045–1121  "And book the one with the shortest layover."
 * Scene12  frames 1122–1198  "Start state, no booking exists."
 * Scene13  frames 1199–1279  "End state, one confirmed ticket."
 * Scene14  frames 1280–1420  "Success criterion, cheapest three candidates..."
 * Scene15  frames 1421–1488  "Every part is precise."
 * Scene16  frames 1489–1557  "Now here is not a task."
 * Scene17  frames 1558–1646  "Help me with flights. There is no end state."
 * Scene18  frames 1647–1793  "There is no criterion..."
 * Scene19  frames 1794–1888  "The planner, the halt condition, the evaluator,"
 * Scene20  frames 1889–2052  "every layer of the agentic system..."
 * Scene21  frames 2053–2148  "Vague task in, vague agent behavior out."
 * Scene22  frames 2149–2231  "How much of this the agent handles alone,"
 * Scene23  frames 2232–2322  "without stopping to ask you..."
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_RecapRuntime } from './frames/Scene02_RecapRuntime';
import { Scene03_RecapLoopCode } from './frames/Scene03_RecapLoopCode';
import { Scene04_TodayTask } from './frames/Scene04_TodayTask';
import { Scene05_TaskGoalComponents } from './frames/Scene05_TaskGoalComponents';
import { Scene06_StartEndState } from './frames/Scene06_StartEndState';
import { Scene07_SuccessCriterion } from './frames/Scene07_SuccessCriterion';
import { Scene08_WithoutThree } from './frames/Scene08_WithoutThree';
import { Scene09_CompleteTaskIntro } from './frames/Scene09_CompleteTaskIntro';
import { Scene10_FlightExample } from './frames/Scene10_FlightExample';
import { Scene11_BookShortest } from './frames/Scene11_BookShortest';
import { Scene12_StartStateExample } from './frames/Scene12_StartStateExample';
import { Scene13_EndStateExample } from './frames/Scene13_EndStateExample';
import { Scene14_CriterionExample } from './frames/Scene14_CriterionExample';
import { Scene15_PreciseParts } from './frames/Scene15_PreciseParts';
import { Scene16_NotATask } from './frames/Scene16_NotATask';
import { Scene17_VagueNoEndState } from './frames/Scene17_VagueNoEndState';
import { Scene18_NoCriterionLost } from './frames/Scene18_NoCriterionLost';
import { Scene19_SystemLayers } from './frames/Scene19_SystemLayers';
import { Scene20_PreciselyDefined } from './frames/Scene20_PreciselyDefined';
import { Scene21_VagueInVagueOut } from './frames/Scene21_VagueInVagueOut';
import { Scene22_AgentHandlesAlone } from './frames/Scene22_AgentHandlesAlone';
import { Scene23_NextDayTeaser } from './frames/Scene23_NextDayTeaser';

export const AiDay30Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      {/* Audio plays from frame 0 — no Sequence wrapper, no delay */}
      <Audio src={staticFile('audio/AI day 30.wav')} startFrom={0} />

      {/* Scene 01 — Day intro */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>

      {/* Scene 02 — Recap runtime */}
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_RecapRuntime />
      </Sequence>

      {/* Scene 03 — Recap loop code */}
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_RecapLoopCode />
      </Sequence>

      {/* Scene 04 — Today: define the task */}
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_TodayTask />
      </Sequence>

      {/* Scene 05 — Task = goal with 3 components */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_TaskGoalComponents />
      </Sequence>

      {/* Scene 06 — Start state, end state */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_StartEndState />
      </Sequence>

      {/* Scene 07 — Success criterion */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_SuccessCriterion />
      </Sequence>

      {/* Scene 08 — Without all three */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_WithoutThree />
      </Sequence>

      {/* Scene 09 — Complete task intro */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_CompleteTaskIntro />
      </Sequence>

      {/* Scene 10 — Flight example */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_FlightExample />
      </Sequence>

      {/* Scene 11 — Book shortest layover */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_BookShortest />
      </Sequence>

      {/* Scene 12 — Start state example */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_StartStateExample />
      </Sequence>

      {/* Scene 13 — End state example */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_EndStateExample />
      </Sequence>

      {/* Scene 14 — Criterion example */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_CriterionExample />
      </Sequence>

      {/* Scene 15 — Every part is precise */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_PreciseParts />
      </Sequence>

      {/* Scene 16 — Not a task */}
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_NotATask />
      </Sequence>

      {/* Scene 17 — Vague, no end state */}
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_VagueNoEndState />
      </Sequence>

      {/* Scene 18 — No criterion, lost */}
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_NoCriterionLost />
      </Sequence>

      {/* Scene 19 — System layers */}
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_SystemLayers />
      </Sequence>

      {/* Scene 20 — Precisely defined */}
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_PreciselyDefined />
      </Sequence>

      {/* Scene 21 — Vague in, vague out */}
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_VagueInVagueOut />
      </Sequence>

      {/* Scene 22 — Agent handles alone */}
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_AgentHandlesAlone />
      </Sequence>

      {/* Scene 23 — Next day teaser */}
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}>
        <Scene23_NextDayTeaser />
      </Sequence>
    </AbsoluteFill>
  );
};
