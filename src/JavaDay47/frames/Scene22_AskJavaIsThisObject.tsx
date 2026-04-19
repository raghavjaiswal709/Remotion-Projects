/**
 * Scene 22 — Ask Java Is This Object
 * "You ask Java, is this object actually what I think it is?"
 * CSV: 78.400s → 82.980s
 * Duration: ~137 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–70): Developer→JVM dialogue
 *   Phase 3 (frames 60–end): Micro-pulse
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene22_AskJavaIsThisObject: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const devEnt = useSpringEntrance(frame, 18);
  const bubbleEnt = useSpringEntrance(frame, 28);
  const jvmEnt = useSpringEntrance(frame, 40);
  const replyEnt = useSpringEntrance(frame, 52);
  const codeEnt = useSpringEntrance(frame, 62);
  const noteEnt = useSpringEntrance(frame, 72);

  // Speech bubble arrow path
  const bubbleArrowLen = 120;
  const bubbleArrowDash = usePathDraw(frame, 32, bubbleArrowLen, 18);

  // Reply arrow
  const replyArrowLen = 120;
  const replyArrowDash = usePathDraw(frame, 55, replyArrowLen, 18);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[21];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="TYPE · QUERY" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.white}>
            You ask Java:
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            "Is this object actually
          </text>
          <text x={60} y={450} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            what I think it is?"
          </text>
        </g>

        {/* Developer side */}
        <g opacity={devEnt.opacity} transform={`translate(0, ${devEnt.translateY})`}>
          <BentoCard x={60} y={520} w={420} h={320} accent />
          <rect x={60} y={520} width={8} height={320} rx={4} fill={COLORS.accent} />

          {/* Developer icon — person silhouette */}
          <circle cx={270} cy={600} r={30}
            fill="none" stroke={COLORS.accent} strokeWidth={3} />
          <path d="M 230,660 Q 230,640 270,640 Q 310,640 310,660 L 310,680 L 230,680 Z"
            fill="none" stroke={COLORS.accent} strokeWidth={3} />

          <text x={270} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            DEVELOPER
          </text>
          <text x={270} y={765} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Writes the cast
          </text>
          <text x={270} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            in source code
          </text>
        </g>

        {/* Speech bubble: developer question */}
        <g opacity={bubbleEnt.opacity} transform={`translate(0, ${bubbleEnt.translateY})`}>
          <rect x={110} y={870} width={360} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Tail */}
          <polygon points="270,870 290,840 310,870" fill={COLORS.bg_secondary} />
          <line x1={270} y1={870} x2={290} y2={840} stroke={COLORS.accent} strokeWidth={2} />
          <line x1={290} y1={840} x2={310} y2={870} stroke={COLORS.accent} strokeWidth={2} />

          <text x={290} y={928} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            "Is t an ExpressTrain?"
          </text>
        </g>

        {/* Arrow line to JVM */}
        <path d="M 490,680 L 580,680"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeLinecap="round" markerEnd="url(#arrow)"
          strokeDasharray={bubbleArrowLen} strokeDashoffset={bubbleArrowDash}
          opacity={bubbleEnt.opacity} />

        {/* JVM side */}
        <g opacity={jvmEnt.opacity} transform={`translate(0, ${jvmEnt.translateY})`}>
          <BentoCard x={600} y={520} w={420} h={320} />

          {/* JVM gear icon */}
          <g transform="translate(810, 600)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <rect key={i} x={-4} y={-28} width={8} height={12} rx={2}
                fill={COLORS.accent}
                transform={`rotate(${angle})`} />
            ))}
            <circle cx={0} cy={0} r={14} fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={2.5} />
          </g>

          <text x={810} y={660} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            JVM
          </text>
          <text x={810} y={705} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Checks the actual
          </text>
          <text x={810} y={740} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            object in memory
          </text>
        </g>

        {/* Reply arrow */}
        <path d="M 580,760 L 490,760"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeLinecap="round" markerEnd="url(#arrow)"
          strokeDasharray={replyArrowLen} strokeDashoffset={replyArrowDash}
          opacity={replyEnt.opacity * 0.6} />

        {/* JVM reply bubble */}
        <g opacity={replyEnt.opacity} transform={`translate(0, ${replyEnt.translateY})`}>
          <rect x={610} y={870} width={360} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          <polygon points="770,870 790,840 810,870" fill={COLORS.bg_secondary} />

          <text x={790} y={928} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.white}>
            "Yes" or "No"
          </text>
        </g>

        {/* Code example */}
        <g opacity={codeEnt.opacity} transform={`translate(0, ${codeEnt.translateY})`}>
          <BentoCard x={60} y={1020} w={960} h={280} accent />
          <rect x={60} y={1020} width={8} height={280} rx={4} fill={COLORS.accent} />

          <text x={100} y={1080}
            fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            // The developer's question in code:
          </text>
          <text x={100} y={1130}
            fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.accent}>
            {'if (t instanceof ExpressTrain) {'}
          </text>
          <text x={140} y={1180}
            fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.white}>
            {'ExpressTrain et = (ExpressTrain) t;'}
          </text>
          <text x={100} y={1230}
            fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.accent}>
            {'}'}
          </text>

          <text x={100} y={1275}
            fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.text_muted}>
            // Safe — only casts when JVM confirms type
          </text>
        </g>

        {/* Note */}
        <g opacity={noteEnt.opacity} transform={`translate(0, ${noteEnt.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={160} />
          <text x={540} y={1400} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Developer asks the question —
          </text>
          <text x={540} y={1450} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            JVM provides the answer at runtime
          </text>
        </g>

        {/* Micro-animations */}
        <circle cx={540} cy={1570 + breathe} r={6} fill={COLORS.accent}
          fillOpacity={0.08 * shimmer} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s22.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
