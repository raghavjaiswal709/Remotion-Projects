/**
 * Day 31 — "What Is Autonomy?"
 * Series: Agentic AI
 * Total: 2659 frames @ 30fps = ~88.63s (= audio duration exactly)
 * Audio: public/audio/AI day 31.wav
 *
 * NO structural scenes — video length = script/audio length only
 * Audio plays from frame 0 — no delay, no silent intro
 *
 * SCENE SEQUENCE:
 * Scene01  frames    0–160    Day intro
 * Scene02  frames  161–244    Recap task
 * Scene03  frames  245–324    Recap goal components
 * Scene04  frames  325–397    Recap criterion
 * Scene05  frames  398–483    Today autonomy
 * Scene06  frames  484–601    Not on or off
 * Scene07  frames  602–741    Full autonomy
 * Scene08  frames  742–945    Zero autonomy
 * Scene09  frames  946–1040   Neither extreme
 * Scene10  frames 1041–1178   Delete DB dangerous
 * Scene11  frames 1179–1320   Read 50 docs pointless
 * Scene12  frames 1321–1386   Slower than yourself
 * Scene13  frames 1387–1498   Calibrate to one thing
 * Scene14  frames 1499–1579   Reversibility
 * Scene15  frames 1580–1717   Read file autonomous
 * Scene16  frames 1718–1861   Send email show draft
 * Scene17  frames 1862–1989   Delete DB full stop
 * Scene18  frames 1990–2089   Can be undone proceeds
 * Scene19  frames 2090–2187   Cannot be undone waits
 * Scene20  frames 2188–2358   Design principle trustworthy
 * Scene21  frames 2359–2483   Every action every step
 * Scene22  frames 2484–2581   Start to finish record
 * Scene23  frames 2582–2658   Record has name next
 */
import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_DayIntro } from './frames/Scene01_DayIntro';
import { Scene02_RecapTask } from './frames/Scene02_RecapTask';
import { Scene03_RecapGoalComponents } from './frames/Scene03_RecapGoalComponents';
import { Scene04_RecapCriterion } from './frames/Scene04_RecapCriterion';
import { Scene05_TodayAutonomy } from './frames/Scene05_TodayAutonomy';
import { Scene06_NotOnOrOff } from './frames/Scene06_NotOnOrOff';
import { Scene07_FullAutonomy } from './frames/Scene07_FullAutonomy';
import { Scene08_ZeroAutonomy } from './frames/Scene08_ZeroAutonomy';
import { Scene09_NeitherExtreme } from './frames/Scene09_NeitherExtreme';
import { Scene10_DeleteDBDangerous } from './frames/Scene10_DeleteDBDangerous';
import { Scene11_Read50DocsPointless } from './frames/Scene11_Read50DocsPointless';
import { Scene12_SlowerThanYourself } from './frames/Scene12_SlowerThanYourself';
import { Scene13_CalibrateToOneThing } from './frames/Scene13_CalibrateToOneThing';
import { Scene14_Reversibility } from './frames/Scene14_Reversibility';
import { Scene15_ReadFileAutonomous } from './frames/Scene15_ReadFileAutonomous';
import { Scene16_SendEmailShowDraft } from './frames/Scene16_SendEmailShowDraft';
import { Scene17_DeleteDBFullStop } from './frames/Scene17_DeleteDBFullStop';
import { Scene18_CanBeUndoneProceeds } from './frames/Scene18_CanBeUndoneProceeds';
import { Scene19_CannotBeUndoneWaits } from './frames/Scene19_CannotBeUndoneWaits';
import { Scene20_DesignPrincipleTrustworthy } from './frames/Scene20_DesignPrincipleTrustworthy';
import { Scene21_EveryActionEveryStep } from './frames/Scene21_EveryActionEveryStep';
import { Scene22_StartToFinishRecord } from './frames/Scene22_StartToFinishRecord';
import { Scene23_RecordHasNameNext } from './frames/Scene23_RecordHasNameNext';

