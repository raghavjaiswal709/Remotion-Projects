/**
 * SlidingWindow — Scene Orchestrator (v2)
 *
 * Wires all 7 scenes via Remotion <Sequence> + Audio track.
 */
import React from 'react';
import { Sequence, Audio, staticFile } from 'remotion';
import { SCENES } from './helpers/timing';

import RecalculatingArrays from './frames/RecalculatingArrays';
import BruteForceDemo from './frames/BruteForceDemo';
import WindowIntro from './frames/WindowIntro';
import SlideAndUpdate from './frames/SlideAndUpdate';
import ComplexityDrop from './frames/ComplexityDrop';
import VariableWindow from './frames/VariableWindow';
import Outro from './frames/Outro';

const SlidingWindowScene: React.FC = () => {
    return (
        <div className="w-full h-full bg-white relative">
            {/* Audio track */}
            <Audio src={staticFile('audio/sliding window 1.mp3')} />

            {/* Scene 1: RecalculatingArrays (0.00 – 7.94s) */}
            <Sequence
                from={SCENES.recalculating.from}
                durationInFrames={SCENES.recalculating.duration}
                name="S1-RecalculatingArrays"
            >
                <RecalculatingArrays />
            </Sequence>

            {/* Scene 2: BruteForceDemo (8.46 – 17.32s) */}
            <Sequence
                from={SCENES.bruteForce.from}
                durationInFrames={SCENES.bruteForce.duration}
                name="S2-BruteForceDemo"
            >
                <BruteForceDemo />
            </Sequence>

            {/* Scene 3: WindowIntro (17.86 – 26.42s) */}
            <Sequence
                from={SCENES.windowIntro.from}
                durationInFrames={SCENES.windowIntro.duration}
                name="S3-WindowIntro"
            >
                <WindowIntro />
            </Sequence>

            {/* Scene 4: SlideAndUpdate (26.42 – 40.02s) */}
            <Sequence
                from={SCENES.slideAndUpdate.from}
                durationInFrames={SCENES.slideAndUpdate.duration}
                name="S4-SlideAndUpdate"
            >
                <SlideAndUpdate />
            </Sequence>

            {/* Scene 5: ComplexityDrop (40.50 – 46.50s) */}
            <Sequence
                from={SCENES.complexityDrop.from}
                durationInFrames={SCENES.complexityDrop.duration}
                name="S5-ComplexityDrop"
            >
                <ComplexityDrop />
            </Sequence>

            {/* Scene 6: VariableWindow (46.90 – 54.94s) */}
            <Sequence
                from={SCENES.variableWindow.from}
                durationInFrames={SCENES.variableWindow.duration}
                name="S6-VariableWindow"
            >
                <VariableWindow />
            </Sequence>

            {/* Scene 7: Outro (55.30 – 58.48s) */}
            <Sequence
                from={SCENES.outro.from}
                durationInFrames={SCENES.outro.duration}
                name="S7-Outro"
            >
                <Outro />
            </Sequence>
        </div>
    );
};

export default SlidingWindowScene;
export { SlidingWindowScene };
