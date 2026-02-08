/**
 * Intervals Pattern — Scene Orchestrator
 *
 * 11 scenes, 60 fps, 1080×1920, ~4048 frames (~67.46s)
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENES } from './helpers/timing';

import ScrollHook from './frames/ScrollHook';
import WeaponIntro from './frames/WeaponIntro';
import ProblemSetup from './frames/ProblemSetup';
import PanicMode from './frames/PanicMode';
import CleanWay from './frames/CleanWay';
import AlgorithmWalk from './frames/AlgorithmWalk';
import PatternExplained from './frames/PatternExplained';
import Complexity from './frames/Complexity';
import Applications from './frames/Applications';
import WindowInsight from './frames/WindowInsight';
import Outro from './frames/Outro';

const scenes = [
    { id: 'scrollHook',        Component: ScrollHook,        ...SCENES.scrollHook },
    { id: 'weaponIntro',       Component: WeaponIntro,       ...SCENES.weaponIntro },
    { id: 'problemSetup',      Component: ProblemSetup,      ...SCENES.problemSetup },
    { id: 'panicMode',         Component: PanicMode,         ...SCENES.panicMode },
    { id: 'cleanWay',          Component: CleanWay,          ...SCENES.cleanWay },
    { id: 'algorithmWalk',     Component: AlgorithmWalk,     ...SCENES.algorithmWalk },
    { id: 'patternExplained',  Component: PatternExplained,  ...SCENES.patternExplained },
    { id: 'complexity',        Component: Complexity,        ...SCENES.complexity },
    { id: 'applications',      Component: Applications,      ...SCENES.applications },
    { id: 'windowInsight',     Component: WindowInsight,     ...SCENES.windowInsight },
    { id: 'outro',             Component: Outro,             ...SCENES.outro },
] as const;

const IntervalsScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000000' }}>
            <Audio src={staticFile('audio/intervalspatterns.mp3')} />

            {scenes.map(({ id, Component, from, duration }) => (
                <Sequence key={id} name={id} from={from} durationInFrames={duration}>
                    <Component />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};

export default IntervalsScene;