export const AiDay31Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <Audio src={staticFile('audio/AI day 31.wav')} startFrom={0} />

      <Sequence from={SCENE_TIMING.s01.from} durationInFrames={SCENE_TIMING.s01.duration} premountFor={30}>
        <Scene01_DayIntro />
      </Sequence>
      <Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
        <Scene02_RecapTask />
      </Sequence>
      <Sequence from={SCENE_TIMING.s03.from} durationInFrames={SCENE_TIMING.s03.duration} premountFor={30}>
        <Scene03_RecapGoalComponents />
      </Sequence>
      <Sequence from={SCENE_TIMING.s04.from} durationInFrames={SCENE_TIMING.s04.duration} premountFor={30}>
        <Scene04_RecapCriterion />
      </Sequence>
      <Sequence from={SCENE_TIMING.s05.from} durationInFrames={SCENE_TIMING.s05.duration} premountFor={30}>
        <Scene05_TodayAutonomy />
      </Sequence>
      <Sequence from={SCENE_TIMING.s06.from} durationInFrames={SCENE_TIMING.s06.duration} premountFor={30}>
        <Scene06_NotOnOrOff />
      </Sequence>
      <Sequence from={SCENE_TIMING.s07.from} durationInFrames={SCENE_TIMING.s07.duration} premountFor={30}>
        <Scene07_FullAutonomy />
      </Sequence>
      <Sequence from={SCENE_TIMING.s08.from} durationInFrames={SCENE_TIMING.s08.duration} premountFor={30}>
        <Scene08_ZeroAutonomy />
      </Sequence>
      <Sequence from={SCENE_TIMING.s09.from} durationInFrames={SCENE_TIMING.s09.duration} premountFor={30}>
        <Scene09_NeitherExtreme />
      </Sequence>
      <Sequence from={SCENE_TIMING.s10.from} durationInFrames={SCENE_TIMING.s10.duration} premountFor={30}>
        <Scene10_DeleteDBDangerous />
      </Sequence>
      <Sequence from={SCENE_TIMING.s11.from} durationInFrames={SCENE_TIMING.s11.duration} premountFor={30}>
        <Scene11_Read50DocsPointless />
      </Sequence>
      <Sequence from={SCENE_TIMING.s12.from} durationInFrames={SCENE_TIMING.s12.duration} premountFor={30}>
        <Scene12_SlowerThanYourself />
      </Sequence>
      <Sequence from={SCENE_TIMING.s13.from} durationInFrames={SCENE_TIMING.s13.duration} premountFor={30}>
        <Scene13_CalibrateToOneThing />
      </Sequence>
      <Sequence from={SCENE_TIMING.s14.from} durationInFrames={SCENE_TIMING.s14.duration} premountFor={30}>
        <Scene14_Reversibility />
      </Sequence>
      <Sequence from={SCENE_TIMING.s15.from} durationInFrames={SCENE_TIMING.s15.duration} premountFor={30}>
        <Scene15_ReadFileAutonomous />
      </Sequence>
      <Sequence from={SCENE_TIMING.s16.from} durationInFrames={SCENE_TIMING.s16.duration} premountFor={30}>
        <Scene16_SendEmailShowDraft />
      </Sequence>
      <Sequence from={SCENE_TIMING.s17.from} durationInFrames={SCENE_TIMING.s17.duration} premountFor={30}>
        <Scene17_DeleteDBFullStop />
      </Sequence>
      <Sequence from={SCENE_TIMING.s18.from} durationInFrames={SCENE_TIMING.s18.duration} premountFor={30}>
        <Scene18_CanBeUndoneProceeds />
      </Sequence>
      <Sequence from={SCENE_TIMING.s19.from} durationInFrames={SCENE_TIMING.s19.duration} premountFor={30}>
        <Scene19_CannotBeUndoneWaits />
      </Sequence>
      <Sequence from={SCENE_TIMING.s20.from} durationInFrames={SCENE_TIMING.s20.duration} premountFor={30}>
        <Scene20_DesignPrincipleTrustworthy />
      </Sequence>
      <Sequence from={SCENE_TIMING.s21.from} durationInFrames={SCENE_TIMING.s21.duration} premountFor={30}>
        <Scene21_EveryActionEveryStep />
      </Sequence>
      <Sequence from={SCENE_TIMING.s22.from} durationInFrames={SCENE_TIMING.s22.duration} premountFor={30}>
        <Scene22_StartToFinishRecord />
      </Sequence>
      <Sequence from={SCENE_TIMING.s23.from} durationInFrames={SCENE_TIMING.s23.duration} premountFor={30}>
        <Scene23_RecordHasNameNext />
      </Sequence>
    </AbsoluteFill>
  );
};
