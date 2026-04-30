/**
 * AiDay35 — "Agent vs. Pipeline"
 * Series: Agentic AI
 * Total: 2388 frames @ 30fps = ~79.6s (= audio duration exactly)
 * Audio: public/audio/Day 35.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene01  frames   0–155   "This is day 35..."
 * Scene02  frames 156–241   "Last day task decomposition..."
 * Scene03  frames 242–426   "breaking a large goal into sub-tasks..."
 * Scene04  frames 427–598   "Today we draw a distinction..."
 * Scene05  frames 599–693   "The difference between an agent and a pipeline."
 * Scene06  frames 694–861   "A pipeline is a fixed sequence..."
 * Scene07  frames 862–932   "Step 1. Search."
 * Scene08  frames 933–1032  "Step 2. Read. Step 3. Summaries."
 * Scene09  frames 1033–1095 "Regardless of what the search returns..."
 * Scene10  frames 1096–1168 "regardless of what the reading reveals..."
 * Scene11  frames 1169–1288 "the pipeline executes the same steps..."
 * Scene12  frames 1289–1444 "An agent decides its own sequence at runtime..."
 * Scene13  frames 1445–1570 "If the search returns nothing useful..."
 * Scene14  frames 1571–1673 "If the document is irrelevant..."
 * Scene15  frames 1674–1835 "If the task needs six steps instead of three..."
 * Scene16  frames 1836–1946 "The pipeline is rigid, the agent is adaptive."
 * Scene17  frames 1947–2025 "Both can decompose a goal into steps,"
 * Scene18  frames 2026–2148 "only one can respond to what it actually finds..."
 * Scene19  frames 2149–2274 "An adaptation at scale requires something..."
 * Scene20  frames 2275–2387 "It requires memory. That is exactly what we build next."
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro }               from './frames/Scene01_DayIntro';
import { Scene02_RecapDecomposition }     from './frames/Scene02_RecapDecomposition';
import { Scene03_BreakingLargeGoal }      from './frames/Scene03_BreakingLargeGoal';
import { Scene04_TodayDistinction }       from './frames/Scene04_TodayDistinction';
import { Scene05_AgentPipelineDiff }      from './frames/Scene05_AgentPipelineDiff';
import { Scene06_PipelineIsFixed }        from './frames/Scene06_PipelineIsFixed';
import { Scene07_Step1Search }            from './frames/Scene07_Step1Search';
import { Scene08_Step2Read3Sum }          from './frames/Scene08_Step2Read3Sum';
import { Scene09_RegardlessSearch }       from './frames/Scene09_RegardlessSearch';
import { Scene10_RegardlessReading }      from './frames/Scene10_RegardlessReading';
import { Scene11_PipelineSameSteps }      from './frames/Scene11_PipelineSameSteps';
import { Scene12_AgentDecides }           from './frames/Scene12_AgentDecides';
import { Scene13_IfSearchUseless }        from './frames/Scene13_IfSearchUseless';
import { Scene14_IfDocIrrelevant }        from './frames/Scene14_IfDocIrrelevant';
import { Scene15_IfTaskNeedsSix }         from './frames/Scene15_IfTaskNeedsSix';
import { Scene16_PipelineRigidAdaptive }  from './frames/Scene16_PipelineRigidAdaptive';
import { Scene17_BothDecompose }          from './frames/Scene17_BothDecompose';
import { Scene18_OnlyOneRespond }         from './frames/Scene18_OnlyOneRespond';
import { Scene19_AdaptationAtScale }      from './frames/Scene19_AdaptationAtScale';
import { Scene20_RequiresMemory }         from './frames/Scene20_RequiresMemory';

export const AiDay35Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>

      {/* Audio plays from frame 0 — no Sequence wrapper, no delay */}
      <Audio src={staticFile('audio/Day 35.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>

      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_RecapDecomposition />
      </Sequence>

      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_BreakingLargeGoal />
      </Sequence>

      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_TodayDistinction />
      </Sequence>

      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_AgentPipelineDiff />
      </Sequence>

      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_PipelineIsFixed />
      </Sequence>

      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_Step1Search />
      </Sequence>

      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_Step2Read3Sum />
      </Sequence>

      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_RegardlessSearch />
      </Sequence>

      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_RegardlessReading />
      </Sequence>

      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_PipelineSameSteps />
      </Sequence>

      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_AgentDecides />
      </Sequence>

      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_IfSearchUseless />
      </Sequence>

      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_IfDocIrrelevant />
      </Sequence>

      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_IfTaskNeedsSix />
      </Sequence>

      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_PipelineRigidAdaptive />
      </Sequence>

      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_BothDecompose />
      </Sequence>

      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_OnlyOneRespond />
      </Sequence>

      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_AdaptationAtScale />
      </Sequence>

      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_RequiresMemory />
      </Sequence>

    </AbsoluteFill>
  );
};
