/**
 * Moon — "The Moon's Shadow: Apollo 8's 45 Minutes of Silence"
 * Style: Dark Premium Editorial (style_dafault.md)
 * Main scene orchestrator.
 *
 * Exports: MoonScene (referenced by Root.tsx)
 * Total: 2903 frames @ 30fps ≈ 96.8 seconds
 *
 * Audio: public/audio/moon.wav — place your narration file there.
 *
 * Scene map:
 *   s01 DayCard          0   → 90    (3s pre-roll)
 *   s02 Spacecraft       90  → 264   (audio 0.000 → 5.300s)
 *   s03 NotGradually     264 → 526   (audio 5.800 → 14.540s)
 *   s04 LossOfSignal     526 → 704   (audio 14.540 → 20.460s)
 *   s05 RadioWaves       704 → 932   (audio 20.460 → 28.080s)
 *   s06 Engineers        932 → 1072  (audio 28.080 → 32.720s)
 *   s07 Trajectory       1072 → 1394 (audio 32.720 → 43.480s)
 *   s08 Apollo8          1394 → 1535 (audio 43.480 → 48.160s)
 *   s09 MissionControl   1535 → 1836 (audio 48.160 → 58.200s)
 *   s10 CrewAlone        1836 → 2063 (audio 58.200 → 65.760s)
 *   s11 Depended         2063 → 2207 (audio 65.760 → 70.580s)
 *   s12 SignalRestored   2207 → 2402 (audio 70.580 → 77.060s)
 *   s13 CrewAlive        2402 → 2460 (audio 77.060 → 79.000s)
 *   s14 HistoryMade      2460 → 2693 (audio 79.000 → 86.760s)
 *   s15 Outro            2693 → 2903 (post-audio)
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING } from './helpers/timing';

import { Scene01_DayCard }                from './frames/Scene01_DayCard';
import { Scene02_SpacecraftVanishes }     from './frames/Scene02_SpacecraftVanishes';
import { Scene03_NotGradually }           from './frames/Scene03_NotGradually';
import { Scene04_LossOfSignal }           from './frames/Scene04_LossOfSignal';
import { Scene05_RadioWaves }             from './frames/Scene05_RadioWaves';
import { Scene06_EngineersCalculate }     from './frames/Scene06_EngineersCalculate';
import { Scene07_TrajectoryAndCurvature } from './frames/Scene07_TrajectoryAndCurvature';
import { Scene08_Apollo8Blackout }        from './frames/Scene08_Apollo8Blackout';
import { Scene09_MissionControlSilence }  from './frames/Scene09_MissionControlSilence';
import { Scene10_CrewAlone }             from './frames/Scene10_CrewAlone';
import { Scene11_EverythingDepended }    from './frames/Scene11_EverythingDepended';
import { Scene12_SignalRestored }         from './frames/Scene12_SignalRestored';
import { Scene13_CrewAlive }             from './frames/Scene13_CrewAlive';
import { Scene14_HistoryMade }           from './frames/Scene14_HistoryMade';
import { Scene15_Outro }                 from './frames/Scene15_Outro';

export const MoonScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      {/* Audio — place narration at public/audio/moon.wav */}
      <Sequence from={SCENE_TIMING.s01.duration}>
        <Audio src={staticFile('audio/moon.wav')} startFrom={0} />
      </Sequence>

      {/* Scene 01 — Day Card (pre-audio) */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration}>
        <Scene01_DayCard />
      </Sequence>

      {/* Scene 02 — Spacecraft Vanishes */}
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration}>
        <Scene02_SpacecraftVanishes />
      </Sequence>

      {/* Scene 03 — Not Gradually */}
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration}>
        <Scene03_NotGradually />
      </Sequence>

      {/* Scene 04 — Loss of Signal */}
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration}>
        <Scene04_LossOfSignal />
      </Sequence>

      {/* Scene 05 — Radio Waves */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration}>
        <Scene05_RadioWaves />
      </Sequence>

      {/* Scene 06 — Engineers Calculate */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration}>
        <Scene06_EngineersCalculate />
      </Sequence>

      {/* Scene 07 — Trajectory & Curvature */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration}>
        <Scene07_TrajectoryAndCurvature />
      </Sequence>

      {/* Scene 08 — Apollo 8 Blackout */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration}>
        <Scene08_Apollo8Blackout />
      </Sequence>

      {/* Scene 09 — Mission Control Silence */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration}>
        <Scene09_MissionControlSilence />
      </Sequence>

      {/* Scene 10 — Crew Alone */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration}>
        <Scene10_CrewAlone />
      </Sequence>

      {/* Scene 11 — Everything Depended */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration}>
        <Scene11_EverythingDepended />
      </Sequence>

      {/* Scene 12 — Signal Restored */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration}>
        <Scene12_SignalRestored />
      </Sequence>

      {/* Scene 13 — Crew Alive */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration}>
        <Scene13_CrewAlive />
      </Sequence>

      {/* Scene 14 — History Made */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration}>
        <Scene14_HistoryMade />
      </Sequence>

      {/* Scene 15 — Outro */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration}>
        <Scene15_Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
