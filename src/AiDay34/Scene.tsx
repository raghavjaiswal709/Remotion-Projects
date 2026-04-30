/**
 * Day 34 — "What Is Task Decomposition?"
 * Series: Agentic AI
 * Total: 2456 frames @ 30fps = ~81.86s (= audio duration)
 * Audio: public/audio/Day 34.wav
 *
 * NO structural scenes — video length = audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene01  frames 0–161        "This is day 34..."
 * Scene02  frames 162–240      "Last day, we learned what a step is."
 * Scene03  frames 241–406      "One complete iteration..."
 * Scene04  frames 407–474      "Today, we go one level up."
 * Scene05  frames 475–601      "What happens when the goal is too large..."
 * Scene06  frames 602–692      "Task decomposition. A large goal,"
 * Scene07  frames 693–832      "right, a market research report..."
 * Scene08  frames 833–1031     "The model cannot search, read, analyze..."
 * Scene09  frames 1032–1143    "Decomposition breaks that goal..."
 * Scene10  frames 1144–1209    "Search for recent industry data."
 * Scene11  frames 1210–1306    "Read each source, extract key statistics,"
 * Scene12  frames 1307–1438    "identify trends, draft each section..."
 * Scene13  frames 1439–1570    "Each sub task is achievable in one step..."
 * Scene14  frames 1571–1647    "Together, they complete the original goal."
 * Scene15  frames 1648–1711    "The model generates this breakdown itself."
 * Scene16  frames 1712–1855    "Reasoning about what the goal requires..."
 * Scene17  frames 1856–1957    "and which sub tasks depend on each other's output."
 * Scene18  frames 1958–2062    "Decomposition is what separates tasks..."
 * Scene19  frames 2063–2137    "from tasks an agent can only attempt."
 * Scene20  frames 2138–2221    "But here is the question underneath all of this."
 * Scene21  frames 2222–2382    "Is a fixed sequence of steps really an agent..."
 * Scene22  frames 2383–2455    "That distinction is exactly what we explore next."
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro }                 from './frames/Scene01_DayIntro';
import { Scene02_RecapStep }                from './frames/Scene02_RecapStep';
import { Scene03_OneIterationOut }          from './frames/Scene03_OneIterationOut';
import { Scene04_TodayOneLevelUp }          from './frames/Scene04_TodayOneLevelUp';
import { Scene05_WhatWhenGoalTooLarge }     from './frames/Scene05_WhatWhenGoalTooLarge';
import { Scene06_TaskDecompositionIntro }   from './frames/Scene06_TaskDecompositionIntro';
import { Scene07_MarketResearchExample }    from './frames/Scene07_MarketResearchExample';
import { Scene08_ModelCannotSimultaneous }  from './frames/Scene08_ModelCannotSimultaneous';
import { Scene09_DecompositionBreaks }      from './frames/Scene09_DecompositionBreaks';
import { Scene10_SearchRecentData }         from './frames/Scene10_SearchRecentData';
import { Scene11_ReadExtractStatistics }    from './frames/Scene11_ReadExtractStatistics';
import { Scene12_IdentifyTrendsDraft }      from './frames/Scene12_IdentifyTrendsDraft';
import { Scene13_EachSubTaskAchievable }    from './frames/Scene13_EachSubTaskAchievable';
import { Scene14_TogetherComplete }         from './frames/Scene14_TogetherComplete';
import { Scene15_ModelGeneratesBreakdown }  from './frames/Scene15_ModelGeneratesBreakdown';
import { Scene16_ReasoningOrder }           from './frames/Scene16_ReasoningOrder';
import { Scene17_WhichDepend }              from './frames/Scene17_WhichDepend';
import { Scene18_DecompositionSeparates }   from './frames/Scene18_DecompositionSeparates';
import { Scene19_FromTasksAttempt }         from './frames/Scene19_FromTasksAttempt';
import { Scene20_QuestionUnderneath }       from './frames/Scene20_QuestionUnderneath';
import { Scene21_IsFixedSequence }          from './frames/Scene21_IsFixedSequence';
import { Scene22_ThatDistinction }          from './frames/Scene22_ThatDistinction';

export const AiDay34Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      {/* Audio plays from frame 0 — no Sequence wrapper, no delay */}
      <Audio src={staticFile('audio/Day 34.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_RecapStep />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_OneIterationOut />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_TodayOneLevelUp />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_WhatWhenGoalTooLarge />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_TaskDecompositionIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_MarketResearchExample />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_ModelCannotSimultaneous />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_DecompositionBreaks />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_SearchRecentData />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_ReadExtractStatistics />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_IdentifyTrendsDraft />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_EachSubTaskAchievable />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_TogetherComplete />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_ModelGeneratesBreakdown />
      </Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_ReasoningOrder />
      </Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_WhichDepend />
      </Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_DecompositionSeparates />
      </Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_FromTasksAttempt />
      </Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_QuestionUnderneath />
      </Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_IsFixedSequence />
      </Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_ThatDistinction />
      </Sequence>
    </AbsoluteFill>
  );
};
