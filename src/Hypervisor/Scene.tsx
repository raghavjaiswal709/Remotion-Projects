import { AbsoluteFill, Series } from "remotion";
import React from "react";
import { TitleCard } from "./frames/TitleCard";
import { RealWorldAnalogy } from "./frames/RealWorldAnalogy";
import { TheProblem } from "./frames/TheProblem";
import { PhysicalServersWastage } from "./frames/PhysicalServersWastage";
import { OneAppPerServer } from "./frames/OneAppPerServer";
import { SolutionIntro } from "./frames/SolutionIntro";
import { HypervisorDesc } from "./frames/HypervisorDesc";
import { MagicLayer } from "./frames/MagicLayer";
import { HardwareLayer } from "./frames/HardwareLayer";
import { HypervisorLayer } from "./frames/HypervisorLayer";
import { VMLayer } from "./frames/VMLayer";
import { ResourceSlicing } from "./frames/ResourceSlicing";
import { CPUAllocation } from "./frames/CPUAllocation";
import { MemoryAllocation } from "./frames/MemoryAllocation";
import { StorageAllocation } from "./frames/StorageAllocation";
import { Type1Hypervisor } from "./frames/Type1Hypervisor";
import { Type2Hypervisor } from "./frames/Type2Hypervisor";
import { BenefitUtilization } from "./frames/BenefitUtilization";
import { BenefitIsolation } from "./frames/BenefitIsolation";
import { BenefitFlexibility } from "./frames/BenefitFlexibility";
import { RealWorldExamples } from "./frames/RealWorldExamples";
import { HowItWorks } from "./frames/HowItWorks";
import { ResourceManagement } from "./frames/ResourceManagement";
import { LiveMigration } from "./frames/LiveMigration";
import { PowersTheCloud } from "./frames/PowersTheCloud";
import { Summary } from "./frames/Summary";

export const HypervisorScene: React.FC = () => {
    return (
        <AbsoluteFill className="bg-zinc-950 text-white font-sans selection:bg-cyan-500/30">
            <Series>
                <Series.Sequence durationInFrames={105}>
                    <TitleCard />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <RealWorldAnalogy />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <TheProblem />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <PhysicalServersWastage />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <OneAppPerServer />
                </Series.Sequence>
                <Series.Sequence durationInFrames={75}>
                    <SolutionIntro />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <HypervisorDesc />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <MagicLayer />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <HardwareLayer />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <HypervisorLayer />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <VMLayer />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <ResourceSlicing />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <CPUAllocation />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <MemoryAllocation />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <StorageAllocation />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <Type1Hypervisor />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <Type2Hypervisor />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <BenefitUtilization />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <BenefitIsolation />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <BenefitFlexibility />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <RealWorldExamples />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <HowItWorks />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <ResourceManagement />
                </Series.Sequence>
                <Series.Sequence durationInFrames={105}>
                    <LiveMigration />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <PowersTheCloud />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <Summary />
                </Series.Sequence>
            </Series>
        </AbsoluteFill>
    );
};
