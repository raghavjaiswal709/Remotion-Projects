/**
 * ArtemisDay4 — "The Abort Button"
 * Series: HiddenWorld (Artemis II mini-series)
 * Total: 3225 frames @ 30fps = ~107.5s
 * Audio: public/audio/atri_second.wav
 *
 * SCENE SEQUENCE:
 * Scene01  frames    0–149    ScrollTimeline (SILENT)
 * Scene02  frames  150–258    One button, four astronauts
 * Scene03  frames  259–414    Day four intro
 * Scene04  frames  415–653    Last day recap
 * Scene05  frames  654–868    Abort button significance
 * Scene06  frames  869–1036   Launch abort system
 * Scene07  frames 1037–1260   Tower of rockets
 * Scene08  frames 1261–1417   Crew separates
 * Scene09  frames 1418–1571   Deep space abort
 * Scene10  frames 1572–1792   No tower no escape
 * Scene11  frames 1793–2033   Return trajectory
 * Scene12  frames 2034–2182   Every scenario
 * Scene13  frames 2183–2291   Response time
 * Scene14  frames 2292–2417   Failure mode
 * Scene15  frames 2418–2574   No improvisation
 * Scene16  frames 2575–2779   Tomorrow teaser
 * Scene17  frames 2743–2862   Key Takeaway
 * Scene18  frames 2863–3224   Outro
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_ScrollTimeline } from './frames/Scene01_ScrollTimeline';
import { Scene02_OneButton } from './frames/Scene02_OneButton';
import { Scene03_DayFourCard } from './frames/Scene03_DayFourCard';
import { Scene04_LastDayRecap } from './frames/Scene04_LastDayRecap';
import { Scene05_AbortButton } from './frames/Scene05_AbortButton';
import { Scene06_LaunchAbort } from './frames/Scene06_LaunchAbort';
import { Scene07_TowerOfRockets } from './frames/Scene07_TowerOfRockets';
import { Scene08_CrewSeparates } from './frames/Scene08_CrewSeparates';
import { Scene09_DeepSpaceAbort } from './frames/Scene09_DeepSpaceAbort';
import { Scene10_NoTowerNoEscape } from './frames/Scene10_NoTowerNoEscape';
import { Scene11_ReturnTrajectory } from './frames/Scene11_ReturnTrajectory';
import { Scene12_EveryScenario } from './frames/Scene12_EveryScenario';
import { Scene13_ResponseTime } from './frames/Scene13_ResponseTime';
import { Scene14_FailureMode } from './frames/Scene14_FailureMode';
import { Scene15_NoImprovisation } from './frames/Scene15_NoImprovisation';
import { Scene16_TomorrowTeaser } from './frames/Scene16_TomorrowTeaser';
import { Scene17_KeyTakeaway } from './frames/Scene17_KeyTakeaway';
import { Scene18_Outro } from './frames/Scene18_Outro';

export const ArtemisDay4Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      {/* Audio starts at composition frame 150 (after silent scroll) */}
      <Sequence from={150} durationInFrames={2563}>
        <Audio src={staticFile('audio/atri_second.wav')} startFrom={0} />
      </Sequence>

      {/* Scene 01 — Scrolling Day Timeline (SILENT) */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_ScrollTimeline currentDay={4} totalDays={100} seriesTitle="HIDDEN WORLD SECRETS" />
      </Sequence>

      {/* Scene 02 — One button, four astronauts */}
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_OneButton />
      </Sequence>

      {/* Scene 03 — Day four intro */}
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_DayFourCard />
      </Sequence>

      {/* Scene 04 — Last day recap */}
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_LastDayRecap />
      </Sequence>

      {/* Scene 05 — Abort button significance */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_AbortButton />
      </Sequence>

      {/* Scene 06 — Launch abort system */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_LaunchAbort />
      </Sequence>

      {/* Scene 07 — Tower of rockets */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_TowerOfRockets />
      </Sequence>

      {/* Scene 08 — Crew separates */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_CrewSeparates />
      </Sequence>

      {/* Scene 09 — Deep space abort */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_DeepSpaceAbort />
      </Sequence>

      {/* Scene 10 — No tower, no escape */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_NoTowerNoEscape />
      </Sequence>

      {/* Scene 11 — Return trajectory */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_ReturnTrajectory />
      </Sequence>

      {/* Scene 12 — Every scenario */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_EveryScenario />
      </Sequence>

      {/* Scene 13 — Response time */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_ResponseTime />
      </Sequence>

      {/* Scene 14 — Failure mode */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_FailureMode />
      </Sequence>

      {/* Scene 15 — No improvisation */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_NoImprovisation />
      </Sequence>

      {/* Scene 16 — Tomorrow teaser */}
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_TomorrowTeaser />
      </Sequence>

      {/* Scene 17 — Key Takeaway */}
      <Sequence from={SCENE_TIMING.s_takeaway.from} durationInFrames={SCENE_TIMING.s_takeaway.duration} premountFor={30}>
        <Scene17_KeyTakeaway />
      </Sequence>

      {/* Scene 18 — Outro */}
      <Sequence from={SCENE_TIMING.s_outro.from} durationInFrames={SCENE_TIMING.s_outro.duration} premountFor={30}>
        <Scene18_Outro
          currentDay={4}
          nextDay={5}
          nextTopic="Orion Splashdown"
          seriesTitle="Hidden World"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
