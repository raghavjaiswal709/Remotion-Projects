/**
 * Day 27 â€” "What Is a Tool?"
 * Series: Agentic AI
 * Total: 2371 frames @ 30fps = ~79.0s (= audio duration exactly)
 * Audio: public/audio/ai27.wav (79.020s)
 *
 * NO structural scenes â€” video length = script/audio length only
 * Audio plays from frame 0 â€” no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene02  frames    0â€“159    Day intro
 * Scene03  frames  160â€“265    Observation recap
 * Scene04  frames  266â€“422    Tool definition
 * Scene05  frames  423â€“587    Tool examples
 * Scene06  frames  588â€“774    Bounded capability
 * Scene07  frames  775â€“909    Model doesn't execute
 * Scene08  frames  910â€“1163   Tool call structure
 * Scene09  frames 1164â€“1231   Runtime reads output
 * Scene10  frames 1232â€“1395   Function execution
 * Scene11  frames 1396â€“1503   Model decides
 * Scene12  frames 1504â€“1564   Separation matters
 * Scene13  frames 1565â€“1798   Model reasoning
 * Scene14  frames 1799â€“1981   Tool execution
 * Scene15  frames 1982â€“2086   Search tool
 * Scene16  frames 2087â€“2179   Code tool
 * Scene17  frames 2180â€“2308   Browser tool
 * Scene18  frames 2309â€“2370   Agent's hands
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

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

export const AiDay27Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>

      {/* Audio plays from frame 0 â€” no Sequence wrapper, no delay */}
      <Audio src={staticFile('audio/ai27.wav')} startFrom={0} />

      {/* Scene 02 â€” Day intro */}
      <Sequence
        from={SCENE_TIMING.s02.from}
        durationInFrames={SCENE_TIMING.s02.duration}
        premountFor={30}
      >
        <Scene02_DayIntro />
      </Sequence>

      {/* Scene 03 â€” Observation recap */}
      <Sequence
        from={SCENE_TIMING.s03.from}
        durationInFrames={SCENE_TIMING.s03.duration}
        premountFor={30}
      >
        <Scene03_ObservationRecap />
      </Sequence>

      {/* Scene 04 â€” Tool definition */}
      <Sequence
        from={SCENE_TIMING.s04.from}
        durationInFrames={SCENE_TIMING.s04.duration}
        premountFor={30}
      >
        <Scene04_ToolDefinition />
      </Sequence>

      {/* Scene 05 â€” Tool examples */}
      <Sequence
        from={SCENE_TIMING.s05.from}
        durationInFrames={SCENE_TIMING.s05.duration}
        premountFor={30}
      >
        <Scene05_ToolExamples />
      </Sequence>

      {/* Scene 06 â€” Bounded capability */}
      <Sequence
        from={SCENE_TIMING.s06.from}
        durationInFrames={SCENE_TIMING.s06.duration}
        premountFor={30}
      >
        <Scene06_BoundedCapability />
      </Sequence>

      {/* Scene 07 â€” Model doesn't execute */}
      <Sequence
        from={SCENE_TIMING.s07.from}
        durationInFrames={SCENE_TIMING.s07.duration}
        premountFor={30}
      >
        <Scene07_ModelDoesntExecute />
      </Sequence>

      {/* Scene 08 â€” Tool call structure */}
      <Sequence
        from={SCENE_TIMING.s08.from}
        durationInFrames={SCENE_TIMING.s08.duration}
        premountFor={30}
      >
        <Scene08_ToolCallStructure />
      </Sequence>

      {/* Scene 09 â€” Runtime reads output */}
      <Sequence
        from={SCENE_TIMING.s09.from}
        durationInFrames={SCENE_TIMING.s09.duration}
        premountFor={30}
      >
        <Scene09_RuntimeReadsOutput />
      </Sequence>

      {/* Scene 10 â€” Function execution */}
      <Sequence
        from={SCENE_TIMING.s10.from}
        durationInFrames={SCENE_TIMING.s10.duration}
        premountFor={30}
      >
        <Scene10_FunctionExecution />
      </Sequence>

      {/* Scene 11 â€” Model decides */}
      <Sequence
        from={SCENE_TIMING.s11.from}
        durationInFrames={SCENE_TIMING.s11.duration}
        premountFor={30}
      >
        <Scene11_ModelDecides />
      </Sequence>

      {/* Scene 12 â€” Separation matters */}
      <Sequence
        from={SCENE_TIMING.s12.from}
        durationInFrames={SCENE_TIMING.s12.duration}
        premountFor={30}
      >
        <Scene12_SeparationMatters />
      </Sequence>

      {/* Scene 13 â€” Model reasoning */}
      <Sequence
        from={SCENE_TIMING.s13.from}
        durationInFrames={SCENE_TIMING.s13.duration}
        premountFor={30}
      >
        <Scene13_ModelReasoning />
      </Sequence>

      {/* Scene 14 â€” Tool execution */}
      <Sequence
        from={SCENE_TIMING.s14.from}
        durationInFrames={SCENE_TIMING.s14.duration}
        premountFor={30}
      >
        <Scene14_ToolExecution />
      </Sequence>

      {/* Scene 15 â€” Search tool */}
      <Sequence
        from={SCENE_TIMING.s15.from}
        durationInFrames={SCENE_TIMING.s15.duration}
        premountFor={30}
      >
        <Scene15_SearchTool />
      </Sequence>

      {/* Scene 16 â€” Code tool */}
      <Sequence
        from={SCENE_TIMING.s16.from}
        durationInFrames={SCENE_TIMING.s16.duration}
        premountFor={30}
      >
        <Scene16_CodeTool />
      </Sequence>

      {/* Scene 17 â€” Browser tool */}
      <Sequence
        from={SCENE_TIMING.s17.from}
        durationInFrames={SCENE_TIMING.s17.duration}
        premountFor={30}
      >
        <Scene17_BrowserTool />
      </Sequence>

      {/* Scene 18 â€” Agent's hands */}
      <Sequence
        from={SCENE_TIMING.s18.from}
        durationInFrames={SCENE_TIMING.s18.duration}
        premountFor={30}
      >
        <Scene18_AgentHands />
      </Sequence>

    </AbsoluteFill>
  );
};
