/**
 * Scene 17 — Browser Tool
 * "A browser tool gives it access to any website on Earth."
 * CSV: 72.680s → 76.220s
 * Duration: 124 frames (4.1s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + "Browser Tool" headline spring
 *   Phase 2 (frames 18–70):  Browser window with tab bar, URL bar, globe, website cards
 *   Phase 3 (frames 60–end): Globe rotation, connection lines pulse, scan shimmer
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene17_BrowserTool: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headlineEnt = useSpringEntrance(frame, 4);
  const subEnt = useSpringEntrance(frame, 10);

  // ── Phase 2: Browser window ────────────────────────────────────────────────
  const browserCard = useSpringEntrance(frame, 16);
  const browserPerim = 2 * (960 + 620);
  const browserBorder = usePathDraw(frame, 18, browserPerim, 25);

  // Tab bar animation
  const tabReveal = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // URL bar typing
  const urlText = "https://www.example.com/data";
  const charsVisible = Math.floor(
    interpolate(frame, [25, 50], [0, urlText.length], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );
  const displayUrl = urlText.slice(0, charsVisible);

  // Globe animation
  const globeEnt = useSpringEntrance(frame, 30);
  const globeRotation = frame * 0.4;

  // Connection lines from globe to website sections
  const lineLen1 = 180;
  const lineLen2 = 160;
  const lineLen3 = 200;
  const lineOff1 = usePathDraw(frame, 40, lineLen1, 16);
  const lineOff2 = usePathDraw(frame, 46, lineLen2, 16);
  const lineOff3 = usePathDraw(frame, 52, lineLen3, 16);

  // Website content cards
  const webCard1 = useSpringEntrance(frame, 45);
  const webCard2 = useSpringEntrance(frame, 55);
  const webCard3 = useSpringEntrance(frame, 65);

  // Hero card
  const heroCard = useSpringEntrance(frame, 72);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const scanY = interpolate(frame % 60, [0, 60], [0, 580], { extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="TOOL EXAMPLE 3" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEnt.translateY})`} opacity={headlineEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Browser
          </text>
          <text x={500} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent}>
            Tool
          </text>
        </g>

        <g transform={`translate(0, ${subEnt.translateY})`} opacity={subEnt.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Access any website on Earth
          </text>
        </g>

        {/* ── ZONE C — Browser window ──────────────────────────────────────── */}
        <g opacity={browserCard.opacity} transform={`translate(0, ${browserCard.translateY})`}>
          {/* Animated border */}
          <rect x={60} y={440} width={960} height={620} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={browserPerim} strokeDashoffset={browserBorder} />
          {/* Background */}
          <rect x={60} y={440} width={960} height={620} rx={20}
            fill={COLORS.bg_secondary} />

          {/* Tab bar */}
          <g opacity={tabReveal}>
            <rect x={60} y={440} width={960} height={50} rx={20}
              fill="rgba(255,255,255,0.03)" />
            {/* Active tab */}
            <rect x={70} y={448} width={160} height={34} rx={8}
              fill={COLORS.accent} fillOpacity={0.12} />
            <text x={100} y={472} fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.accent}>
              DATA PAGE
            </text>
            {/* Inactive tab */}
            <rect x={240} y={448} width={100} height={34} rx={8}
              fill="rgba(255,255,255,0.03)" />
            <text x={260} y={472} fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.text_muted} opacity={0.4}>
              TAB 2
            </text>
            {/* Close dots */}
            <circle cx={982} cy={465} r={6} fill={COLORS.vibrant_red} opacity={0.5} />
            <circle cx={964} cy={465} r={6} fill="#FFBD2E" opacity={0.5} />
            <circle cx={946} cy={465} r={6} fill="#27C93F" opacity={0.5} />
          </g>

          {/* URL bar */}
          <rect x={80} y={500} width={920} height={40} rx={8}
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          {/* Lock icon */}
          <rect x={92} y={512} width={10} height={8} rx={2} fill={COLORS.accent} opacity={0.5} />
          <path d="M 94,512 L 94,508 A 3,3 0 0 1 100,508 L 100,512"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          {/* URL text */}
          <text x={116} y={527} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={22} fontWeight={500} fill={COLORS.text_muted}>
            {displayUrl}
          </text>
          {/* Blinking cursor */}
          {Math.floor(frame / 15) % 2 === 0 && charsVisible < urlText.length && (
            <rect x={116 + charsVisible * 13} y={509} width={2} height={24}
              fill={COLORS.accent} opacity={0.7} />
          )}

          {/* Globe illustration — center of browser body */}
          <g transform={`translate(300, 720)`} opacity={globeEnt.opacity}>
            {/* Globe circle */}
            <circle cx={0} cy={0} r={80}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '0px 0px' }} />
            {/* Equator */}
            <ellipse cx={0} cy={0} rx={80} ry={20}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4} />
            {/* Meridians (rotating) */}
            <ellipse cx={0} cy={0} rx={30} ry={80}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3}
              transform={`rotate(${globeRotation})`}
              style={{ transformOrigin: '0px 0px' }} />
            <ellipse cx={0} cy={0} rx={56} ry={80}
              fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.2}
              transform={`rotate(${-globeRotation * 0.5})`}
              style={{ transformOrigin: '0px 0px' }} />
            {/* Latitude lines */}
            <ellipse cx={0} cy={-40} rx={70} ry={14}
              fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
            <ellipse cx={0} cy={40} rx={70} ry={14}
              fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
            {/* Inner glow */}
            <circle cx={0} cy={0} r={72}
              fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          </g>

          {/* Connection lines from globe to web content */}
          <line x1={380} y1={680} x2={560} y2={600}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={lineLen1} strokeDashoffset={lineOff1}
            markerEnd="url(#arrow)" />
          <line x1={380} y1={720} x2={560} y2={740}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={lineLen2} strokeDashoffset={lineOff2}
            markerEnd="url(#arrow)" />
          <line x1={380} y1={760} x2={560} y2={880}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={lineLen3} strokeDashoffset={lineOff3}
            markerEnd="url(#arrow)" />

          {/* Website content cards inside browser */}
          <g opacity={webCard1.opacity} transform={`translate(0, ${webCard1.translateY * 0.3})`}>
            <rect x={560} y={570} width={380} height={80} rx={10}
              fill="rgba(255,255,255,0.04)" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.7} />
            <rect x={570} y={578} width={60} height={60} rx={6}
              fill={COLORS.accent} fillOpacity={0.08} />
            <text x={572} y={616} fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.accent} opacity={0.5}>
              H1
            </text>
            <text x={644} y={600} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
              Page Title
            </text>
            <rect x={644} y={614} width={200} height={6} rx={3}
              fill={COLORS.text_muted} opacity={0.2} />
          </g>

          <g opacity={webCard2.opacity} transform={`translate(0, ${webCard2.translateY * 0.3})`}>
            <rect x={560} y={670} width={380} height={100} rx={10}
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
            {/* Paragraph lines */}
            <rect x={580} y={690} width={340} height={6} rx={3} fill={COLORS.text_muted} opacity={0.2} />
            <rect x={580} y={708} width={300} height={6} rx={3} fill={COLORS.text_muted} opacity={0.15} />
            <rect x={580} y={726} width={320} height={6} rx={3} fill={COLORS.text_muted} opacity={0.2} />
            <rect x={580} y={744} width={240} height={6} rx={3} fill={COLORS.text_muted} opacity={0.15} />
          </g>

          <g opacity={webCard3.opacity} transform={`translate(0, ${webCard3.translateY * 0.3})`}>
            <rect x={560} y={790} width={380} height={80} rx={10}
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
            {/* Image placeholder */}
            <rect x={580} y={800} width={160} height={56} rx={6}
              fill={COLORS.accent} fillOpacity={0.06} />
            {/* Mountain icon */}
            <polygon points="620,842 640,810 660,842" fill={COLORS.accent} opacity={0.15} />
            <circle cx={672} cy={816} r={6} fill={COLORS.accent} opacity={0.15} />
            <rect x={760} y={814} width={160} height={6} rx={3} fill={COLORS.text_muted} opacity={0.2} />
            <rect x={760} y={832} width={120} height={6} rx={3} fill={COLORS.text_muted} opacity={0.15} />
          </g>

          {/* Scan line */}
          <rect x={80} y={560 + scanY * shimmer}
            width={920} height={2}
            fill={COLORS.accent} opacity={0.06} />
        </g>

        {/* ── Hero card — below browser ───────────────────────────────────── */}
        <g opacity={heroCard.opacity} transform={`translate(0, ${heroCard.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={140} accent />
          {/* Globe mini icon */}
          <circle cx={120} cy={1170} r={28} fill="none" stroke={COLORS.accent}
            strokeWidth={2} opacity={0.3} />
          <ellipse cx={120} cy={1170} rx={28} ry={8} fill="none"
            stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
          <ellipse cx={120} cy={1170} rx={10} ry={28} fill="none"
            stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />

          <text x={170} y={1160} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            ANY WEBSITE
          </text>
          <text x={545} y={1160} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            ON EARTH
          </text>
          <text x={170} y={1205} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Read, scrape, navigate — live web access
          </text>
        </g>

        {/* ── Bottom detail cards ──────────────────────────────────────────── */}
        <g opacity={heroCard.opacity * 0.85}>
          <BentoCard x={60} y={1280} w={460} h={110} />
          <text x={100} y={1340} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Dynamic content
          </text>
          <text x={100} y={1372} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            JavaScript-rendered pages
          </text>
        </g>

        <g opacity={heroCard.opacity * 0.85}>
          <BentoCard x={560} y={1280} w={460} h={110} accent />
          <text x={600} y={1340} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Unlimited reach
          </text>
          <text x={600} y={1372} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Billions of data sources
          </text>
        </g>

        {/* Floating particle */}
        <circle cx={540} cy={1480 + breathe} r={3} fill={COLORS.accent} opacity={0.05} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s17.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
