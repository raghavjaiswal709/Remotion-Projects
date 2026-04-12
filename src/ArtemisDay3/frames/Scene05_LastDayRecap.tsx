/**
 * Scene 05 — LastDayRecap
 * "Last day, we learned why Artemis II is the most consequential crude mission NASA has launched since the moon landings ended."
 * CSV: 15.000s → 23.200s
 * Duration: 264 frames (8.8s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring in
 *   Phase 2 (20–120): NASA badge, rocket illustration, launch pad draw
 *   Phase 3 (100–end): Exhaust particles float, badge pulses
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
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

export const Scene05_LastDayRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ──
  const rocketBody = useSpringEntrance(frame, 24);
  const launchPad = useSpringEntrance(frame, 30);
  const nasaBadge = useSpringEntrance(frame, 42);
  const infoCard1 = useSpringEntrance(frame, 54);
  const infoCard2 = useSpringEntrance(frame, 66);
  const infoCard3 = useSpringEntrance(frame, 78);

  // Path draws
  const exhaustLength = 400;
  const exhaustDash = usePathDraw(frame, 35, exhaustLength, 40);
  const gantryLength = 500;
  const gantryDash = usePathDraw(frame, 28, gantryLength, 30);

  // ── Phase 3: Micro-animations ──
  const breathe = Math.sin(frame * 0.05) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Exhaust particles
  const particles = Array.from({ length: 8 }, (_, i) => {
    const particleFrame = frame - 40 - i * 5;
    const pY = Math.max(0, particleFrame * 3);
    const pOp = interpolate(particleFrame, [0, 30], [0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const pX = Math.sin(particleFrame * 0.2 + i) * (15 + i * 5);
    return { x: pX, y: pY, opacity: pOp };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.sky_blue} />

        {/* Ghost background text */}
        <text x={820} y={500} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={320} fontWeight={900} fill={COLORS.sky_blue} opacity={0.03}>
          SLS
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RECAP · YESTERDAY" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={370} fontFamily="'Inter', sans-serif" fontSize={64} fontWeight={800} fill={COLORS.deep_black}>
            Most Consequential
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={440} fontFamily="'Inter', sans-serif" fontSize={64} fontWeight={800} fill={COLORS.sky_blue}>
            Crewed Mission
          </text>
          <text x={60} y={510} fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={400} fill={COLORS.cool_silver}>
            since the moon landings ended
          </text>
        </g>

        {/* Zone C — Rocket illustration (center) */}
        <g opacity={rocketBody.opacity} transform={`translate(400, ${700 + rocketBody.translateY})`}>
          {/* SLS Booster body */}
          <rect x={-30} y={0} width={60} height={320} rx={10} fill={COLORS.deep_black} fillOpacity={0.06} stroke={COLORS.sky_blue} strokeWidth={2} />
          {/* Nose cone */}
          <polygon points="0,-80 -35,0 35,0" fill={COLORS.sky_blue} fillOpacity={0.12} stroke={COLORS.sky_blue} strokeWidth={2} />
          {/* Orion capsule on top */}
          <polygon points="0,-100 -20,-80 20,-80" fill={COLORS.sky_blue} fillOpacity={0.2} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          {/* Side boosters */}
          <rect x={-60} y={120} width={25} height={180} rx={6} fill={COLORS.orange} fillOpacity={0.1} stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={35} y={120} width={25} height={180} rx={6} fill={COLORS.orange} fillOpacity={0.1} stroke={COLORS.orange} strokeWidth={1.5} />
          {/* Engine nozzles */}
          <rect x={-25} y={320} width={50} height={20} rx={4} fill={COLORS.amber} fillOpacity={0.15} stroke={COLORS.amber} strokeWidth={1} />
          <rect x={-55} y={300} width={20} height={15} rx={3} fill={COLORS.orange} fillOpacity={0.12} />
          <rect x={35} y={300} width={20} height={15} rx={3} fill={COLORS.orange} fillOpacity={0.12} />
          {/* NASA label */}
          <text x={0} y={200} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.sky_blue} opacity={0.6}
            transform="rotate(-90, 0, 200)">
            SLS
          </text>
        </g>

        {/* Exhaust flame */}
        <path
          d="M 400,1040 C 380,1120 360,1200 400,1350 C 440,1200 420,1120 400,1040"
          fill="none" stroke={COLORS.orange} strokeWidth={3}
          strokeDasharray={exhaustLength}
          strokeDashoffset={exhaustDash}
          opacity={0.4}
        />

        {/* Exhaust particles */}
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={400 + p.x}
            cy={1040 + p.y}
            r={4 - i * 0.3}
            fill={COLORS.orange}
            opacity={p.opacity * rocketBody.opacity}
          />
        ))}

        {/* Launch pad */}
        <g opacity={launchPad.opacity} transform={`translate(0, ${launchPad.translateY})`}>
          <rect x={280} y={1040} width={240} height={12} rx={2} fill={COLORS.deep_black} fillOpacity={0.1} />
          {/* Gantry tower */}
          <path
            d="M 310,1040 L 310,700 M 310,800 L 365,750 M 310,900 L 365,850"
            fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
            strokeDasharray={gantryLength}
            strokeDashoffset={gantryDash}
            opacity={0.3}
          />
        </g>

        {/* NASA badge */}
        <g opacity={nasaBadge.opacity} transform={`translate(810, ${700 + nasaBadge.translateY + breathe})`}>
          <circle cx={0} cy={0} r={70} fill={COLORS.sky_blue} fillOpacity={0.06} stroke={COLORS.sky_blue} strokeWidth={2} />
          <text x={0} y={8} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={900} fill={COLORS.sky_blue}>
            NASA
          </text>
          {/* Pulsing ring */}
          <circle cx={0} cy={0} r={interpolate(pulse, [0.985, 1.015], [68, 75])}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1} opacity={shimmer * 0.3} />
        </g>

        {/* Info cards */}
        <g opacity={infoCard1.opacity} transform={`translate(600, ${860 + infoCard1.translateY})`}>
          <rect x={0} y={0} width={400} height={90} rx={12} fill={COLORS.sky_blue} fillOpacity={0.06} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <text x={20} y={38} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            ARTEMIS II
          </text>
          <text x={20} y={70} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            4 astronauts, lunar orbit
          </text>
        </g>

        <g opacity={infoCard2.opacity} transform={`translate(600, ${970 + infoCard2.translateY})`}>
          <rect x={0} y={0} width={400} height={90} rx={12} fill={COLORS.orange} fillOpacity={0.06} stroke={COLORS.orange} strokeWidth={1.5} />
          <text x={20} y={38} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            POST-APOLLO
          </text>
          <text x={20} y={70} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            50+ years without crew
          </text>
        </g>

        <g opacity={infoCard3.opacity} transform={`translate(600, ${1080 + infoCard3.translateY})`}>
          <rect x={0} y={0} width={400} height={90} rx={12} fill={COLORS.green} fillOpacity={0.06} stroke={COLORS.green} strokeWidth={1.5} />
          <text x={20} y={38} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.green}>
            DEEP SPACE
          </text>
          <text x={20} y={70} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            Beyond Earth protection
          </text>
        </g>

        {/* Connecting lines from rocket to cards */}
        <path
          d="M 435,800 L 600,900"
          fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5}
          strokeDasharray={200}
          strokeDashoffset={usePathDraw(frame, 55, 200, 20)}
          opacity={0.2}
        />
        <path
          d="M 435,900 L 600,1010"
          fill="none" stroke={COLORS.orange} strokeWidth={1.5}
          strokeDasharray={200}
          strokeDashoffset={usePathDraw(frame, 65, 200, 20)}
          opacity={0.2}
        />

        {/* Stars scattered */}
        {[
          { cx: 120, cy: 650, r: 2 },
          { cx: 200, cy: 800, r: 1.5 },
          { cx: 150, cy: 950, r: 2 },
          { cx: 950, cy: 1250, r: 2 },
          { cx: 880, cy: 1350, r: 1.5 },
        ].map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={COLORS.sky_blue}
            opacity={interpolate(Math.sin(frame * 0.05 + i), [-1, 1], [0.15, 0.4])} />
        ))}

        {/* Bottom label */}
        <g opacity={infoCard3.opacity * shimmer}>
          <text x={540} y={1700} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.15em">
            SINCE MOON LANDINGS ENDED
          </text>
        </g>

        {/* Caption */}
        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1820} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={shimmer * 0.6} letterSpacing="0.12em">
          MOST CONSEQUENTIAL · POST-APOLLO ERA
        </text>

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
