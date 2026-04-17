/**
 * Day 42 — "Object Class & Compile-Time Polymorphism"
 * Series: Java / National Railway
 * Total: 3254 frames @ 30fps = ~108.47s (= audio duration exactly)
 * Audio: public/audio/java42.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0
 *
 * 24 content scenes
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_InstanceRecap } from './frames/Scene02_InstanceRecap';
import { Scene03_StaticRecap } from './frames/Scene03_StaticRecap';
import { Scene04_MixingBreaks } from './frames/Scene04_MixingBreaks';
import { Scene05_ObjectClassIntro } from './frames/Scene05_ObjectClassIntro';
import { Scene06_ParentClass } from './frames/Scene06_ParentClass';
import { Scene07_HiddenParent } from './frames/Scene07_HiddenParent';
import { Scene08_JavaLangObject } from './frames/Scene08_JavaLangObject';
import { Scene09_EntityList } from './frames/Scene09_EntityList';
import { Scene10_SilentExtends } from './frames/Scene10_SilentExtends';
import { Scene11_AutoInsertion } from './frames/Scene11_AutoInsertion';
import { Scene12_ThreeMethods } from './frames/Scene12_ThreeMethods';
import { Scene13_ToString } from './frames/Scene13_ToString';
import { Scene14_PrintTicket } from './frames/Scene14_PrintTicket';
import { Scene15_Equals } from './frames/Scene15_Equals';
import { Scene16_HashCode } from './frames/Scene16_HashCode';
import { Scene17_FreeMethods } from './frames/Scene17_FreeMethods';
import { Scene18_DefaultUseless } from './frames/Scene18_DefaultUseless';
import { Scene19_DefaultToString } from './frames/Scene19_DefaultToString';
import { Scene20_OverrideTicket } from './frames/Scene20_OverrideTicket';
import { Scene21_SameNameDiffBehavior } from './frames/Scene21_SameNameDiffBehavior';
import { Scene22_DependsOnInput } from './frames/Scene22_DependsOnInput';
import { Scene23_CompileTimePoly } from './frames/Scene23_CompileTimePoly';
import { Scene24_WhereWeGoNext } from './frames/Scene24_WhereWeGoNext';

export const JavaDay42Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/java42.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}><Scene01_DayIntro /></Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}><Scene02_InstanceRecap /></Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}><Scene03_StaticRecap /></Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}><Scene04_MixingBreaks /></Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}><Scene05_ObjectClassIntro /></Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}><Scene06_ParentClass /></Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}><Scene07_HiddenParent /></Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}><Scene08_JavaLangObject /></Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}><Scene09_EntityList /></Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}><Scene10_SilentExtends /></Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}><Scene11_AutoInsertion /></Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}><Scene12_ThreeMethods /></Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}><Scene13_ToString /></Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}><Scene14_PrintTicket /></Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}><Scene15_Equals /></Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}><Scene16_HashCode /></Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}><Scene17_FreeMethods /></Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}><Scene18_DefaultUseless /></Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}><Scene19_DefaultToString /></Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}><Scene20_OverrideTicket /></Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}><Scene21_SameNameDiffBehavior /></Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}><Scene22_DependsOnInput /></Sequence>
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}><Scene23_CompileTimePoly /></Sequence>
      <Sequence from={SCENE_TIMING.s24.from} durationInFrames={SCENE_TIMING.s24.duration} premountFor={30}><Scene24_WhereWeGoNext /></Sequence>
    </AbsoluteFill>
  );
};
