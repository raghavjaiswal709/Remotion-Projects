/**
 * Day 41 — "Instance Variables vs Static Variables"
 * Series: Java / National Railway
 * Total: 2718 frames @ 30fps = ~90.58s (= audio duration exactly)
 * Audio: public/audio/java41.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene01  frames    0–192    Day intro — This is day 41...
 * Scene02  frames  193–290    Static block recap — Last day, we learned...
 * Scene03  frames  291–417    Before object exists — when the class loads...
 * Scene04  frames  418–560    Instance vs Static intro — Today, we learn...
 * Scene05  frames  561–628    Train class has both — The train class has both.
 * Scene06  frames  629–729    currentPassengerCount — Private int...
 * Scene07  frames  730–904    KL2401 own count — train KL2401 carries its own count.
 * Scene08  frames  905–1141   MH1102 separate — completely separate per object.
 * Scene09  frames 1142–1276   totalPassengersInSystem — Static int...
 * Scene10  frames 1277–1437   Shared across system — one copy shared...
 * Scene11  frames 1438–1602   Boarding passengers — KL2401 boards 300...
 * Scene12  frames 1603–1701   Count becomes 300 — currentPassengerCount becomes 300
 * Scene13  frames 1702–1849   System increases — totalPassengersInSystem increases by 300
 * Scene14  frames 1850–1912   Two different scopes
 * Scene15  frames 1913–2030   Lifetimes & purposes — two different lifetimes, two different purposes
 * Scene16  frames 2031–2161   Confuse them dashboard — control room dashboard reports wrong numbers
 * Scene17  frames 2162–2304   Booking system breaks — double count seats, financial reports break
 * Scene18  frames 2305–2436   Silent parent — every train has one silent parent
 * Scene19  frames 2437–2593   Three methods daily — parent gives three methods used every day
 * Scene20  frames 2594–2717   Object class next — That is the Object class, cover next
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_StaticBlockRecap } from './frames/Scene02_StaticBlockRecap';
import { Scene03_BeforeObjectExists } from './frames/Scene03_BeforeObjectExists';
import { Scene04_InstanceVsStaticIntro } from './frames/Scene04_InstanceVsStaticIntro';
import { Scene05_TrainClassHasBoth } from './frames/Scene05_TrainClassHasBoth';
import { Scene06_CurrentPassengerCount } from './frames/Scene06_CurrentPassengerCount';
import { Scene07_KL2401OwnCount } from './frames/Scene07_KL2401OwnCount';
import { Scene08_MH1102SeparateObject } from './frames/Scene08_MH1102SeparateObject';
import { Scene09_TotalPassengersStatic } from './frames/Scene09_TotalPassengersStatic';
import { Scene10_SharedAcrossSystem } from './frames/Scene10_SharedAcrossSystem';
import { Scene11_BoardingPassengers } from './frames/Scene11_BoardingPassengers';
import { Scene12_CountBecomes300 } from './frames/Scene12_CountBecomes300';
import { Scene13_SystemIncreases } from './frames/Scene13_SystemIncreases';
import { Scene14_TwoDifferentScopes } from './frames/Scene14_TwoDifferentScopes';
import { Scene15_LifetimesPurposes } from './frames/Scene15_LifetimesPurposes';
import { Scene16_ConfuseThemDashboard } from './frames/Scene16_ConfuseThemDashboard';
import { Scene17_BookingSystemBreaks } from './frames/Scene17_BookingSystemBreaks';
import { Scene18_SilentParent } from './frames/Scene18_SilentParent';
import { Scene19_ThreeMethodsDaily } from './frames/Scene19_ThreeMethodsDaily';
import { Scene20_ObjectClassNext } from './frames/Scene20_ObjectClassNext';

export const JavaDay41Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>

      {/* Audio plays from frame 0 — no Sequence wrapper, no delay */}
      <Audio src={staticFile('audio/java41.wav')} startFrom={0} />

      {/* Scene 01 — Day intro */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>

      {/* Scene 02 — Static block recap */}
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_StaticBlockRecap />
      </Sequence>

      {/* Scene 03 — Before object exists */}
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_BeforeObjectExists />
      </Sequence>

      {/* Scene 04 — Instance vs Static intro */}
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_InstanceVsStaticIntro />
      </Sequence>

      {/* Scene 05 — Train class has both */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_TrainClassHasBoth />
      </Sequence>

      {/* Scene 06 — currentPassengerCount */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_CurrentPassengerCount />
      </Sequence>

      {/* Scene 07 — KL2401 own count */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_KL2401OwnCount />
      </Sequence>

      {/* Scene 08 — MH1102 separate object */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_MH1102SeparateObject />
      </Sequence>

      {/* Scene 09 — totalPassengersInSystem static */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_TotalPassengersStatic />
      </Sequence>

      {/* Scene 10 — Shared across system */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_SharedAcrossSystem />
      </Sequence>

      {/* Scene 11 — Boarding passengers */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_BoardingPassengers />
      </Sequence>

      {/* Scene 12 — Count becomes 300 */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_CountBecomes300 />
      </Sequence>

      {/* Scene 13 — System increases */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_SystemIncreases />
      </Sequence>

      {/* Scene 14 — Two different scopes */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_TwoDifferentScopes />
      </Sequence>

      {/* Scene 15 — Lifetimes & purposes */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_LifetimesPurposes />
      </Sequence>

      {/* Scene 16 — Confuse them dashboard */}
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_ConfuseThemDashboard />
      </Sequence>

      {/* Scene 17 — Booking system breaks */}
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_BookingSystemBreaks />
      </Sequence>

      {/* Scene 18 — Silent parent */}
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_SilentParent />
      </Sequence>

      {/* Scene 19 — Three methods daily */}
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_ThreeMethodsDaily />
      </Sequence>

      {/* Scene 20 — Object class next */}
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_ObjectClassNext />
      </Sequence>

    </AbsoluteFill>
  );
};
