/**
 * Day 47 — "Downcasting"
 * Series: Java / National Railway
 * Total: 2641 frames @ 30fps = ~88.020s (= audio duration exactly)
 * Audio: public/audio/java 47.wav
 *
 * 24 content scenes, no structural scenes.
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_UpcastingRecap } from './frames/Scene02_UpcastingRecap';
import { Scene03_NarrowingAccess } from './frames/Scene03_NarrowingAccess';
import { Scene04_PremiumServicesNeed } from './frames/Scene04_PremiumServicesNeed';
import { Scene05_ReferenceTrainT } from './frames/Scene05_ReferenceTrainT';
import { Scene06_ActualObjectInMemory } from './frames/Scene06_ActualObjectInMemory';
import { Scene07_AccessExpressMethods } from './frames/Scene07_AccessExpressMethods';
import { Scene08_ExplicitCast } from './frames/Scene08_ExplicitCast';
import { Scene09_CastSyntax } from './frames/Scene09_CastSyntax';
import { Scene10_ThisIsDowncasting } from './frames/Scene10_ThisIsDowncasting';
import { Scene11_ExplicitCastDef } from './frames/Scene11_ExplicitCastDef';
import { Scene12_RiskWarning } from './frames/Scene12_RiskWarning';
import { Scene13_WrongObjectMemory } from './frames/Scene13_WrongObjectMemory';
import { Scene14_FreightTrainScenario } from './frames/Scene14_FreightTrainScenario';
import { Scene15_ClassCastException } from './frames/Scene15_ClassCastException';
import { Scene16_NotCompileRuntime } from './frames/Scene16_NotCompileRuntime';
import { Scene17_CrashesInProduction } from './frames/Scene17_CrashesInProduction';
import { Scene18_CompilesCleanly } from './frames/Scene18_CompilesCleanly';
import { Scene19_CannotVerifyUntilRuns } from './frames/Scene19_CannotVerifyUntilRuns';
import { Scene20_NeverDoneBlindly } from './frames/Scene20_NeverDoneBlindly';
import { Scene21_BeforeCastingVerify } from './frames/Scene21_BeforeCastingVerify';
import { Scene22_AskJavaIsThisObject } from './frames/Scene22_AskJavaIsThisObject';
import { Scene23_SafetyCheckHasName } from './frames/Scene23_SafetyCheckHasName';
import { Scene24_CoverInNextPart } from './frames/Scene24_CoverInNextPart';

export const JavaDay47Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/java 47.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_UpcastingRecap />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_NarrowingAccess />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_PremiumServicesNeed />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_ReferenceTrainT />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_ActualObjectInMemory />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_AccessExpressMethods />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_ExplicitCast />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_CastSyntax />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_ThisIsDowncasting />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_ExplicitCastDef />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_RiskWarning />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_WrongObjectMemory />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_FreightTrainScenario />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_ClassCastException />
      </Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_NotCompileRuntime />
      </Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_CrashesInProduction />
      </Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_CompilesCleanly />
      </Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_CannotVerifyUntilRuns />
      </Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_NeverDoneBlindly />
      </Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_BeforeCastingVerify />
      </Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_AskJavaIsThisObject />
      </Sequence>
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}>
        <Scene23_SafetyCheckHasName />
      </Sequence>
      <Sequence from={SCENE_TIMING.s24.from} durationInFrames={SCENE_TIMING.s24.duration} premountFor={30}>
        <Scene24_CoverInNextPart />
      </Sequence>
    </AbsoluteFill>
  );
};
