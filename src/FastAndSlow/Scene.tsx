/**
 * Fast & Slow Pointers — Scene Orchestrator
 *
 * Sequences all 12 scenes with correct timing from the CSV.
 * Audio: references "audio/new3.wav" — update path if needed.
 */

import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENES } from './helpers/timing';

import ScrollHook from './frames/ScrollHook';
import WeaponIntro from './frames/WeaponIntro';
import ProblemSetup from './frames/ProblemSetup';
import PanicMode from './frames/PanicMode';
import SmarterWay from './frames/SmarterWay';
import AlgorithmDemo from './frames/AlgorithmDemo';
import CycleDetection from './frames/CycleDetection';
import MiddleElement from './frames/MiddleElement';
import ComplexityDrop from './frames/ComplexityDrop';
import Applications from './frames/Applications';
import Confidence from './frames/Confidence';
import Outro from './frames/Outro';

const scenes = [
    { id: 'scrollHook',     Component: ScrollHook,     ...SCENES.scrollHook },
    { id: 'weaponIntro',    Component: WeaponIntro,    ...SCENES.weaponIntro },
    { id: 'problemSetup',   Component: ProblemSetup,   ...SCENES.problemSetup },
    { id: 'panicMode',      Component: PanicMode,      ...SCENES.panicMode },
    { id: 'smarterWay',     Component: SmarterWay,     ...SCENES.smarterWay },
    { id: 'algorithmDemo',  Component: AlgorithmDemo,  ...SCENES.algorithmDemo },
    { id: 'cycleDetection', Component: CycleDetection, ...SCENES.cycleDetection },
    { id: 'middleElement',  Component: MiddleElement,  ...SCENES.middleElement },
    { id: 'complexityDrop', Component: ComplexityDrop,  ...SCENES.complexityDrop },
    { id: 'applications',   Component: Applications,   ...SCENES.applications },
    { id: 'confidence',     Component: Confidence,     ...SCENES.confidence },
    { id: 'outro',          Component: Outro,          ...SCENES.outro },
] as const;

const FastAndSlowScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000000' }}>
            <Audio src={staticFile('audio/fast and slow.mp3')} />

            {scenes.map(({ id, Component, from, duration }) => (
                <Sequence key={id} name={id} from={from} durationInFrames={duration}>
                    <Component />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};

export default FastAndSlowScene;
