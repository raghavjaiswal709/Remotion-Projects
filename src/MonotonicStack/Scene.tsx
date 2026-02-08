/**
 * Monotonic Stack — Scene Orchestrator
 *
 * 9 scenes, 60 fps, 1080×1920, ~4338 frames (~72.30s)
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENES } from './helpers/timing';

import CrashHook from './frames/CrashHook';
import WeaponIntro from './frames/WeaponIntro';
import PanicMode from './frames/PanicMode';
import SmarterWay from './frames/SmarterWay';
import ScanAlgorithm from './frames/ScanAlgorithm';
import WhyItWorks from './frames/WhyItWorks';
import Complexity from './frames/Complexity';
import Applications from './frames/Applications';
import Outro from './frames/Outro';

const scenes = [
    { id: 'crashHook',     Component: CrashHook,     ...SCENES.crashHook },
    { id: 'weaponIntro',   Component: WeaponIntro,   ...SCENES.weaponIntro },
    { id: 'panicMode',     Component: PanicMode,     ...SCENES.panicMode },
    { id: 'smarterWay',    Component: SmarterWay,    ...SCENES.smarterWay },
    { id: 'scanAlgorithm', Component: ScanAlgorithm, ...SCENES.scanAlgorithm },
    { id: 'whyItWorks',    Component: WhyItWorks,    ...SCENES.whyItWorks },
    { id: 'complexity',    Component: Complexity,     ...SCENES.complexity },
    { id: 'applications',  Component: Applications,   ...SCENES.applications },
    { id: 'outro',         Component: Outro,          ...SCENES.outro },
] as const;

const MonotonicStackScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000000' }}>
            <Audio src={staticFile('audio/monotonic stack.mp3')} />

            {scenes.map(({ id, Component, from, duration }) => (
                <Sequence key={id} name={id} from={from} durationInFrames={duration}>
                    <Component />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};

export default MonotonicStackScene;
