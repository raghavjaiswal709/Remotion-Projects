/**
 * Day 27 — "What Is a Tool?"
 * Series: Agentic AI
 * Total: 3040 frames @ 30fps = ~101.3s
 * Audio: public/audio/ai27.wav (79.020s)
 *
 * SCENE SEQUENCE:
 * Scene01  frames    0–149    ScrollTimeline (SILENT)
 * Scene02  frames  150–309    Day intro
 * Scene03  frames  310–416    Observation recap
 * Scene04  frames  417–568    Tool definition
 * Scene05  frames  573–733    Tool examples
 * Scene06  frames  738–942    Bounded capability
 * Scene07  frames  943–1081   Model doesn't execute
 * Scene08  frames 1082–1332   Tool call structure
 * Scene09  frames 1333–1403   Runtime reads output
 * Scene10  frames 1404–1564   Function execution
 * Scene11  frames 1565–1659   Model decides
 * Scene12  frames 1660–1738   Separation matters
 * Scene13  frames 1739–1973   Model reasoning
 * Scene14  frames 1974–2154   Tool execution
 * Scene15  frames 2155–2261   Search tool
 * Scene16  frames 2262–2353   Code tool
 * Scene17  frames 2354–2477   Browser tool
 * Scene18  frames 2478–2557   Agent's hands
 * Scene19  frames 2558–2677   Key Takeaway
 * Scene20  frames 2678–3039   Outro
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_ScrollTimeline } from './frames/Scene01_ScrollTimeline';
import { Scene02_DayIntro } from './frames/Scene02_DayIntro';
import { Scene03_ObservationRecap } from './frames/Scene03_ObservationRecap';
import { Scene04_ToolDefinition } from './frames/Scene04_ToolDefinition';
import { Scene05_ToolExamples } from './frames/Scene05_ToolExamples';
import { Scene06_BoundedCapability } from './frames/Scene06_BoundedCapability';
import { Scene07_ModelDoesntExecute } from './frames/Scene07_ModelDoesntExecute';
import { Scene08_ToolCallStructure } from './frames/Scene08_ToolCallStructure';
import { Scene09_RuntimeReadsOutput } from './frames/Scene09_RuntimeReadsOutput';
import { Scene10_FunctionExecution } from './frames/Scene10_FunctionExecution';
import { Scene11_ModelDecides } from './frames/Scene11_ModelDecides';
import { Scene12_SeparationMatters } from './frames/Scene12_SeparationMatters';
import { Scene13_ModelReasoning } from './frames/Scene13_ModelReasoning';
import { Scene14_ToolExecution } from './frames/Scene14_ToolExecution';
import { Scene15_SearchTool } from './frames/Scene15_SearchTool';
import { Scene16_CodeTool } from './frames/Scene16_CodeTool';
import { Scene17_BrowserTool } from './frames/Scene17_BrowserTool';
import { Scene18_AgentHands } from './frames/Scene18_AgentHands';
import { Scene19_KeyTakeaway } from './frames/Scene19_KeyTakeaway';
import { Scene20_Outro } from './frames/Scene20_Outro';

export const AiDay27Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>

      {/* Audio starts at composition frame 150 (after silent scroll) */}
      <Sequence from={150} durationInFrames={2371}>
        <Audio src={staticFile('audio/ai27.wav')} startFrom={0} />
      </Sequence>

      {/* Scene 01 — Scrolling Day Timeline (SILENT) */}
      <Sequence
        from={SCENE_TIMING.s01.from}
        durationInFrames={SCENE_TIMING.s01.duration}
        premountFor={30}
      >
        <Scene01_ScrollTimeline
          currentDay={27}
          totalDays={120}
          seriesTitle="AGENTIC AI · FIRST PRINCIPLES"
        />
      </Sequence>

      {/* Scene 02 — Day intro */}
      <Sequence
        from={SCENE_TIMING.s02.from}
        durationInFrames={SCENE_TIMING.s02.duration}
        premountFor={30}
      >
        <Scene02_DayIntro />
      </Sequence>

      {/* Scene 03 — Observation recap */}
      <Sequence
        from={SCENE_TIMING.s03.from}
        durationInFrames={SCENE_TIMING.s03.duration}
        premountFor={30}
      >
        <Scene03_ObservationRecap />
      </Sequence>

      {/* Scene 04 — Tool definition */}
      <Sequence
        from={SCENE_TIMING.s04.from}
        durationInFrames={SCENE_TIMING.s04.duration}
        premountFor={30}
      >
        <Scene04_ToolDefinition />
      </Sequence>

      {/* Scene 05 — Tool examples */}
      <Sequence
        from={SCENE_TIMING.s05.from}
        durationInFrames={SCENE_TIMING.s05.duration}
        premountFor={30}
      >
        <Scene05_ToolExamples />
      </Sequence>

      {/* Scene 06 — Bounded capability */}
      <Sequence
        from={SCENE_TIMING.s06.from}
        durationInFrames={SCENE_TIMING.s06.duration}
        premountFor={30}
      >
        <Scene06_BoundedCapability />
      </Sequence>

      {/* Scene 07 — Model doesn't execute */}
      <Sequence
        from={SCENE_TIMING.s07.from}
        durationInFrames={SCENE_TIMING.s07.duration}
        premountFor={30}
      >
        <Scene07_ModelDoesntExecute />
      </Sequence>

      {/* Scene 08 — Tool call structure */}
      <Sequence
        from={SCENE_TIMING.s08.from}
        durationInFrames={SCENE_TIMING.s08.duration}
        premountFor={30}
      >
        <Scene08_ToolCallStructure />
      </Sequence>

      {/* Scene 09 — Runtime reads output */}
      <Sequence
        from={SCENE_TIMING.s09.from}
        durationInFrames={SCENE_TIMING.s09.duration}
        premountFor={30}
      >
        <Scene09_RuntimeReadsOutput />
      </Sequence>

      {/* Scene 10 — Function execution */}
      <Sequence
        from={SCENE_TIMING.s10.from}
        durationInFrames={SCENE_TIMING.s10.duration}
        premountFor={30}
      >
        <Scene10_FunctionExecution />
      </Sequence>

      {/* Scene 11 — Model decides */}
      <Sequence
        from={SCENE_TIMING.s11.from}
        durationInFrames={SCENE_TIMING.s11.duration}
        premountFor={30}
      >
        <Scene11_ModelDecides />
      </Sequence>

      {/* Scene 12 — Separation matters */}
      <Sequence
        from={SCENE_TIMING.s12.from}
        durationInFrames={SCENE_TIMING.s12.duration}
        premountFor={30}
      >
        <Scene12_SeparationMatters />
      </Sequence>

      {/* Scene 13 — Model reasoning */}
      <Sequence
        from={SCENE_TIMING.s13.from}
        durationInFrames={SCENE_TIMING.s13.duration}
        premountFor={30}
      >
        <Scene13_ModelReasoning />
      </Sequence>

      {/* Scene 14 — Tool execution */}
      <Sequence
        from={SCENE_TIMING.s14.from}
        durationInFrames={SCENE_TIMING.s14.duration}
        premountFor={30}
      >
        <Scene14_ToolExecution />
      </Sequence>

      {/* Scene 15 — Search tool */}
      <Sequence
        from={SCENE_TIMING.s15.from}
        durationInFrames={SCENE_TIMING.s15.duration}
        premountFor={30}
      >
        <Scene15_SearchTool />
      </Sequence>

      {/* Scene 16 — Code tool */}
      <Sequence
        from={SCENE_TIMING.s16.from}
        durationInFrames={SCENE_TIMING.s16.duration}
        premountFor={30}
      >
        <Scene16_CodeTool />
      </Sequence>

      {/* Scene 17 — Browser tool */}
      <Sequence
        from={SCENE_TIMING.s17.from}
        durationInFrames={SCENE_TIMING.s17.duration}
        premountFor={30}
      >
        <Scene17_BrowserTool />
      </Sequence>

      {/* Scene 18 — Agent's hands */}
      <Sequence
        from={SCENE_TIMING.s18.from}
        durationInFrames={SCENE_TIMING.s18.duration}
        premountFor={30}
      >
        <Scene18_AgentHands />
      </Sequence>

      {/* Scene 19 — Key Takeaway */}
      <Sequence
        from={SCENE_TIMING.s_takeaway.from}
        durationInFrames={SCENE_TIMING.s_takeaway.duration}
        premountFor={30}
      >
        <Scene19_KeyTakeaway />
      </Sequence>

      {/* Scene 20 — Outro */}
      <Sequence
        from={SCENE_TIMING.s_outro.from}
        durationInFrames={SCENE_TIMING.s_outro.duration}
        premountFor={30}
      >
        <Scene20_Outro
          currentDay={27}
          nextDay={28}
          nextTopic="What Is Tool Calling?"
          seriesTitle="AGENTIC AI · FIRST PRINCIPLES"
        />
      </Sequence>

    </AbsoluteFill>
  );
};
