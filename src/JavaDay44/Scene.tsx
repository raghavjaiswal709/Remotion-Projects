/**
 * Day 44 — "Method Overloading"
 * Series: Java / National Railway
 * Total: 2216 frames @ 30fps = ~73.87s (= audio duration exactly)
 * Audio: public/audio/Java 44.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene01  frames   0–174    Day intro
 * Scene02  frames 175–411    Compile-time recap
 * Scene03  frames 412–517    Fare engine
 * Scene04  frames 518–582    Route only
 * Scene05  frames 583–653    Seat class
 * Scene06  frames 654–742    Peak hour
 * Scene07  frames 743–920    Three signatures
 * Scene08  frames 921–964    Fare route
 * Scene09  frames 965–1033   Fare route class
 * Scene10  frames 1034–1135  Fare route peak
 * Scene11  frames 1136–1259  Compiler selects
 * Scene12  frames 1260–1318  Never explicitly
 * Scene13  frames 1319–1385  Signature chooses
 * Scene14  frames 1386–1450  Method overloading
 * Scene15  frames 1451–1510  Same name different
 * Scene16  frames 1511–1573  Compile time resolved
 * Scene17  frames 1574–1660  Booking officer calls
 * Scene18  frames 1661–1745  Method adapts
 * Scene19  frames 1746–1802  Calling code clean
 * Scene20  frames 1803–1884  Implementation handles
 * Scene21  frames 1885–2014  Parent child conflict
 * Scene22  frames 2015–2094  Compile time limitation
 * Scene23  frames 2095–2161  Runtime polymorphism reveal
 * Scene24  frames 2162–2215  Teaser next
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_CompileTimeRecap } from './frames/Scene02_CompileTimeRecap';
import { Scene03_FareEngine } from './frames/Scene03_FareEngine';
import { Scene04_RouteOnly } from './frames/Scene04_RouteOnly';
import { Scene05_SeatClass } from './frames/Scene05_SeatClass';
import { Scene06_PeakHour } from './frames/Scene06_PeakHour';
import { Scene07_ThreeSignatures } from './frames/Scene07_ThreeSignatures';
import { Scene08_FareRoute } from './frames/Scene08_FareRoute';
import { Scene09_FareRouteClass } from './frames/Scene09_FareRouteClass';
import { Scene10_FareRoutePeak } from './frames/Scene10_FareRoutePeak';
import { Scene11_CompilerSelects } from './frames/Scene11_CompilerSelects';
import { Scene12_NeverExplicitly } from './frames/Scene12_NeverExplicitly';
import { Scene13_SignatureChooses } from './frames/Scene13_SignatureChooses';
import { Scene14_MethodOverloading } from './frames/Scene14_MethodOverloading';
import { Scene15_SameNameDifferent } from './frames/Scene15_SameNameDifferent';
import { Scene16_CompileTimeResolved } from './frames/Scene16_CompileTimeResolved';
import { Scene17_BookingOfficerCalls } from './frames/Scene17_BookingOfficerCalls';
import { Scene18_MethodAdapts } from './frames/Scene18_MethodAdapts';
import { Scene19_CallingCodeClean } from './frames/Scene19_CallingCodeClean';
import { Scene20_ImplementationHandles } from './frames/Scene20_ImplementationHandles';
import { Scene21_ParentChildConflict } from './frames/Scene21_ParentChildConflict';
import { Scene22_CompileTimeLimitation } from './frames/Scene22_CompileTimeLimitation';
import { Scene23_RuntimePolymorphismReveal } from './frames/Scene23_RuntimePolymorphismReveal';
import { Scene24_TeaserNext } from './frames/Scene24_TeaserNext';

export const JavaDay44Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>

      {/* Audio plays from frame 0 — no Sequence wrapper, no delay */}
      <Audio src={staticFile('audio/Java 44.wav')} startFrom={0} />

      {/* Scene 01 — Day intro */}
      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>

      {/* Scene 02 — Compile-time recap */}
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_CompileTimeRecap />
      </Sequence>

      {/* Scene 03 — Fare engine */}
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_FareEngine />
      </Sequence>

      {/* Scene 04 — Route only */}
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_RouteOnly />
      </Sequence>

      {/* Scene 05 — Seat class */}
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_SeatClass />
      </Sequence>

      {/* Scene 06 — Peak hour */}
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_PeakHour />
      </Sequence>

      {/* Scene 07 — Three signatures */}
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_ThreeSignatures />
      </Sequence>

      {/* Scene 08 — calculateFare(route) */}
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_FareRoute />
      </Sequence>

      {/* Scene 09 — calculateFare(route, seatClass) */}
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_FareRouteClass />
      </Sequence>

      {/* Scene 10 — calculateFare(route, seatClass, isPeakHour) */}
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_FareRoutePeak />
      </Sequence>

      {/* Scene 11 — Compiler selects */}
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_CompilerSelects />
      </Sequence>

      {/* Scene 12 — Never explicitly */}
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_NeverExplicitly />
      </Sequence>

      {/* Scene 13 — Signature chooses */}
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_SignatureChooses />
      </Sequence>

      {/* Scene 14 — Method overloading */}
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_MethodOverloading />
      </Sequence>

      {/* Scene 15 — Same name different */}
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_SameNameDifferent />
      </Sequence>

      {/* Scene 16 — Compile time resolved */}
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_CompileTimeResolved />
      </Sequence>

      {/* Scene 17 — Booking officer calls */}
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_BookingOfficerCalls />
      </Sequence>

      {/* Scene 18 — Method adapts */}
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_MethodAdapts />
      </Sequence>

      {/* Scene 19 — Calling code clean */}
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_CallingCodeClean />
      </Sequence>

      {/* Scene 20 — Implementation handles */}
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_ImplementationHandles />
      </Sequence>

      {/* Scene 21 — Parent child conflict */}
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_ParentChildConflict />
      </Sequence>

      {/* Scene 22 — Compile time limitation */}
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_CompileTimeLimitation />
      </Sequence>

      {/* Scene 23 — Runtime polymorphism reveal */}
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}>
        <Scene23_RuntimePolymorphismReveal />
      </Sequence>

      {/* Scene 24 — Teaser next */}
      <Sequence from={SCENE_TIMING.s24.from} durationInFrames={SCENE_TIMING.s24.duration} premountFor={30}>
        <Scene24_TeaserNext />
      </Sequence>

    </AbsoluteFill>
  );
};
