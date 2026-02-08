import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";

export const PortraitScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        fps,
        frame,
        config: {
            damping: 200,
        },
        durationInFrames: 30,
    });

    const opacity = spring({
        fps,
        frame: frame - 20,
        config: {
            damping: 200,
        },
    })

    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#111",
                fontSize: 80,
                color: "white",
                fontFamily: "sans-serif",
            }}
        >
            <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
                <h1 style={{ margin: 0 }}>Portrait</h1>
                <h2 style={{ margin: 0, opacity }}>9:16</h2>
            </div>
        </AbsoluteFill>
    );
};
