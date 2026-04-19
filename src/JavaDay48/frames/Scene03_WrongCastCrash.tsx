/**
 * Scene 03 — Wrong Cast Crash
 * "and why a wrong cast crashes the system at runtime."
 * CSV: 12.240s → 15.880s | Duration: 109 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Headline + warning label spring in
 *   Phase 2 (20–70): Crash diagram — wrong cast path, explosion SVG
 *   Phase 3 (60–end): Pulsing error, shaking elements
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene03_WrongCastCrash: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 6);
  const subE = useSpringEntrance(frame, 12);

  // Phase 2
  const codeCard = useSpringEntrance(frame, 18);
  const errorCard = useSpringEntrance(frame, 30);
  const crashE = useSpringEntrance(frame, 40);
  const xPathLen = 120;
  const xDash = usePathDraw(frame, 44, xPathLen, 20);

  // Phase 3
  const shake = frame > 50 ? Math.sin(frame * 0.6) * 2 : 0;
  const errorPulse = 1 + Math.sin(frame * 0.12) * 0.03;
  const breathe = Math.sin(frame * 0.06) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Explosion lines
  const explodeE = useSpringEntrance(frame, 48);
  const sparks = [
    { angle: 0, len: 60 }, { angle: 45, len: 50 }, { angle: 90, len: 65 },
    { angle: 135, len: 45 }, { angle: 180, len: 55 }, { angle: 225, len: 50 },
    { angle: 270, len: 60 }, { angle: 315, len: 48 },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="RUNTIME ERROR" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(${shake}, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.vibrant_red}>
            Wrong Cast
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.text_muted}>
            System crash at runtime
          </text>
        </g>

        {/* Zone C — Bad code example */}
        <g opacity={codeCard.opacity} transform={`translate(${shake}, ${codeCard.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={240} />
          <rect x={60} y={460} width={6} height={240} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={530} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={34} fontWeight={500} fill={COLORS.text_muted}>
            Train t = new MetroTrain();
          </text>
          <text x={100} y={580} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={34} fontWeight={500} fill={COLORS.vibrant_red}>
            ExpressTrain e = (ExpressTrain) t;
          </text>
          <text x={100} y={640} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={32} fontWeight={500} fill={COLORS.text_muted}>
            {'// MetroTrain ≠ ExpressTrain'}
          </text>
          <text x={100} y={680} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={32} fontWeight={500} fill={COLORS.vibrant_red}>
            {'// → ClassCastException!'}
          </text>
        </g>

        {/* Explosion illustration */}
        <g opacity={explodeE.opacity} transform={`translate(540, 880)`}>
          {/* Central burst */}
          <circle cx={0} cy={0} r={60} fill={COLORS.vibrant_red} fillOpacity={0.08}
            transform={`scale(${errorPulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={40} fill={COLORS.vibrant_red} fillOpacity={0.12}
            transform={`scale(${errorPulse})`} style={{ transformOrigin: '0px 0px' }} />

          {/* Spark lines */}
          {sparks.map((s, i) => {
            const rad = (s.angle * Math.PI) / 180;
            const x2 = Math.cos(rad) * s.len * explodeE.progress;
            const y2 = Math.sin(rad) * s.len * explodeE.progress;
            return (
              <line key={i} x1={0} y1={0} x2={x2} y2={y2}
                stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round"
                opacity={0.6 * shimmer} />
            );
          })}

          {/* Big X */}
          <path d="M -30,-30 L 30,30" fill="none" stroke={COLORS.vibrant_red} strokeWidth={6}
            strokeLinecap="round" strokeDasharray={xPathLen} strokeDashoffset={xDash} />
          <path d="M 30,-30 L -30,30" fill="none" stroke={COLORS.vibrant_red} strokeWidth={6}
            strokeLinecap="round" strokeDasharray={xPathLen} strokeDashoffset={xDash} />
        </g>

        {/* Error card */}
        <g opacity={errorCard.opacity} transform={`translate(${shake}, ${errorCard.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={200} />
          <rect x={60} y={980} width={960} height={200} rx={20}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} />
          <text x={100} y={1060} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.vibrant_red}>
            ClassCastException
          </text>
          <text x={100} y={1110} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            MetroTrain cannot be cast to ExpressTrain
          </text>
          <text x={100} y={1160} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            at runtime — no compile-time warning
          </text>
        </g>

        {/* Warning triangle */}
        <g opacity={crashE.opacity} transform={`translate(540, ${1340 + breathe})`}>
          <polygon points="0,-60 55,50 -55,50"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
            transform={`scale(${errorPulse})`} style={{ transformOrigin: '0px 0px' }} />
          <text x={0} y={32} textAnchor="middle" fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.vibrant_red}>!</text>
        </g>

        {/* Bottom explanation */}
        <g opacity={crashE.opacity}>
          <BentoCard x={60} y={1440} w={960} h={160} accent />
          <text x={100} y={1510} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The compiler trusts your cast.
          </text>
          <text x={100} y={1560} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            The JVM does not.
          </text>
        </g>

        {/* Decorative pulsing dots */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={540 + (i - 1) * 40} cy={1680} r={4}
            fill={COLORS.vibrant_red} fillOpacity={0.3 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s03.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
