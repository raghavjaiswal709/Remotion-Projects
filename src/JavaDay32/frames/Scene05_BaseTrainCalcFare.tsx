/**
 * Scene05 — Base Train CalculateFare
 * "The base train class has a method called Calculate Fair."
 * CSV: 13.82s → 17.52s
 * Duration: 129 frames (4.3s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Scene reveal — label, headline spring
 *   Phase 2 (frames 20–80):  Train class UML box builds, method highlights, code block draws
 *   Phase 3 (frames 70–end): Micro — pulse on method, breathe on class box
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene05_BaseTrainCalcFare: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const classBox = useSpringEntrance(frame, 18);
  const classHeader = useSpringEntrance(frame, 22);
  const dividerLine = usePathDraw(frame, 26, 560, 18);
  const methodRow = useSpringEntrance(frame, 30);
  const methodHighlight = useSpringEntrance(frame, 36);
  const codeBlock = useSpringEntrance(frame, 44);
  const codeLines = [
    { text: 'class Train {', isKeyword: true, delay: 48 },
    { text: '  ', isKeyword: false, delay: 50 },
    { text: '  int calculateFare() {', isKeyword: true, delay: 52 },
    { text: '    return baseFare;', isKeyword: false, delay: 56 },
    { text: '  }', isKeyword: false, delay: 58 },
    { text: '}', isKeyword: true, delay: 60 },
  ];
  const codeSprings = codeLines.map(line => useSpringEntrance(frame, line.delay));

  // ── Annotation arrow ───────────────────────────────────────────────────────
  const arrowPath = usePathDraw(frame, 42, 120, 18);

  // ── Box borders (border-draw) ──────────────────────────────────────────────
  const classPerimeter = 2 * (600 + 400);
  const classBorderDraw = usePathDraw(frame, 18, classPerimeter, 30);

  const codePerimeter = 2 * (560 + 340);
  const codeBorderDraw = usePathDraw(frame, 44, codePerimeter, 28);

  // Connector line
  const connectorDraw = usePathDraw(frame, 54, 180, 18);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const methodGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.06, 0.14]);

  // ── Train icon simplified ──────────────────────────────────────────────────
  const trainEntrance = useSpringEntrance(frame, 26);
  const trainBounce = Math.sin(frame * 0.07) * 2;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="BASE CLASS · TRAIN" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headlines ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}
          >
            The Base Class
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={320}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={500}
            fill={COLORS.orange}
          >
            Train.calculateFare()
          </text>
        </g>

        {/* ── ZONE C — UML-style class box ────────────────────────────────── */}
        {/* Border draw */}
        <rect
          x={100} y={400} width={600} height={400} rx={16}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray={classPerimeter}
          strokeDashoffset={classBorderDraw}
        />
        {/* Fill */}
        <rect
          x={100} y={400} width={600} height={400} rx={16}
          fill={COLORS.orange}
          fillOpacity={classBox.opacity * 0.04}
        />

        {/* Class header */}
        <g opacity={classHeader.opacity} transform={`translate(0, ${classHeader.translateY * 0.4})`}>
          <rect x={100} y={400} width={600} height={72} rx={16} ry={0} fill={COLORS.orange} fillOpacity={0.1} />
          <text
            x={400} y={446}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={800}
            fill={COLORS.orange}
          >
            Train
          </text>
          {/* Stereotype label */}
          <text
            x={400} y={420}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={500}
            fill={COLORS.cool_silver}
            opacity={0.7}
          >
            {'<<base class>>'}
          </text>
        </g>

        {/* Divider inside class box */}
        <line
          x1={120} y1={480} x2={680} y2={480}
          stroke={COLORS.deep_black}
          strokeWidth={1}
          strokeDasharray={560}
          strokeDashoffset={dividerLine}
          opacity={0.15}
        />

        {/* Fields section */}
        <g opacity={methodRow.opacity} transform={`translate(0, ${methodRow.translateY * 0.3})`}>
          <text
            x={140} y={530}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            - baseFare: int
          </text>
          <text
            x={140} y={570}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            - route: String
          </text>
        </g>

        {/* Divider before methods */}
        <line
          x1={120} y1={596} x2={680} y2={596}
          stroke={COLORS.deep_black}
          strokeWidth={1}
          opacity={methodRow.opacity * 0.15}
        />

        {/* Method — highlighted */}
        <g opacity={methodHighlight.opacity} transform={`translate(0, ${methodHighlight.translateY * 0.3})`}>
          {/* Highlight bar behind method */}
          <rect
            x={120} y={610} width={560} height={56} rx={8}
            fill={COLORS.orange}
            opacity={methodGlow}
          />
          <text
            x={140} y={648}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={30} fontWeight={700}
            fill={COLORS.orange}
          >
            + calculateFare(): int
          </text>
        </g>

        {/* Additional methods */}
        <g opacity={methodRow.opacity * 0.5}>
          <text
            x={140} y={710}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            + getRoute(): String
          </text>
          <text
            x={140} y={752}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            + getType(): String
          </text>
        </g>

        {/* ── Annotation arrow pointing to method ─────────────────────────── */}
        <path
          d="M 720,640 L 840,640"
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={2.5}
          strokeDasharray={120}
          strokeDashoffset={arrowPath}
          strokeLinecap="round"
          markerEnd="url(#arrowBlue)"
        />
        <g opacity={methodHighlight.opacity}>
          <text
            x={860} y={636}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700}
            fill={COLORS.sky_blue}
          >
            Every train
          </text>
          <text
            x={860} y={668}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700}
            fill={COLORS.sky_blue}
          >
            inherits this
          </text>
        </g>

        {/* ── Train icon ──────────────────────────────────────────────────── */}
        <g
          opacity={trainEntrance.opacity}
          transform={`translate(800, ${440 + trainEntrance.translateY + trainBounce})`}
        >
          <rect x={0} y={0} width={120} height={60} rx={12} fill={COLORS.orange} fillOpacity={0.12} stroke={COLORS.orange} strokeWidth={2} />
          <rect x={10} y={10} width={30} height={20} rx={4} fill={COLORS.orange} fillOpacity={0.2} />
          <rect x={50} y={10} width={30} height={20} rx={4} fill={COLORS.orange} fillOpacity={0.2} />
          <circle cx={30} cy={68} r={10} fill="none" stroke={COLORS.orange} strokeWidth={2} />
          <circle cx={90} cy={68} r={10} fill="none" stroke={COLORS.orange} strokeWidth={2} />
        </g>

        {/* ── Connector to code block ─────────────────────────────────────── */}
        <path
          d="M 400,810 L 400,920"
          fill="none"
          stroke={COLORS.deep_black}
          strokeWidth={2}
          strokeDasharray={180}
          strokeDashoffset={connectorDraw}
          opacity={0.2}
          strokeLinecap="round"
        />

        {/* ── Code block ──────────────────────────────────────────────────── */}
        <rect
          x={80} y={940} width={560} height={340} rx={12}
          fill="none"
          stroke={COLORS.deep_black}
          strokeWidth={1.5}
          strokeDasharray={codePerimeter}
          strokeDashoffset={codeBorderDraw}
          opacity={0.15}
        />
        <rect
          x={80} y={940} width={560} height={340} rx={12}
          fill={COLORS.deep_black}
          fillOpacity={codeBlock.opacity * 0.03}
        />
        {/* Left accent bar */}
        <rect x={80} y={940} width={6} height={340} rx={3} fill={COLORS.orange} opacity={codeBlock.opacity} />

        {codeLines.map((line, i) => (
          <g key={i} opacity={codeSprings[i].opacity} transform={`translate(0, ${codeSprings[i].translateY * 0.3})`}>
            <text
              x={110} y={990 + i * 48}
              fontFamily="'Fira Code', 'Courier New', monospace"
              fontSize={28} fontWeight={line.isKeyword ? 600 : 400}
              fill={line.isKeyword ? COLORS.orange : COLORS.deep_black}
            >
              {line.text}
            </text>
          </g>
        ))}

        {/* ── Pulse indicator on method ───────────────────────────────────── */}
        <circle
          cx={108} cy={640} r={5}
          fill={COLORS.orange}
          opacity={0.5 * shimmer}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '108px 640px' }}
        />

        {/* ── Floating note ───────────────────────────────────────────────── */}
        <g opacity={codeBlock.opacity * 0.7} transform={`translate(0, ${breathe})`}>
          <rect x={680} y={960} width={340} height={100} rx={12} fill={COLORS.green} fillOpacity={0.06} stroke={COLORS.green} strokeWidth={1.5} />
          <text x={850} y={1000} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif" fontSize={28} fontWeight={600} fill={COLORS.green}>
            Default fare
          </text>
          <text x={850} y={1036} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            for all train types
          </text>
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s05.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
