/**
 * Day 40 — "Static Block"
 * Series: Java / National Railway
 * Total: 2729 frames @ 30fps = ~90.97s (= audio duration exactly)
 * Audio: public/audio/java40.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene01  frames    0–190   Day intro — static block overview
 * Scene02  frames  191–367   Static method recap
 * Scene03  frames  368–564   Static block intro
 * Scene04  frames  565–733   Before trains created
 * Scene05  frames  734–907   Before stations exist
 * Scene06  frames  908–1079  All data loaded
 * Scene07  frames 1080–1362  Cannot wait for object
 * Scene08  frames 1363–1589  What static block does
 * Scene09  frames 1590–1743  Static block syntax
 * Scene10  frames 1744–1831  Runs once automatic
 * Scene11  frames 1832–1917  Not when object created
 * Scene12  frames 1918–2100  Class loading triggers
 * Scene13  frames 2101–2303  One time setup
 * Scene14  frames 2304–2551  Static vs instance
 * Scene15  frames 2552–2728  Difference meaning
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_StaticMethodRecap } from './frames/Scene02_StaticMethodRecap';
import { Scene03_StaticBlockIntro } from './frames/Scene03_StaticBlockIntro';
import { Scene04_BeforeTrainsCreated } from './frames/Scene04_BeforeTrainsCreated';
import { Scene05_BeforeStationsExist } from './frames/Scene05_BeforeStationsExist';
import { Scene06_AllDataLoaded } from './frames/Scene06_AllDataLoaded';
import { Scene07_CannotWaitForObject } from './frames/Scene07_CannotWaitForObject';
import { Scene08_WhatStaticBlockDoes } from './frames/Scene08_WhatStaticBlockDoes';
import { Scene09_StaticBlockSyntax } from './frames/Scene09_StaticBlockSyntax';
import { Scene10_RunsOnceAutomatic } from './frames/Scene10_RunsOnceAutomatic';
import { Scene11_NotWhenObjectCreated } from './frames/Scene11_NotWhenObjectCreated';
import { Scene12_ClassLoadingTriggers } from './frames/Scene12_ClassLoadingTriggers';
import { Scene13_OneTimeSetup } from './frames/Scene13_OneTimeSetup';
import { Scene14_StaticVsInstance } from './frames/Scene14_StaticVsInstance';
import { Scene15_DifferenceMeaning } from './frames/Scene15_DifferenceMeaning';

export const JavaDay40Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/java40.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_StaticMethodRecap />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_StaticBlockIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_BeforeTrainsCreated />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_BeforeStationsExist />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_AllDataLoaded />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_CannotWaitForObject />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_WhatStaticBlockDoes />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_StaticBlockSyntax />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_RunsOnceAutomatic />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_NotWhenObjectCreated />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_ClassLoadingTriggers />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_OneTimeSetup />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_StaticVsInstance />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_DifferenceMeaning />
      </Sequence>
    </AbsoluteFill>
  );
};
