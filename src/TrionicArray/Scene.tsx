import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";

// Import all frames
import Frame1 from "./frames/Frame1";
import Frame2 from "./frames/Frame2";
import Frame3 from "./frames/Frame3";
import Frame4 from "./frames/Frame4";
import Frame5 from "./frames/Frame5";
import Frame6 from "./frames/Frame6";
import Frame7 from "./frames/Frame7";
import Frame8 from "./frames/Frame8";

/**
 * Trionic Array Visualization Scene
 * 
 * Based on transcript timestamps from:
 * "Check if Array is Trionic" - LeetCode BOTD
 * 
 * Transcript breakdown:
 * 1. 0.00 - 3.72s: Intro - "Did you solve today's LeetCode BOTD? If not, let's solve it together"
 * 2. 4.16 - 6.10s: "We are checking if an array is trionic"
 * 3. 6.54 - 11.18s: Concept - "Imagine array as sequence of movements with three strict rules"
 * 4. 11.60 - 18.76s: "It must go up, then down, then up again. Peak and valley transition points"
 * 5. 19.78 - 35.94s: Rule 1 - Initial climb to the peak
 * 6. 36.32 - 53.90s: Rule 2 - Final climb (from end backwards to valley)
 * 7. 54.22 - 74.50s: Rule 3 - Middle bridge (peak to valley must decrease)
 * 8. 74.96 - 81.16s: Validation - "When array successfully rises to peak, falls, rises again - trionic"
 * 9. 81.60 - 89.16s: Summary - "Three movements: start climb, middle fall, end climb - single pass"
 * 
 * Total duration: ~89 seconds = 2670 frames at 30fps
 */

export const TrionicArrayScene: React.FC = () => {
    // Frame rate: 30fps
    // Timestamps converted to frames: seconds * 30

    return (
        <AbsoluteFill className="bg-zinc-950">
            {/* Audio Track */}
            <Audio src={staticFile("audio/new2.wav")} />

            {/* 1. Title Frame: 0.00 - 6.10s (0 - 183 frames) */}
            {/* "Did you solve today's LeetCode BOTD? If not, let's solve it together. 
                 We are checking if an array is trionic." */}
            <Sequence from={0} durationInFrames={183}>
                <Frame1 />
            </Sequence>

            {/* 2. Concept Explanation: 6.54 - 13.96s (196 - 419 frames, duration: 223) */}
            {/* "Imagine the array as a sequence of movements that must follow three strict rules.
                 It must go up, then down, then up again." */}
            <Sequence from={183} durationInFrames={236}>
                <Frame2 />
            </Sequence>

            {/* 3. Transition Points (Peak & Valley): 14.46 - 18.76s (434 - 563 frames, duration: 129) */}
            {/* "We solve this by identifying two transition points, the peak and the valley." */}
            <Sequence from={419} durationInFrames={144}>
                <Frame3 />
            </Sequence>

            {/* 4. Initial Climb (Rule 1): 19.78 - 35.94s (593 - 1078 frames, duration: 485) */}
            {/* "The first rule is the initial climb. We start at the beginning and move forward 
                 as long as the next number is strictly larger. This stops at the first peak.
                 For the array to be valid, this peak cannot be at the very first position.
                 The array must have actually increased at least once." */}
            <Sequence from={563} durationInFrames={515}>
                <Frame4 />
            </Sequence>

            {/* 5. Final Climb (Rule 2): 36.32 - 53.90s (1090 - 1617 frames, duration: 527) */}
            {/* "The second rule is the final climb. Instead of moving forward, we look at the array
                 from the end and move backward. We continue as long as the number to the left is 
                 strictly smaller. This point where the increase from the right stops is our valley.
                 Just like the peak, the valley cannot be at the very last position.
                 There must be a clear increase at the tail end of the array." */}
            <Sequence from={1078} durationInFrames={539}>
                <Frame5 />
            </Sequence>

            {/* 6. Middle Bridge (Rule 3): 54.22 - 74.50s (1627 - 2235 frames, duration: 608) */}
            {/* "The third and final rule is the middle bridge. For the array to be trionic, 
                 the peak must occur before the valley. More importantly, every single number 
                 between the peak and the valley must be strictly decreasing.
                 This means every value in this middle section must be smaller than the one 
                 that came before it. If you find any part that stays the same or moves upward 
                 in this middle gap, the array fails." */}
            <Sequence from={1617} durationInFrames={618}>
                <Frame6 />
            </Sequence>

            {/* 7. Validation: 74.96 - 81.16s (2249 - 2435 frames, duration: 186) */}
            {/* "When an array successfully rises to a peak, falls to a valley and then rises 
                 again to the finish, it is trionic." */}
            <Sequence from={2235} durationInFrames={200}>
                <Frame7 />
            </Sequence>

            {/* 8. Summary: 81.60 - 89.16s (2448 - 2675 frames, duration: 227) */}
            {/* "By checking these three movements, start climb, middle fall and end climb,
                 we can determine the answer in a single pass. Problem solved." */}
            <Sequence from={2435} durationInFrames={240}>
                <Frame8 />
            </Sequence>

        </AbsoluteFill>
    );
};

export default TrionicArrayScene;
