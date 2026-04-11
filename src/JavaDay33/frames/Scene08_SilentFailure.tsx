/**
 * Scene08 — Silent Failure
 * "The override silently never happens."
 * CSV: 32.74s -> 34.88s
 * Duration: 82 frames (2.73s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-15):  Label + dramatic headline
 *   Phase 2 (frames 12-50): Failed override diagram, broken arrow, X marks
 *   Phase 3 (frames 45-end): Fade shimmer, pulse on "silently"
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

export const Scene08_SilentFailure: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 4);

  // ── Phase 2: Diagram elements ──────────────────────────────────────────────
  const parentBox = useSpringEntrance(frame, 10);
  const childBox = useSpringEntrance(frame, 16);
  const brokenArrow = useSpringEntrance(frame, 20);
  const xMark = useSpringEntrance(frame, 24);
  const silentLabel = useSpringEntrance(frame, 28);

  // "SILENTLY" word snap
  const silentSnap = spring({ frame: Math.max(0, frame - 12), fps: 30, config: SPRING_SNAP });
  const silentScale = interpolate(silentSnap, [0, 1], [0.6, 1]);
  const silentOpacity = interpolate(silentSnap, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Diagram connector
  const ghostLine = useSpringEntrance(frame, 22);

  // Result cards
  const resultCard1 = useSpringEntrance(frame, 32);
  const resultCard2 = useSpringEntrance(frame, 38);
  const warningCard = useSpringEntrance(frame, 44);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 22, arrowLen, 18);
  const xLen = 70;
  const xDash1 = usePathDraw(frame, 26, xLen, 10);
  const xDash2 = usePathDraw(frame, 28, xLen, 10);

  const card1Perim = 2 * (440 + 140);
  const card1Border = interpolate(frame, [34, 50], [card1Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const card2Perim = 2 * (440 + 140);
  const card2Border = interpolate(frame, [40, 56], [card2Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const warnPerim = 2 * (960 + 120);
  const warnBorder = interpolate(frame, [46, 62], [warnPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const redFade = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.4, 0.8]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · SILENT FAILURE" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Dramatic headline ──────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={540} y={260}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Override
          </text>
        </g>

        {/* "SILENTLY" — dramatic pop-in */}
        <text
          x={540} y={400}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={120} fontWeight={900}
          fill={COLORS.vibrant_red}
          opacity={silentOpacity * redFade}
          transform={`scale(${silentScale})`}
          style={{ transformOrigin: '540px 370px' }}
        >
          SILENTLY
        </text>

        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={540} y={480}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Never Happens
          </text>
        </g>

        {/* ── ZONE C — Failed override diagram ────────────────────────────── */}

        {/* Parent box */}
        <g opacity={parentBox.opacity} transform={`translate(0, ${parentBox.translateY * 0.5})`}>
          <rect x={80} y={560} width={380} height={160} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <text x={270} y={610} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.sky_blue}>
            Train
          </text>
          <line x1={100} y1={624} x2={440} y2={624} stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.25} />
          <text x={110} y={666} fontFamily="'Fira Code', monospace" fontSize={26} fontWeight={400} fill={COLORS.deep_black}>
            calculateFare()
          </text>
        </g>

        {/* Child box */}
        <g opacity={childBox.opacity} transform={`translate(0, ${childBox.translateY * 0.5})`}>
          <rect x={580} y={560} width={420} height={240} rx={12}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2} />
          <text x={790} y={610} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.orange}>
            ExpressTrain
          </text>
          <line x1={600} y1={624} x2={980} y2={624} stroke={COLORS.orange} strokeWidth={1} opacity={0.25} />
          <text x={610} y={666} fontFamily="'Fira Code', monospace" fontSize={26} fontWeight={400} fill={COLORS.vibrant_red}>
            calculatefare()
          </text>
          <text x={610} y={700} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={400} fill={COLORS.vibrant_red} opacity={0.6}>
            (new, does NOT override)
          </text>
          <line x1={610} y1={718} x2={970} y2={718} stroke={COLORS.deep_black} strokeWidth={0.5} opacity={0.1} />
          <text x={610} y={754} fontFamily="'Fira Code', monospace" fontSize={26} fontWeight={400} fill={COLORS.cool_silver} opacity={0.4}>
            calculateFare()
          </text>
          <text x={610} y={784} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={400} fill={COLORS.cool_silver} opacity={0.3}>
            (inherited, parent logic)
          </text>
        </g>

        {/* Broken arrow between boxes */}
        <g opacity={brokenArrow.opacity}>
          <path d={`M 460,640 L 580,640`} fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" opacity={0.3} />
        </g>

        {/* X mark on the arrow (failed connection) */}
        <g opacity={xMark.opacity}>
          <path d={`M 505,610 L 540,670`} fill="none" stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={xLen} strokeDashoffset={xDash1} />
          <path d={`M 540,610 L 505,670`} fill="none" stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={xLen} strokeDashoffset={xDash2} />
        </g>

        {/* Ghost dashed line (the override that SHOULD have been) */}
        <g opacity={ghostLine.opacity * 0.2}>
          <line x1={460} y1={640} x2={580} y2={640}
            stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray="6 6" />
        </g>

        {/* "SILENT" label near the X */}
        <g opacity={silentLabel.opacity} transform={`translate(522, ${580 + silentLabel.translateY})`}>
          <text textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={20} fontWeight={800} fill={COLORS.vibrant_red}
            letterSpacing="0.15em" opacity={redFade}>
            SILENT
          </text>
        </g>

        {/* ── Result cards ────────────────────────────────────────────────── */}
        <g opacity={resultCard1.opacity} transform={`translate(60, ${860 + resultCard1.translateY})`}>
          <rect x={0} y={0} width={440} height={140} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.04} />
          <rect x={0} y={0} width={440} height={140} rx={12}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray={card1Perim} strokeDashoffset={card1Border} opacity={0.3} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.vibrant_red} />
          <text x={28} y={48} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            NO ERROR
          </text>
          <text x={28} y={88} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.vibrant_red}>
            No compiler warning
          </text>
          <text x={28} y={120} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400} fill={COLORS.deep_black}>
            Code compiles just fine
          </text>
        </g>

        <g opacity={resultCard2.opacity} transform={`translate(540, ${860 + resultCard2.translateY})`}>
          <rect x={0} y={0} width={440} height={140} rx={12}
            fill={COLORS.orange} fillOpacity={0.04} />
          <rect x={0} y={0} width={440} height={140} rx={12}
            fill="none" stroke={COLORS.orange} strokeWidth={1.5}
            strokeDasharray={card2Perim} strokeDashoffset={card2Border} opacity={0.3} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.orange} />
          <text x={28} y={48} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            RUNTIME BUG
          </text>
          <text x={28} y={88} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.orange}>
            Wrong fare charged
          </text>
          <text x={28} y={120} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400} fill={COLORS.deep_black}>
            Only found in production
          </text>
        </g>

        {/* ── Warning banner ──────────────────────────────────────────────── */}
        <g opacity={warningCard.opacity} transform={`translate(60, ${1050 + warningCard.translateY})`}>
          <rect x={0} y={0} width={960} height={120} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.05} />
          <rect x={0} y={0} width={960} height={120} rx={12}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray={warnPerim} strokeDashoffset={warnBorder} opacity={0.3} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.vibrant_red} />
          <text x={32} y={50} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={700} fill={COLORS.vibrant_red}>
            The most dangerous kind of bug
          </text>
          <text x={32} y={92} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            It looks correct — but it never does what you intend
          </text>
        </g>

        {/* ── Phase 3: Breathe ────────────────────────────────────────────── */}
        <g transform={`translate(80, ${550 + breathe})`} opacity={0.06 * shimmer}>
          <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.vibrant_red} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s08.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
