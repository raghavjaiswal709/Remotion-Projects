/**
 * Scene 09 — Static Block Syntax
 * "Static, parentheses, load stations, routes, fares."
 * CSV: 45.780s → 50.860s | Duration: 152 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–80): Code block with syntax highlight
 *   Phase 3 (70–end): Blink cursor, breathing
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene09_StaticBlockSyntax: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);

  // Code lines staggered
  const codeLines = [
    { text: 'static {', isKey: true },
    { text: '    loadStations();', isKey: false },
    { text: '    loadRoutes();', isKey: false },
    { text: '    loadFares();', isKey: false },
    { text: '}', isKey: true },
  ];
  const lineEntrances = codeLines.map((_, i) => useSpringEntrance(frame, 24 + i * 10));

  // Arrow annotations
  const annE1 = useSpringEntrance(frame, 70);
  const annE2 = useSpringEntrance(frame, 80);

  // Bottom explanation
  const cardE = useSpringEntrance(frame, 88);

  // Phase 3 — cursor blink
  const cursorVisible = Math.sin(frame * 0.2) > 0 ? 1 : 0;
  const breathe = Math.sin(frame * 0.06) * 4;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="SYNTAX" y={140} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Static Block
          </text>
          <text x={60} y={370} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            Java Syntax
          </text>
        </g>

        {/* Code block card */}
        <BentoCard x={60} y={440} w={960} h={460} accent opacity={lineEntrances[0].opacity} />
        <rect x={60} y={440} width={6} height={460} rx={3} fill={COLORS.accent}
          opacity={lineEntrances[0].opacity} />

        {/* Line numbers + code */}
        {codeLines.map((line, i) => (
          <g key={i} opacity={lineEntrances[i].opacity} transform={`translate(0, ${lineEntrances[i].translateY})`}>
            <text x={100} y={510 + i * 72} fontFamily={MONO} fontSize={28} fontWeight={500}
              fill={COLORS.text_muted} opacity={0.4}>{i + 1}</text>
            <text x={160} y={510 + i * 72} fontFamily={MONO} fontSize={36} fontWeight={600}
              fill={line.isKey ? COLORS.accent : COLORS.white}>{line.text}</text>
          </g>
        ))}

        {/* Blinking cursor */}
        <rect x={330} y={856} width={20} height={36} rx={2} fill={COLORS.accent}
          opacity={cursorVisible * lineEntrances[4].opacity * 0.7} />

        {/* Annotations */}
        <g opacity={annE1.opacity} transform={`translate(0, ${annE1.translateY})`}>
          <line x1={700} y1={510} x2={810} y2={510} stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)" />
          <text x={820} y={518} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Keyword
          </text>
        </g>
        <g opacity={annE2.opacity} transform={`translate(0, ${annE2.translateY})`}>
          <line x1={700} y1={650} x2={810} y2={650} stroke={COLORS.accent} strokeWidth={2}
            opacity={0.6} markerEnd="url(#arrow)" />
          <text x={820} y={658} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Init Logic
          </text>
        </g>

        {/* Bottom explanation cards */}
        <g opacity={cardE.opacity} transform={`translate(0, ${cardE.translateY})`}>
          <BentoCard x={60} y={960} w={460} h={180} />
          <text x={100} y={1032} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>static</text>
          <text x={260} y={1032} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>keyword</text>
          <text x={100} y={1076} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Declares class-level block
          </text>
        </g>
        <g opacity={cardE.opacity} transform={`translate(0, ${cardE.translateY})`}>
          <BentoCard x={560} y={960} w={460} h={180} accent />
          <text x={600} y={1032} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>{'{ }'}</text>
          <text x={680} y={1032} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>body</text>
          <text x={600} y={1076} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Contains init statements
          </text>
        </g>

        {/* Full-width summary */}
        <g opacity={cardE.opacity} transform={`translate(0, ${cardE.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={120} />
          <text x={100} y={1254} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Loads stations, routes, fares — all at once
          </text>
        </g>

        {/* Floating */}
        <g transform={`translate(540, ${1440 + breathe})`}>
          <circle r={32} fill={COLORS.accent} fillOpacity={0.05} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
