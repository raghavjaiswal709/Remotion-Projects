/**
 * Scene 15 — Upcasting Makes Generic Processing Possible
 * "Upcasting makes this kind of generic processing possible."
 * CSV: 51.060s → 53.600s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–80): Flow diagram: subtypes → upcast → generic processor
 *   Phase 3 (70–end): Glow, pulse
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene15_UpcastingGenericProcessing: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 10);

  // Flow: 3 subtype boxes → funnel arrow → Train → processor
  const subtypeNames = ['ExpressTrain', 'MetroTrain', 'FreightTrain'];
  const subtypeColors = [COLORS.accent, '#22C55E', '#A855F7'];
  const subtypeEnts = subtypeNames.map((_, i) => useSpringEntrance(frame, 16 + i * 8));

  // Funnel arrows
  const funnelLen = 100;
  const funnelDashes = subtypeNames.map((_, i) => usePathDraw(frame, 24 + i * 8, funnelLen, 20));

  // Central "Upcast" badge
  const upcastEnt = useSpringEntrance(frame, 38);

  // Train box
  const trainEnt = useSpringEntrance(frame, 44);
  const trainBorderLen = 2 * (300 + 80);
  const trainBorderDash = usePathDraw(frame, 44, trainBorderLen, 25);

  // Processor arrow + box
  const procArrowLen = 80;
  const procArrowDash = usePathDraw(frame, 52, procArrowLen, 18);
  const procEnt = useSpringEntrance(frame, 54);

  // Result card
  const resultEnt = useSpringEntrance(frame, 62);

  // Insight
  const insightEnt = useSpringEntrance(frame, 70);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="UPCASTING · PURPOSE" y={130} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Upcasting Makes
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            Generic Processing Possible
          </text>
        </g>

        {/* Subtype boxes — left column */}
        {subtypeNames.map((name, i) => {
          const ent = subtypeEnts[i];
          const y = 520 + i * 100;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <rect x={60} y={y} width={240} height={70} rx={14}
                fill={COLORS.bg_secondary} stroke={subtypeColors[i]} strokeWidth={2} />
              <circle cx={90} cy={y + 35} r={12} fill={subtypeColors[i]} fillOpacity={0.2} />
              <circle cx={90} cy={y + 35} r={6} fill={subtypeColors[i]} />
              <text x={115} y={y + 44} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.white}>
                {name.replace('Train', '')}
              </text>
              {/* Funnel arrow */}
              <line x1={300} y1={y + 35} x2={420} y2={680}
                stroke={subtypeColors[i]} strokeWidth={2} opacity={0.4}
                strokeDasharray={funnelLen} strokeDashoffset={funnelDashes[i]}
                markerEnd="url(#arrow)" />
            </g>
          );
        })}

        {/* Upcast badge — center */}
        <g opacity={upcastEnt.opacity} transform={`translate(460, ${660 + upcastEnt.translateY})`}>
          <rect x={-60} y={-18} width={120} height={36} rx={18}
            fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={0} y={8} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
            UPCAST
          </text>
        </g>

        {/* Central Train box */}
        <g opacity={trainEnt.opacity} transform={`translate(0, ${trainEnt.translateY})`}>
          <rect x={520} y={620} width={300} height={80} rx={16}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={trainBorderLen} strokeDashoffset={trainBorderDash} />
          <text x={670} y={670} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            Train
          </text>
        </g>

        {/* Processing arrow */}
        <line x1={820} y1={660} x2={900} y2={660}
          stroke={COLORS.accent} strokeWidth={2.5} opacity={procEnt.opacity}
          strokeDasharray={procArrowLen} strokeDashoffset={procArrowDash}
          markerEnd="url(#arrow)" />

        {/* Processor box */}
        <g opacity={procEnt.opacity} transform={`translate(0, ${procEnt.translateY})`}>
          <rect x={900} y={620} width={120} height={80} rx={14}
            fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={2} />
          <text x={960} y={655} textAnchor="middle" fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
            process()
          </text>
          {/* Gear icon */}
          <circle cx={960} cy={680} r={12} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={960} cy={680} r={4} fill={COLORS.accent} />
        </g>

        {/* Result card — what this enables */}
        <g opacity={resultEnt.opacity} transform={`translate(0, ${resultEnt.translateY})`}>
          <BentoCard x={60} y={790} w={960} h={320} accent />
          <text x={100} y={850} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
            WHAT THIS ENABLES
          </text>
          <line x1={80} y1={870} x2={1000} y2={870} stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />

          {/* Benefit list */}
          {[
            'Single method handles ALL train subtypes',
            'No type-checking branches required',
            'New subtypes work automatically',
            'Code stays open for extension',
          ].map((benefit, i) => (
            <g key={i}>
              <circle cx={110} cy={910 + i * 50} r={6} fill={COLORS.accent} fillOpacity={0.4} />
              <text x={130} y={918 + i * 50} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
                {benefit}
              </text>
            </g>
          ))}
        </g>

        {/* Insight */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1170} w={960} h={120} />
          <rect x={60} y={1170} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1225} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Upcasting is the bridge to polymorphic design
          </text>
          <text x={100} y={1265} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            Write code against the parent — subtypes just work
          </text>
        </g>

        {/* Rails */}
        <g opacity={insightEnt.opacity * 0.15}>
          <line x1={60} y1={1380} x2={1020} y2={1380} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={60} y1={1390} x2={1020} y2={1390} stroke={COLORS.text_muted} strokeWidth={1} />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={80 + i * 60} y={1376} width={28} height={4} rx={1} fill={COLORS.text_muted} opacity={0.12} />
          ))}
        </g>

        {/* Floating */}
        <g transform={`translate(540, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.15} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
