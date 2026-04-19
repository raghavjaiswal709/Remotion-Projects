/**
 * Scene 08 — Java Permits Automatically, No Cast
 * "Java permits this assignment automatically, you don't need any special cast."
 * CSV: 30.560s → 33.920s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–90): Auto-assignment diagram, no-cast badge, code example
 *   Phase 3 (80–end): Pulse, shimmer
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

export const Scene08_JavaPermitsAutomatically: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  const codeCard = useSpringEntrance(frame, 20);
  const arrowEnt = useSpringEntrance(frame, 30);
  const checkCard = useSpringEntrance(frame, 36);
  const noCastBadge = useSpringEntrance(frame, 44);
  const compCard = useSpringEntrance(frame, 52);
  const leftCard = useSpringEntrance(frame, 60);
  const rightCard = useSpringEntrance(frame, 68);
  const insightCard = useSpringEntrance(frame, 78);

  const arrowLen = 250;
  const arrowDash = usePathDraw(frame, 32, arrowLen, 25);
  const checkLen = 80;
  const checkDash = usePathDraw(frame, 40, checkLen, 15);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="UPCASTING · AUTOMATIC" y={160} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            No Cast Needed
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={385} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Java Permits Automatically
          </text>
        </g>

        {/* Code example — large */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={200} accent />
          <rect x={60} y={460} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={530} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={34} fontWeight={500} fill={COLORS.accent}>
            Train t = new ExpressTrain();
          </text>
          <text x={100} y={580} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            No (Train) cast required — compiler accepts this directly
          </text>
          <text x={100} y={625} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted} opacity={0.6}>
            Child → Parent assignment is always safe
          </text>
        </g>

        {/* Hierarchy arrow */}
        <g opacity={arrowEnt.opacity}>
          <path d="M 300,700 L 300,830" fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={320} y={770} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            IS-A
          </text>
        </g>

        {/* ExpressTrain box */}
        <g opacity={checkCard.opacity} transform={`translate(0, ${checkCard.translateY})`}>
          <BentoCard x={140} y={850} w={320} h={120} accent />
          <text x={300} y={920} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>
        </g>

        {/* Train box */}
        <g opacity={arrowEnt.opacity} transform={`translate(0, ${arrowEnt.translateY * 0.5})`}>
          <rect x={180} y={680} width={240} height={80} rx={16}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
          <text x={300} y={730} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Train
          </text>
        </g>

        {/* Green checkmark */}
        <g opacity={noCastBadge.opacity} transform={`translate(540, ${890 + breathe})`}>
          <circle cx={0} cy={0} r={50} fill="#22C55E" fillOpacity={0.1} />
          <circle cx={0} cy={0} r={50} fill="none" stroke="#22C55E" strokeWidth={2.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <path d="M -20,0 L -6,16 L 22,-14" fill="none" stroke="#22C55E" strokeWidth={5}
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={checkLen} strokeDashoffset={checkDash} />
          <text x={0} y={75} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill="#22C55E">
            SAFE
          </text>
        </g>

        {/* No-cast badge */}
        <g opacity={noCastBadge.opacity} transform={`translate(0, ${noCastBadge.translateY})`}>
          <rect x={680} y={860} width={300} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={830} y={905} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            NO CAST
          </text>
          <text x={830} y={940} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            REQUIRED
          </text>
        </g>

        {/* Compiler perspective */}
        <g opacity={compCard.opacity} transform={`translate(0, ${compCard.translateY})`}>
          <BentoCard x={60} y={1020} w={960} h={120} />
          <text x={100} y={1070} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Compiler logic:
          </text>
          <text x={100} y={1110} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            "ExpressTrain IS-A Train — assignment is safe"
          </text>
        </g>

        {/* Comparison: upcast vs downcast */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={1190} w={460} h={240} accent />
          <text x={290} y={1240} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            UPCASTING
          </text>
          <line x1={80} y1={1260} x2={500} y2={1260} stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          <text x={100} y={1300} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.white}>
            Child → Parent
          </text>
          <text x={100} y={1340} fontFamily={FONT} fontSize={26} fontWeight={800} fill="#22C55E">
            Automatic (implicit)
          </text>
          <text x={100} y={1380} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Always safe — no data loss
          </text>
        </g>

        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={560} y={1190} w={460} h={240} />
          <text x={790} y={1240} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            DOWNCASTING
          </text>
          <line x1={580} y1={1260} x2={1000} y2={1260} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={600} y={1300} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted} opacity={0.6}>
            Parent → Child
          </text>
          <text x={600} y={1340} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.vibrant_red} opacity={0.5}>
            Must cast explicitly
          </text>
          <text x={600} y={1380} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted} opacity={0.4}>
            Can fail at runtime
          </text>
        </g>

        {/* Bottom insight */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1480} w={960} h={120} accent />
          <rect x={60} y={1480} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1535} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Java trusts the IS-A relationship —
          </text>
          <text x={100} y={1575} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            upcasting is always implicit and safe
          </text>
        </g>

        {/* Floating accent */}
        <g transform={`translate(970, ${1650 + breathe})`} opacity={shimmer * 0.3}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} fillOpacity={0.06} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
