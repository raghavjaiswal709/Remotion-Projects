/**
 * Scene 19 — What Happens When Need Express Specific Back
 * "But what happens when you actually need the express-specific features back?"
 * CSV: 66.180s → 70.960s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–80): Train reference with locked features, question mark
 *   Phase 3 (70–end): Pulse, breathe
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene19_NeedExpressBack: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 10);

  // Train reference card — shows Train ref pointing at ExpressTrain
  const refCard = useSpringEntrance(frame, 16);
  const refPerim = 2 * (960 + 260);
  const refDash = usePathDraw(frame, 18, refPerim, 28);

  // Visible methods
  const visItems = [
    { name: 'depart()', status: 'visible' },
    { name: 'arrive()', status: 'visible' },
    { name: 'getPassengers()', status: 'visible' },
  ];
  const visEnts = visItems.map((_, i) => useSpringEntrance(frame, 24 + i * 8));

  // Locked methods — express-only, behind a lock icon
  const lockItems = [
    { name: 'activateBoost()', status: 'locked' },
    { name: 'getExpressRoute()', status: 'locked' },
    { name: 'premiumSeating()', status: 'locked' },
  ];
  const lockEnts = lockItems.map((_, i) => useSpringEntrance(frame, 44 + i * 8));

  // Barrier line
  const barrierLen = 700;
  const barrierDash = usePathDraw(frame, 40, barrierLen, 25);

  // Question mark
  const qEnt = useSpringEntrance(frame, 60);

  // Insight
  const insightEnt = useSpringEntrance(frame, 68);

  // Bottom explanation
  const bottomEnt = useSpringEntrance(frame, 76);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="THE LIMITATION" y={130} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={60} fontWeight={800} fill={COLORS.white}>
            Need Express Features
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.vibrant_red} fontStyle="italic">
            Back?
          </text>
        </g>

        {/* Train reference card */}
        <g opacity={refCard.opacity} transform={`translate(0, ${refCard.translateY})`}>
          <rect x={60} y={440} width={960} height={260} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={refPerim} strokeDashoffset={refDash} />
          <text x={100} y={480} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
            TRAIN t = expressTrain;
          </text>
          <text x={100} y={520} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Reference type: Train — object type: ExpressTrain
          </text>
        </g>

        {/* Visible methods on left */}
        {visItems.map((item, i) => {
          const ent = visEnts[i];
          const y = 555 + i * 45;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <circle cx={120} cy={y} r={10} fill="#22C55E" fillOpacity={0.2} />
              <text x={122} y={y + 5} textAnchor="middle" fontFamily={FONT} fontSize={14} fontWeight={800} fill="#22C55E">
                ✓
              </text>
              <text x={145} y={y + 6} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.white}>
                {item.name}
              </text>
              <text x={400} y={y + 6} fontFamily={FONT} fontSize={18} fontWeight={800} fill="#22C55E">
                ACCESSIBLE
              </text>
            </g>
          );
        })}

        {/* Barrier */}
        <line x1={100} y1={720} x2={800} y2={720}
          stroke={COLORS.vibrant_red} strokeWidth={3} strokeDasharray="12,6"
          strokeDashoffset={barrierDash} opacity={0.6} />
        <g opacity={refCard.opacity}>
          <text x={820} y={726} fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.vibrant_red}>
            BARRIER
          </text>
        </g>

        {/* Locked methods below */}
        {lockItems.map((item, i) => {
          const ent = lockEnts[i];
          const y = 760 + i * 45;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              {/* Lock icon */}
              <rect x={112} y={y - 14} width={16} height={12} rx={2}
                fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5} />
              <path d={`M 115,${y - 14} L 115,${y - 20} Q 120,${y - 28} 125,${y - 20} L 125,${y - 14}`}
                fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5} />

              <text x={145} y={y + 2} fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={COLORS.text_muted} opacity={0.5}>
                {item.name}
              </text>
              <text x={400} y={y + 2} fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.vibrant_red}>
                LOCKED
              </text>
            </g>
          );
        })}

        {/* Giant question mark */}
        <g opacity={qEnt.opacity} transform={`translate(0, ${qEnt.translateY + breathe})`}>
          <text x={540} y={1020} textAnchor="middle" fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.1}>
            ?
          </text>
          <text x={540} y={1020} textAnchor="middle" fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.3 * pulse}>
            ?
          </text>
        </g>

        {/* Insight */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1070} w={960} h={120} accent />
          <rect x={60} y={1070} width={6} height={120} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={1120} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.white}>
            Upcasting hides subtype methods —
          </text>
          <text x={100} y={1160} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.vibrant_red}>
            how do we get them back?
          </text>
        </g>

        {/* Bottom cards */}
        <g opacity={bottomEnt.opacity} transform={`translate(0, ${bottomEnt.translateY})`}>
          <BentoCard x={60} y={1250} w={460} h={140} />
          <text x={100} y={1310} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            Upcasting trade-off
          </text>
          <text x={100} y={1350} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Generality gained, specifics lost
          </text>

          <BentoCard x={560} y={1250} w={460} h={140} />
          <text x={600} y={1310} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.vibrant_red}>
            Recovery needed
          </text>
          <text x={600} y={1350} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            A deliberate cast is required
          </text>
        </g>

        {/* Rail */}
        <g opacity={0.1}>
          <line x1={60} y1={1470} x2={1020} y2={1470} stroke={COLORS.text_muted} strokeWidth={2} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
