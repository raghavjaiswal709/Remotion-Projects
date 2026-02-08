import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
// 1-6
import KQueueChallengeFrame from "./frames/ChallengeFrame";
import FixedPartitioningFrame from "./frames/FixedPartitioningFrame";
import FixedPartitioningOverflowFrame from "./frames/FixedPartitioningOverflowFrame";
import InefficiencyFrame from "./frames/InefficiencyFrame";
import DynamicInterleavingFrame from "./frames/DynamicInterleavingFrame";
import LinkedRepresentationFrame from "./frames/LinkedRepresentationFrame";

// 7-12
import AuxiliaryArraysIntroFrame from "./frames/AuxiliaryArraysIntroFrame";
import FrontArrayFocusFrame from "./frames/FrontArrayFocusFrame";
import RearArrayFocusFrame from "./frames/RearArrayFocusFrame";
import NextArrayOccupiedFrame from "./frames/NextArrayOccupiedFrame";
import NextArrayFreeFrame from "./frames/NextArrayFreeFrame";
import FreePointerIntroFrame from "./frames/FreePointerIntroFrame";

// 13-16
import EnqueueNoSearchFrame from "./frames/EnqueueNoSearchFrame";
import EnqueueGrabFreeFrame from "./frames/EnqueueGrabFreeFrame";
import EnqueueUpdateFreeFrame from "./frames/EnqueueUpdateFreeFrame";
import EnqueueLinkRearFrame from "./frames/EnqueueLinkRearFrame";

// 17-21
import DequeueIntroFrame from "./frames/DequeueIntroFrame";
import DequeueUpdateFrontFrame from "./frames/DequeueUpdateFrontFrame";
import GarbageCollectionIntroFrame from "./frames/GarbageCollectionIntroFrame";
import RecycleIndexFrame from "./frames/RecycleIndexFrame";
import UpdateFreePointerFrame from "./frames/UpdateFreePointerFrame";

// 22-24
import ConstantTimeAnalysisFrame from "./frames/ConstantTimeAnalysisFrame";
import EfficiencyProofFrame from "./frames/EfficiencyProofFrame";
import FlexibilityDemoFrame from "./frames/FlexibilityDemoFrame";

export const Scene: React.FC = () => {
    return (
        <AbsoluteFill className="bg-zinc-900">
            <Audio src={staticFile("audio/new1.wav")} />

            {/* 1. Challenge: 0.000 - 7.182 (215f) */}
            <Sequence from={0} durationInFrames={215}>
                <KQueueChallengeFrame />
            </Sequence>

            {/* 2. Fixed Partitioning: 7.182 - 11.776 (138f) */}
            <Sequence from={215} durationInFrames={138}>
                <FixedPartitioningFrame />
            </Sequence>

            {/* 3. Overflow: 11.776 - 20.317 (256f) */}
            <Sequence from={353} durationInFrames={256}>
                <FixedPartitioningOverflowFrame />
            </Sequence>

            {/* 4. Inefficiency: 20.317 - 27.952 (229f) */}
            <Sequence from={609} durationInFrames={229}>
                <InefficiencyFrame />
            </Sequence>

            {/* 5. Dynamic Interleaving: 27.952 - 34.487 (196f) */}
            <Sequence from={838} durationInFrames={196}>
                <DynamicInterleavingFrame />
            </Sequence>

            {/* 6. Linked Representation: 34.487 - 40.828 (190f) */}
            <Sequence from={1034} durationInFrames={190}>
                <LinkedRepresentationFrame />
            </Sequence>

            {/* 7. Auxiliary Arrays: 40.828 - 44.904 (122f) */}
            <Sequence from={1224} durationInFrames={122}>
                <AuxiliaryArraysIntroFrame />
            </Sequence>

            {/* 8. Front Array: 44.904 - 48.268 (101f) */}
            <Sequence from={1346} durationInFrames={101}>
                <FrontArrayFocusFrame />
            </Sequence>

            {/* 9. Rear Array: 48.268 - 51.568 (99f) */}
            <Sequence from={1447} durationInFrames={99}>
                <RearArrayFocusFrame />
            </Sequence>

            {/* 10. Next (Dual Purpose): 51.568 - 53.962 (72f) */}
            <Sequence from={1546} durationInFrames={72}>
                <NextArrayOccupiedFrame />
            </Sequence>

            {/* 11. Next (Occupied): 53.962 - 59.462 (165f) */}
            <Sequence from={1618} durationInFrames={165}>
                <NextArrayOccupiedFrame />
            </Sequence>

            {/* 12. Next (Free): 59.462 - 64.056 (138f) */}
            <Sequence from={1783} durationInFrames={138}>
                <NextArrayFreeFrame />
            </Sequence>

            {/* 13. Free Pointer: 64.056 - 71.691 (229f) */}
            <Sequence from={1921} durationInFrames={229}>
                <FreePointerIntroFrame />
            </Sequence>

            {/* 14. Enqueue No Search: 71.691 - 75.120 (103f) */}
            <Sequence from={2150} durationInFrames={103}>
                <EnqueueNoSearchFrame />
            </Sequence>

            {/* 15. Enqueue Grab Free: 75.120 - 79.391 (128f) */}
            <Sequence from={2253} durationInFrames={128}>
                <EnqueueGrabFreeFrame />
            </Sequence>

            {/* 16. Enqueue Update Free: 79.391 - 87.026 (229f) */}
            <Sequence from={2381} durationInFrames={229}>
                <EnqueueUpdateFreeFrame />
            </Sequence>

            {/* 17. Enqueue Link Rear: 87.026 - 93.043 (180f) */}
            <Sequence from={2610} durationInFrames={180}>
                <EnqueueLinkRearFrame />
            </Sequence>

            {/* 18. Dequeue Intro: 93.043 - 97.443 (132f) */}
            <Sequence from={2790} durationInFrames={132}>
                <DequeueIntroFrame />
            </Sequence>

            {/* 19. Dequeue Update Front: 97.443 - 103.395 (179f) */}
            <Sequence from={2922} durationInFrames={179}>
                <DequeueUpdateFrontFrame />
            </Sequence>

            {/* 20. Garbage Collection: 103.395 - 105.725 (70f) */}
            <Sequence from={3101} durationInFrames={70}>
                <GarbageCollectionIntroFrame />
            </Sequence>

            {/* 21. Recycle Index: 105.725 - 113.813 (243f) */}
            <Sequence from={3171} durationInFrames={243}>
                <RecycleIndexFrame />
            </Sequence>

            {/* 22. Update Free Pointer: 113.813 - 117.889 (122f) */}
            <Sequence from={3414} durationInFrames={122}>
                <UpdateFreePointerFrame />
            </Sequence>

            {/* 23. Constant Time: 117.889 - 121.965 (122f) */}
            <Sequence from={3536} durationInFrames={122}>
                <ConstantTimeAnalysisFrame />
            </Sequence>

            {/* 24a. Efficiency: 121.965 - (Split) (180f) */}
            <Sequence from={3658} durationInFrames={180}>
                <EfficiencyProofFrame />
            </Sequence>

            {/* 24b. Flexibility: (Split) - 134.000 (181f) */}
            <Sequence from={3838} durationInFrames={181}>
                <FlexibilityDemoFrame />
            </Sequence>

        </AbsoluteFill>
    );
};
