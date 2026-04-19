/**
 * Day 48 — "instanceof keyword"
 * Series: Java / National Railway
 * Total: 2683 frames @ 30fps = ~89.42s (= audio duration exactly)
 * Audio: public/audio/Java 48.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE (29 content scenes):
 * Scene01  frames    0–181    Day intro
 * Scene02  frames  182–366    Downcasting recap
 * Scene03  frames  367–475    Wrong cast crash
 * Scene04  frames  476–583    The fix intro
 * Scene05  frames  584–676    instanceof code
 * Scene06  frames  677–720    Asks Java
 * Scene07  frames  721–838    Object belong
 * Scene08  frames  839–906    Yes proceed
 * Scene09  frames  907–976    No skip
 * Scene10  frames  977–1014   No crash
 * Scene11  frames 1015–1085   instanceof keyword
 * Scene12  frames 1086–1190   Runtime verification
 * Scene13  frames 1191–1333   Premium module
 * Scene14  frames 1334–1395   If instanceof
 * Scene15  frames 1396–1433   Cast it
 * Scene16  frames 1434–1506   Express methods
 * Scene17  frames 1507–1575   Else if metro
 * Scene18  frames 1576–1613   Cast metro
 * Scene19  frames 1614–1678   Metro methods
 * Scene20  frames 1679–1777   Branch safety
 * Scene21  frames 1778–1883   System context
 * Scene22  frames 1884–1978   The gate
 * Scene23  frames 1979–2041   Downcast without
 * Scene24  frames 2042–2116   Trusting assumption
 * Scene25  frames 2117–2193   Large system risk
 * Scene26  frames 2194–2265   Tomorrow preview
 * Scene27  frames 2266–2347   Pattern matching
 * Scene28  frames 2348–2416   No separate cast
 * Scene29  frames 2417–2682   Outro
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_DowncastingRecap } from './frames/Scene02_DowncastingRecap';
import { Scene03_WrongCastCrash } from './frames/Scene03_WrongCastCrash';
import { Scene04_TheFixIntro } from './frames/Scene04_TheFixIntro';
import { Scene05_InstanceofCode } from './frames/Scene05_InstanceofCode';
import { Scene06_AsksJava } from './frames/Scene06_AsksJava';
import { Scene07_ObjectBelong } from './frames/Scene07_ObjectBelong';
import { Scene08_YesProceed } from './frames/Scene08_YesProceed';
import { Scene09_NoSkip } from './frames/Scene09_NoSkip';
import { Scene10_NoCrash } from './frames/Scene10_NoCrash';
import { Scene11_InstanceofKeyword } from './frames/Scene11_InstanceofKeyword';
import { Scene12_RuntimeVerification } from './frames/Scene12_RuntimeVerification';
import { Scene13_PremiumModule } from './frames/Scene13_PremiumModule';
import { Scene14_IfInstanceof } from './frames/Scene14_IfInstanceof';
import { Scene15_CastIt } from './frames/Scene15_CastIt';
import { Scene16_ExpressMethods } from './frames/Scene16_ExpressMethods';
import { Scene17_ElseIfMetro } from './frames/Scene17_ElseIfMetro';
import { Scene18_CastMetro } from './frames/Scene18_CastMetro';
import { Scene19_MetroMethods } from './frames/Scene19_MetroMethods';
import { Scene20_BranchSafety } from './frames/Scene20_BranchSafety';
import { Scene21_SystemContext } from './frames/Scene21_SystemContext';
import { Scene22_TheGate } from './frames/Scene22_TheGate';
import { Scene23_DowncastWithout } from './frames/Scene23_DowncastWithout';
import { Scene24_TrustingAssumption } from './frames/Scene24_TrustingAssumption';
import { Scene25_LargeSystemRisk } from './frames/Scene25_LargeSystemRisk';
import { Scene26_TomorrowPreview } from './frames/Scene26_TomorrowPreview';
import { Scene27_PatternMatching } from './frames/Scene27_PatternMatching';
import { Scene28_NoSeparateCast } from './frames/Scene28_NoSeparateCast';
import { Scene29_Outro } from './frames/Scene29_Outro';

export const JavaDay48Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/Java 48.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_DowncastingRecap />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_WrongCastCrash />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_TheFixIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_InstanceofCode />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_AsksJava />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_ObjectBelong />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_YesProceed />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_NoSkip />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_NoCrash />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_InstanceofKeyword />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_RuntimeVerification />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_PremiumModule />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_IfInstanceof />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_CastIt />
      </Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_ExpressMethods />
      </Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_ElseIfMetro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_CastMetro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_MetroMethods />
      </Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_BranchSafety />
      </Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_SystemContext />
      </Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_TheGate />
      </Sequence>
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}>
        <Scene23_DowncastWithout />
      </Sequence>
      <Sequence from={SCENE_TIMING.s24.from} durationInFrames={SCENE_TIMING.s24.duration} premountFor={30}>
        <Scene24_TrustingAssumption />
      </Sequence>
      <Sequence from={SCENE_TIMING.s25.from} durationInFrames={SCENE_TIMING.s25.duration} premountFor={30}>
        <Scene25_LargeSystemRisk />
      </Sequence>
      <Sequence from={SCENE_TIMING.s26.from} durationInFrames={SCENE_TIMING.s26.duration} premountFor={30}>
        <Scene26_TomorrowPreview />
      </Sequence>
      <Sequence from={SCENE_TIMING.s27.from} durationInFrames={SCENE_TIMING.s27.duration} premountFor={30}>
        <Scene27_PatternMatching />
      </Sequence>
      <Sequence from={SCENE_TIMING.s28.from} durationInFrames={SCENE_TIMING.s28.duration} premountFor={30}>
        <Scene28_NoSeparateCast />
      </Sequence>
      <Sequence from={SCENE_TIMING.s29.from} durationInFrames={SCENE_TIMING.s29.duration} premountFor={30}>
        <Scene29_Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
