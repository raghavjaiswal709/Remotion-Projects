/**
 * Scene 11 — The instanceof Keyword
 * "This is the instanceof keyword,"
 * CSV: 33.580s → 35.300s | Duration: 71 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline
 *   Phase 2 (15–45): Keyword reveal, bracket decoration, definition
 *   Phase 3 (40–end): Pulse, shimmer
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
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

export const Scene11_InstanceofKeyword: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 5);
  const keywordE = useSpringEntrance(frame, 10);
  const underlineE = useSpringEntrance(frame, 14);
  const card1E = useSpringEntrance(frame, 18);
  const card2E = useSpringEntrance(frame, 24);
  const card3E = useSpringEntrance(frame, 30);
  const bracketE = useSpringEntrance(frame, 12);

  const underlineLen = 500;
  const underlineDash = usePathDraw(frame, 14, underlineLen, 18);

  const bracketLenL = 160;
  const bracketLenR = 160;
  const bracketDashL = usePathDraw(frame, 12, bracketLenL, 15);
  const bracketDashR = usePathDraw(frame, 13, bracketLenR, 15);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  // Typewriter for keyword
  const kwText = "instanceof";
  const charsVisible = Math.floor(interpolate(frame, [10, 10 + kwText.length * 1.5], [0, kwText.length], {
    extrapolateRight: 'clamp',
  }));
  const displayKw = kwText.slice(0, charsVisible);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="JAVA KEYWORD" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            This is the
          </text>
        </g>

        {/* Large keyword with typewriter + brackets */}
        <g opacity={keywordE.opacity} transform={`translate(0, ${keywordE.translateY})`}>
          {/* Ghost */}
          <text x={540} y={520} textAnchor="middle" fontFamily={MONO} fontSize={120} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}>
            instanceof
          </text>
          {/* Main keyword */}
          <text x={540} y={520} textAnchor="middle" fontFamily={MONO} fontSize={110} fontWeight={800}
            fill={COLORS.accent}
            transform={`scale(${pulse})`} style={{ transformOrigin: '540px 520px' }}>
            {displayKw}
          </text>
          {/* Blinking cursor */}
          {charsVisible < kwText.length && (
            <rect x={540 + (charsVisible - kwText.length / 2) * 58} y={440} width={3} height={80}
              fill={COLORS.accent} opacity={Math.sin(frame * 0.3) > 0 ? 1 : 0} />
          )}
        </g>

        {/* Underline */}
        <line x1={270} y1={545} x2={810} y2={545}
          stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={underlineLen} strokeDashoffset={underlineDash}
          opacity={underlineE.opacity} />

        {/* Decorative brackets */}
        <g opacity={bracketE.opacity * 0.3}>
          <path d="M 220,430 L 200,430 L 200,560 L 220,560"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={bracketLenL} strokeDashoffset={bracketDashL} />
          <path d="M 860,430 L 880,430 L 880,560 L 860,560"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={bracketLenR} strokeDashoffset={bracketDashR} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={620} textAnchor="middle" fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.text_muted}>
            keyword
          </text>
        </g>

        {/* Definition card */}
        <g opacity={card1E.opacity} transform={`translate(0, ${card1E.translateY})`}>
          <BentoCard x={60} y={700} w={960} h={180} accent />
          <rect x={60} y={700} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={775} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            A
          </text>
          <text x={140} y={775} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            reserved word
          </text>
          <text x={460} y={775} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            in Java that
          </text>
          <text x={100} y={835} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            performs runtime type checking on objects
          </text>
        </g>

        {/* Feature cards */}
        <g opacity={card2E.opacity} transform={`translate(0, ${card2E.translateY})`}>
          <BentoCard x={60} y={920} w={460} h={200} />
          <text x={100} y={995} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Binary Operator
          </text>
          <text x={100} y={1040} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Left: reference variable
          </text>
          <text x={100} y={1080} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Right: type name
          </text>

          <BentoCard x={560} y={920} w={460} h={200} />
          <text x={600} y={995} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Returns Boolean
          </text>
          <text x={600} y={1040} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            true → safe to cast
          </text>
          <text x={600} y={1080} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            false → skip cast
          </text>
        </g>

        {/* Syntax card */}
        <g opacity={card3E.opacity} transform={`translate(0, ${card3E.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={140} />
          <text x={100} y={1240} fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.text_muted}>
            {'ref'}
          </text>
          <text x={185} y={1240} fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.accent}>
            instanceof
          </text>
          <text x={530} y={1240} fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.text_muted}>
            ClassName
          </text>
          <text x={780} y={1240} fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.accent}>
            → boolean
          </text>
        </g>

        {/* Floating keyword echoes */}
        {[0, 1, 2].map(i => (
          <text key={i} x={200 + i * 300} y={1450 + Math.sin(frame * 0.04 + i) * 4}
            textAnchor="middle" fontFamily={MONO} fontSize={24} fontWeight={800}
            fill={COLORS.accent} opacity={0.06 * shimmer}>
            instanceof
          </text>
        ))}

        {/* Gear icon */}
        <g opacity={card3E.opacity * 0.3} transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={0} cy={0} r={8} fill={COLORS.accent} fillOpacity={0.2} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
            const rad = (a * Math.PI) / 180;
            return (
              <rect key={a} x={-3} y={-26} width={6} height={10} rx={2}
                fill={COLORS.accent} fillOpacity={0.3}
                transform={`rotate(${a}) translate(0, 0)`}
                style={{ transformOrigin: '0px 0px' }} />
            );
          })}
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
