/**
 * Two Pointers — Scene Orchestrator
 *
 * Sequences all 9 scenes with correct timing from the CSV.
 * Audio: references "audio/two pointers.mp3" — drop the file in public/audio/.
 */

import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENES } from './helpers/timing';

import Hook from './frames/Hook';
import ProblemSetup from './frames/ProblemSetup';
import BruteForce from './frames/BruteForce';
import PointerSetup from './frames/PointerSetup';
import AlgorithmWalk from './frames/AlgorithmWalk';
import Efficiency from './frames/Efficiency';
import ComplexityDrop from './frames/ComplexityDrop';
import PatternEverywhere from './frames/PatternEverywhere';
import Outro from './frames/Outro';

const scenes = [
    { id: 'hook',             Component: Hook,             ...SCENES.hook },
    { id: 'problemSetup',     Component: ProblemSetup,     ...SCENES.problemSetup },
    { id: 'bruteForce',       Component: BruteForce,       ...SCENES.bruteForce },
    { id: 'pointerSetup',     Component: PointerSetup,     ...SCENES.pointerSetup },
    { id: 'algorithmWalk',    Component: AlgorithmWalk,    ...SCENES.algorithmWalk },
    { id: 'efficiency',       Component: Efficiency,       ...SCENES.efficiency },
    { id: 'complexityDrop',   Component: ComplexityDrop,   ...SCENES.complexityDrop },
    { id: 'patternEverywhere',Component: PatternEverywhere,...SCENES.patternEverywhere },
    { id: 'outro',            Component: Outro,            ...SCENES.outro },
] as const;

const TwoPointersScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000000' }}>
            <Audio src={staticFile('audio/Timeline 1.mov')} />

            {scenes.map(({ id, Component, from, duration }) => (
                <Sequence key={id} name={id} from={from} durationInFrames={duration}>
                    <Component />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};

export default TwoPointersScene;
