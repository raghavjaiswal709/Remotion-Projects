/**
 * Scene 13 — RadiationDetection
 * "Artemis II carries systems that detect radiation threats in real time,"
 * CSV: 60.780s → 65.040s
 * Duration: 150 frames (5.0s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–90): Radiation shield, detector array, alert panel
 *   Phase 3 (60–end): Particle animation, shield pulse, data shimmer
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents, Divider } from '../helpers/components';

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

export const Scene13_RadiationDetection: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ──
  const shieldDraw = useSpringEntrance(frame, 18);
  const detector1 = useSpringEntrance(frame, 26);
  const detector2 = useSpringEntrance(frame, 34);
  const detector3 = useSpringEntrance(frame, 42);
  const alertPanel = useSpringEntrance(frame, 50);
  const dataPanel = useSpringEntrance(frame, 60);
  const bottomCard = useSpringEntrance(frame, 70);

  // Shield arc draw
  const shieldLength = 600;
  const shieldDash = usePathDraw(frame, 20, shieldLength, 35);

  // Connector lines
  const connLen = 120;
  const conn1Dash = usePathDraw(frame, 36, connLen, 20);
  const conn2Dash = usePathDraw(frame, 44, connLen, 20);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  // Radiation particles (Phase 3 continuous)
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 + frame * 1.5) * Math.PI / 180;
    const radius = 180 + Math.sin(frame * 0.08 + i) * 20;
    return {
      cx: 540 + Math.cos(angle) * radius,
      cy: 820 + Math.sin(angle) * radius,
      opacity: 0.15 + Math.sin(frame * 0.1 + i * 0.7) * 0.1,
    };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.green} />

        {/* Ghost background RAD text */}
        <text x={840} y={480} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={320} fontWeight={900} fill={COLORS.green} opacity={0.025}>
          RAD
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RADIATION PROTECTION · REAL TIME" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={370} fontFamily="'Inter', sans-serif" fontSize={60} fontWeight={800} fill={COLORS.deep_black}>
            Radiation Detection
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={445} fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={600} fill={COLORS.sky_blue}>
            In Real Time
          </text>
        </g>

        {/* Zone C — Orion capsule with shield */}
        <g opacity={shieldDraw.opacity} transform={`translate(0, ${shieldDraw.translateY})`}>
          {/* Orion capsule (simplified) */}
          <polygon points="540,680 480,820 600,820" fill={COLORS.sky_blue} fillOpacity={0.08}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <rect x={490} y={820} width={100} height={40} rx={4}
            fill={COLORS.sky_blue} fillOpacity={0.06} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <text x={540} y={800} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            ORION
          </text>
          {/* Shield arc */}
          <path d="M 340,680 Q 340,550 540,520 Q 740,550 740,680"
            fill="none" stroke={COLORS.green} strokeWidth={3}
            strokeDasharray={shieldLength} strokeDashoffset={shieldDash}
            strokeLinecap="round"
          />
          <path d="M 360,700 Q 360,580 540,555 Q 720,580 720,700"
            fill="none" stroke={COLORS.green} strokeWidth={1.5} opacity={0.3 * shimmer}
            strokeDasharray="8 4"
          />
        </g>

        {/* Radiation particles floating around */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={3}
            fill={COLORS.vibrant_red} opacity={shieldDraw.opacity * p.opacity} />
        ))}

        {/* Detector nodes */}
        {[
          { x: 280, y: 950, label: 'GAMMA', color: COLORS.vibrant_red, entrance: detector1 },
          { x: 540, y: 950, label: 'PROTON', color: COLORS.orange, entrance: detector2 },
          { x: 800, y: 950, label: 'NEUTRON', color: COLORS.purple, entrance: detector3 },
        ].map((det, i) => (
          <g key={i} opacity={det.entrance.opacity} transform={`translate(${det.x}, ${det.y + det.entrance.translateY})`}>
            <circle cx={0} cy={0} r={40} fill={det.color} fillOpacity={0.06}
              stroke={det.color} strokeWidth={2} />
            <circle cx={0} cy={0} r={40} fill="none" stroke={det.color} strokeWidth={2}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.3}
            />
            <circle cx={0} cy={0} r={6} fill={det.color} opacity={0.4 * shimmer} />
            <text x={0} y={65} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700} fill={det.color}>
              {det.label}
            </text>
          </g>
        ))}

        {/* Connectors from capsule to detectors */}
        <line x1={480} y1={860} x2={280} y2={910}
          stroke={COLORS.cool_silver} strokeWidth={1.5} opacity={detector1.opacity * 0.3}
          strokeDasharray={connLen} strokeDashoffset={conn1Dash}
        />
        <line x1={540} y1={860} x2={540} y2={910}
          stroke={COLORS.cool_silver} strokeWidth={1.5} opacity={detector2.opacity * 0.3}
          strokeDasharray={connLen} strokeDashoffset={conn2Dash}
        />
        <line x1={600} y1={860} x2={800} y2={910}
          stroke={COLORS.cool_silver} strokeWidth={1.5} opacity={detector3.opacity * 0.3}
          strokeDasharray={connLen} strokeDashoffset={conn2Dash}
        />

        {/* Alert panel */}
        <g opacity={alertPanel.opacity} transform={`translate(60, ${1060 + alertPanel.translateY})`}>
          <rect x={0} y={0} width={460} height={180} rx={12}
            fill={COLORS.green} fillOpacity={0.04} stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={180} rx={3} fill={COLORS.green} />
          <text x={30} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.green}>
            THREAT DETECTION
          </text>
          <text x={30} y={78} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.deep_black}>
            Solar particle events
          </text>
          <text x={30} y={118} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.deep_black}>
            Galactic cosmic rays
          </text>
          <text x={30} y={158} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.deep_black}>
            Van Allen belt flux
          </text>
        </g>

        {/* Data panel */}
        <g opacity={dataPanel.opacity} transform={`translate(560, ${1060 + dataPanel.translateY})`}>
          <rect x={0} y={0} width={460} height={180} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.04} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={180} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            RESPONSE TIME
          </text>
          <text x={30} y={85} fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900} fill={COLORS.deep_black}>
            {'< 1 second'}
          </text>
          <text x={30} y={125} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Automated crew alert
          </text>
          <text x={30} y={158} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Shield protocol engaged
          </text>
        </g>

        {/* Bottom card */}
        <g opacity={bottomCard.opacity} transform={`translate(60, ${1310 + bottomCard.translateY + breathe})`}>
          <rect x={0} y={0} width={960} height={90} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.02} />
          <text x={480} y={54} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={600} fill={COLORS.deep_black} opacity={0.7}>
            Apollo 8 had zero radiation monitoring capability
          </text>
        </g>

        {/* Decorative shield glow ring */}
        <circle cx={540} cy={760} r={200} fill="none" stroke={COLORS.green} strokeWidth={1}
          opacity={shieldDraw.opacity * 0.1 * shimmer}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '540px 760px' }}
        />

        {/* Divider + bottom note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.15em" opacity={0.45}>
          REAL-TIME · AUTOMATED · {'< 1 SECOND'}
        </text>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s13.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
