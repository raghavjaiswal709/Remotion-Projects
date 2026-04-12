/**
 * Scene 14 — AdjustTrajectory
 * "adjust trajectory mid-flight, and communicate with Earth at speeds Apollo could never access."
 * CSV: 65.040s → 71.600s
 * Duration: 204 frames (6.8s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Labels + headline spring
 *   Phase 2 (20–90): Trajectory adjust diagram, comm link, speed comparison
 *   Phase 3 (70–end): Pulse, signal wave motion
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene14_AdjustTrajectory: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ──
  const earthNode = useSpringEntrance(frame, 16);
  const capsuleNode = useSpringEntrance(frame, 22);
  const moonNode = useSpringEntrance(frame, 28);
  const trajCard = useSpringEntrance(frame, 36);
  const commCard = useSpringEntrance(frame, 48);
  const speedCard = useSpringEntrance(frame, 60);
  const bottomNote = useSpringEntrance(frame, 72);

  // Path draws
  const origPathLen = 400;
  const newPathLen = 420;
  const commLineLen = 500;
  const origDash = usePathDraw(frame, 22, origPathLen, 25);
  const newDash = usePathDraw(frame, 30, newPathLen, 25);
  const commDash = usePathDraw(frame, 48, commLineLen, 30);

  // Speed counter
  const apolloSpeed = useCounter(frame, 60, 51, 35);
  const artemisSpeed = useCounter(frame, 65, 25000, 40);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Signal wave animation
  const signalPhase = frame * 0.15;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* Corner accents */}
        <CornerAccents opacity={0.35} color={COLORS.green} />

        {/* Ghost "500x" watermark */}
        <text x={540} y={1650} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={340} fontWeight={900}
          fill={COLORS.green} opacity={0.025}>
          500x
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="NAVIGATION · COMMUNICATION" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={370} fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={800} fill={COLORS.deep_black}>
            Adjust Mid-Flight
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={445} fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={600} fill={COLORS.sky_blue}>
            Communicate at Speed
          </text>
        </g>

        {/* Zone C — Trajectory diagram */}
        {/* Earth node */}
        <g opacity={earthNode.opacity} transform={`translate(160, ${600 + earthNode.translateY})`}>
          <circle cx={0} cy={0} r={50} fill={COLORS.sky_blue} fillOpacity={0.08}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <circle cx={0} cy={0} r={35} fill={COLORS.sky_blue} fillOpacity={0.04} />
          {/* Continent suggestion */}
          <ellipse cx={-8} cy={-5} rx={12} ry={18} fill={COLORS.green} fillOpacity={0.15} />
          <ellipse cx={12} cy={8} rx={8} ry={14} fill={COLORS.green} fillOpacity={0.12} />
          <text x={0} y={75} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700} fill={COLORS.sky_blue}>
            EARTH
          </text>
        </g>

        {/* Moon node */}
        <g opacity={moonNode.opacity} transform={`translate(920, ${600 + moonNode.translateY})`}>
          <circle cx={0} cy={0} r={35} fill={COLORS.cool_silver} fillOpacity={0.1}
            stroke={COLORS.cool_silver} strokeWidth={2} />
          {/* Craters */}
          <circle cx={-8} cy={-6} r={5} fill={COLORS.cool_silver} fillOpacity={0.08} />
          <circle cx={8} cy={4} r={7} fill={COLORS.cool_silver} fillOpacity={0.06} />
          <circle cx={-3} cy={10} r={4} fill={COLORS.cool_silver} fillOpacity={0.07} />
          <text x={0} y={60} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700} fill={COLORS.cool_silver}>
            MOON
          </text>
        </g>

        {/* Original trajectory (dashed) */}
        <path d="M 210,600 Q 540,500 885,600"
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2} opacity={0.3}
          strokeDasharray={origPathLen} strokeDashoffset={origDash}
          strokeLinecap="round"
        />
        <text x={540} y={490} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
          fill={COLORS.cool_silver} opacity={capsuleNode.opacity * 0.5}>
          ORIGINAL PATH
        </text>

        {/* Adjusted trajectory (solid) */}
        <path d="M 210,600 Q 540,440 885,600"
          fill="none" stroke={COLORS.green} strokeWidth={3}
          strokeDasharray={newPathLen} strokeDashoffset={newDash}
          strokeLinecap="round"
        />
        <text x={540} y={430} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
          fill={COLORS.green} opacity={capsuleNode.opacity * 0.7}>
          ADJUSTED PATH
        </text>

        {/* Moving capsule on adjusted path */}
        <g opacity={capsuleNode.opacity}>
          {(() => {
            const t = interpolate(frame, [22, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const cx = 210 + t * (885 - 210);
            const cy = 600 + (1 - t) * t * 4 * (440 - 600);
            return (
              <g transform={`translate(${cx}, ${cy})`}>
                <polygon points="0,-10 -6,6 6,6" fill={COLORS.green} />
                <circle cx={0} cy={0} r={14} fill="none" stroke={COLORS.green} strokeWidth={1.5} opacity={0.3 * shimmer} />
              </g>
            );
          })()}
        </g>

        {/* Comm link from Earth — signal wave */}
        <g opacity={commCard.opacity}>
          {/* Signal wave visualization */}
          <path d={`M 160,680 ${Array.from({ length: 20 }, (_, i) => {
            const x = 160 + i * 38;
            const y = 680 + Math.sin(i * 0.8 + signalPhase) * 12;
            return `L ${x},${y}`;
          }).join(' ')}`}
            fill="none" stroke={COLORS.amber} strokeWidth={2}
            opacity={0.35 * shimmer} strokeLinecap="round"
          />
          {/* Signal dots (moving) */}
          {[0, 1, 2].map(i => {
            const x = 160 + ((frame * 4 + i * 250) % 760);
            return (
              <circle key={i} cx={x} cy={680 + Math.sin(x * 0.02 + signalPhase) * 10} r={4}
                fill={COLORS.amber} opacity={0.4 * shimmer} />
            );
          })}
        </g>

        {/* Trajectory adjust info card */}
        <g opacity={trajCard.opacity} transform={`translate(60, ${760 + trajCard.translateY})`}>
          <rect x={0} y={0} width={460} height={160} rx={12}
            fill={COLORS.green} fillOpacity={0.04} stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={160} rx={3} fill={COLORS.green} />
          <text x={30} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.green}>
            MID-FLIGHT ADJUST
          </text>
          <text x={30} y={80} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.deep_black}>
            Real-time navigation
          </text>
          <text x={30} y={120} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.deep_black}>
            Autonomous course correct
          </text>
        </g>

        {/* Communication card */}
        <g opacity={commCard.opacity} transform={`translate(560, ${760 + commCard.translateY})`}>
          <rect x={0} y={0} width={460} height={160} rx={12}
            fill={COLORS.amber} fillOpacity={0.04} stroke={COLORS.amber} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={160} rx={3} fill={COLORS.amber} />
          <text x={30} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.amber}>
            DEEP SPACE COMMS
          </text>
          <text x={30} y={80} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.deep_black}>
            High-bandwidth link
          </text>
          <text x={30} y={120} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.deep_black}>
            Video from lunar orbit
          </text>
        </g>

        {/* Speed comparison */}
        <g opacity={speedCard.opacity} transform={`translate(60, ${990 + speedCard.translateY})`}>
          <rect x={0} y={0} width={960} height={200} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.02} />
          {/* Apollo speed */}
          <text x={260} y={60} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600} fill={COLORS.cool_silver}>
            APOLLO 8 DATA RATE
          </text>
          <text x={260} y={120} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={900} fill={COLORS.cool_silver}>
            {apolloSpeed} kbps
          </text>
          <text x={260} y={160} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver} opacity={0.5}>
            Voice only
          </text>

          {/* Divider */}
          <line x1={480} y1={20} x2={480} y2={180} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />

          {/* Artemis speed */}
          <text x={720} y={60} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600} fill={COLORS.sky_blue}>
            ARTEMIS II DATA RATE
          </text>
          <text x={720} y={120} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={900} fill={COLORS.sky_blue}>
            {artemisSpeed.toLocaleString()} kbps
          </text>
          <text x={720} y={160} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.sky_blue} opacity={0.6}>
            4K video + telemetry
          </text>
        </g>

        {/* Bottom note */}
        <g opacity={bottomNote.opacity} transform={`translate(0, ${bottomNote.translateY + breathe})`}>
          <text x={540} y={1280} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={800} fill={COLORS.sky_blue} opacity={shimmer}>
            500x Faster
          </text>
          <text x={540} y={1330} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Communication speed compared to Apollo
          </text>
        </g>

        {/* Divider + bottom note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.15em" opacity={0.45}>
          MID-FLIGHT · REAL-TIME · 500× FASTER
        </text>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s14.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
