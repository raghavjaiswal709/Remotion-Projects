/**
 * Scene 09 — Act
 * "It calls a tool or produces an output. That is act."
 * Green theme (#22C55E), hammer/tool icon, code execution visual,
 * API call visualization, tool invocation animation.
 * Duration: 126 frames (4.2s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,

} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const GREEN = '#22C55E';
const GREEN_DEEP = '#15803D';
const GREEN_LIGHT = '#86EFAC';

// ── Tool cards ─────────────────────────────────────────────────────────────
const TOOLS = [
  { label: 'search()', icon: '🔍', desc: 'Web Search API', x: 180, y: 520 },
  { label: 'execute()', icon: '⚡', desc: 'Code Runner', x: 540, y: 450 },
  { label: 'write()', icon: '📝', desc: 'File System', x: 900, y: 520 },
  { label: 'query()', icon: '🗄️', desc: 'Database', x: 340, y: 680 },
  { label: 'send()', icon: '📡', desc: 'HTTP Client', x: 740, y: 680 },
];

// ── Code lines for the code execution visual ───────────────────────────────
const CODE_LINES = [
  { text: 'async function executeAction() {', indent: 0, color: GREEN },
  { text: '  const tool = selectTool(plan);', indent: 1, color: '#9CA3AF' },
  { text: '  const params = buildParams(context);', indent: 1, color: '#9CA3AF' },
  { text: '  const result = await tool.run(params);', indent: 1, color: GREEN_LIGHT },
  { text: '  return formatOutput(result);', indent: 1, color: '#9CA3AF' },
  { text: '}', indent: 0, color: GREEN },
];

// ── API call visualization steps ───────────────────────────────────────────
const API_STEPS = [
  { label: 'SELECT', x: 180, progress: 0 },
  { label: 'INVOKE', x: 420, progress: 1 },
  { label: 'EXECUTE', x: 660, progress: 2 },
  { label: 'RETURN', x: 900, progress: 3 },
];

// ── Hammer/tool SVG parts ──────────────────────────────────────────────────
const SPARK_POSITIONS = Array.from({ length: 8 }, (_, i) => ({
  angle: (i / 8) * Math.PI * 2,
  dist: 30 + (i % 3) * 12,
  size: 2 + (i % 2) * 1.5,
  delay: i * 3,
}));

// ── Background particles ───────────────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  x: (i * 151.3 + 45) % 1080,
  y: (i * 219.7 + 70) % 1920,
  r: 1 + (i % 3) * 0.7,
  speed: 0.12 + (i % 5) * 0.06,
  phase: i * 0.65,
}));

// ── Output data blocks ─────────────────────────────────────────────────────
const OUTPUT_BLOCKS = [
  { text: '{ "status": "200" }', x: 260, y: 1090 },
  { text: '{ "data": [...] }', x: 580, y: 1050 },
  { text: '{ "result": "ok" }', x: 820, y: 1090 },
];

// ── Circuit traces ─────────────────────────────────────────────────────────
const CIRCUITS = Array.from({ length: 10 }, (_, i) => ({
  x: 80 + (i * 107) % 920,
  y: 350 + (i * 83) % 500,
  len: 40 + (i % 4) * 25,
  vertical: i % 3 === 0,
}));

export const Scene09_Act: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const globalEnter = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [3, 24], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [3, 24], [40, 0], { extrapolateRight: 'clamp', easing: ease });
  const hammerEnter = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const hammerScale = scaleAnim(frame, 10, 25, 0.3, 1);
  const toolsEnter = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const codeEnter = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const apiEnter = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const outputEnter = interpolate(frame, [70, 95], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const bottomEnter = interpolate(frame, [80, 105], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Hammer swing
  const hammerSwing = interpolate(frame, [12, 22, 28, 32], [15, -25, 5, 0], { extrapolateRight: 'clamp' });
  const sparkFlash = interpolate(frame, [26, 30, 35], [0, 1, 0], { extrapolateRight: 'clamp' });

  // API pipeline progress
  const pipelineProgress = interpolate(frame, [55, 100], [0, 3.5], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs />
          <CornerBrackets opacity={0.2} />

          {/* ── Extra defs ── */}
          <defs>
            <filter id="greenGlow09" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feFlood floodColor={GREEN} floodOpacity="0.45" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="sparkGlow09" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor={GREEN_LIGHT} floodOpacity="0.7" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="toolGrad09" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity="0.12" />
              <stop offset="100%" stopColor={GREEN} stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="pipeGrad09" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={GREEN} stopOpacity="0.8" />
              <stop offset="100%" stopColor={GREEN_LIGHT} stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="codeGrad09" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1A2E" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0D0D1A" stopOpacity="0.98" />
            </linearGradient>
          </defs>

          {/* ── Background particles ── */}
          {BG_PARTICLES.map((p, i) => {
            const yOff = (frame * p.speed + p.phase * 45) % 1920;
            return (
              <circle key={i} cx={p.x} cy={(p.y + yOff) % 1920} r={p.r}
                fill={GREEN}
                opacity={globalEnter * (0.05 + Math.sin(frame * 0.035 + p.phase) * 0.025)} />
            );
          })}

          {/* ── Circuit traces ── */}
          {CIRCUITS.map((c, i) => {
            const drawLen = interpolate(frame, [i * 3, i * 3 + 18], [0, c.len], { extrapolateRight: 'clamp' });
            return (
              <line key={i}
                x1={c.x} y1={c.y}
                x2={c.vertical ? c.x : c.x + drawLen}
                y2={c.vertical ? c.y + drawLen : c.y}
                stroke={GREEN} strokeWidth={1} opacity={globalEnter * 0.07}
                strokeLinecap="round" />
            );
          })}

          {/* ── Section label ── */}
          <g opacity={globalEnter}>
            <rect x={80} y={60} width={160} height={52} rx={12}
              fill={GREEN} opacity={0.9} />
            <text x={160} y={94} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={900}
              fill="white" letterSpacing="0.10em">ACT</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={200} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={54} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              Execute & Produce
            </text>
            <text x={540} y={255} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600}
              fill={GREEN} opacity={0.8}>
              Step 3: Act
            </text>
          </g>

          {/* ── Divider ── */}
          <line x1={200} y1={300} x2={880} y2={300}
            stroke={GREEN} strokeWidth={1.5} opacity={titleEnter * 0.2} />

          {/* ── Hammer / wrench icon (center-top) ── */}
          <g opacity={hammerEnter}
            transform={`translate(540, 380) scale(${hammerScale}) rotate(${hammerSwing})`}>
            {/* Hammer head */}
            <rect x={-35} y={-50} width={70} height={35} rx={6}
              fill={GREEN} stroke={GREEN_DEEP} strokeWidth={2} />
            <rect x={-28} y={-45} width={22} height={25} rx={3}
              fill={GREEN_LIGHT} opacity={0.4} />
            {/* Handle */}
            <rect x={-6} y={-15} width={12} height={60} rx={4}
              fill="#8B6914" stroke="#6B4F10" strokeWidth={1.5} />
            {/* Handle grip lines */}
            {[0, 1, 2].map(i => (
              <line key={i} x1={-4} y1={15 + i * 12} x2={4} y2={15 + i * 12}
                stroke="#5A3E0A" strokeWidth={1} opacity={0.5} />
            ))}
          </g>

          {/* ── Impact sparks ── */}
          {SPARK_POSITIONS.map((sp, i) => {
            const spOp = interpolate(frame, [26 + sp.delay * 0.3, 32 + sp.delay * 0.3], [0, 1], { extrapolateRight: 'clamp' });
            const spFade = interpolate(frame, [32 + sp.delay * 0.3, 40 + sp.delay * 0.3], [1, 0], { extrapolateRight: 'clamp' });
            const dist = sp.dist * (1 + sparkFlash * 0.5);
            return (
              <circle key={i}
                cx={540 + Math.cos(sp.angle) * dist}
                cy={380 + Math.sin(sp.angle) * dist}
                r={sp.size} fill={GREEN_LIGHT}
                opacity={spOp * spFade * sparkFlash}
                filter="url(#sparkGlow09)" />
            );
          })}

          {/* ── Tool cards ── */}
          {TOOLS.map((tool, i) => {
            const tOp = interpolate(frame, [22 + i * 6, 38 + i * 6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const tSlide = interpolate(frame, [22 + i * 6, 38 + i * 6], [25, 0], { extrapolateRight: 'clamp', easing: ease });
            const isActive = Math.floor(frame * 0.15) % TOOLS.length === i;
            return (
              <g key={i} opacity={tOp * toolsEnter}
                transform={`translate(${tool.x}, ${tool.y + tSlide})`}>
                {/* Card bg */}
                <rect x={-90} y={-45} width={180} height={90} rx={14}
                  fill="#F9FAFB" stroke={isActive ? GREEN : GREEN_LIGHT}
                  strokeWidth={isActive ? 3 : 1.5}
                  filter="url(#shadow)" />
                {isActive && (
                  <rect x={-90} y={-45} width={180} height={90} rx={14}
                    fill={GREEN} opacity={0.06} />
                )}
                {/* Color top bar */}
                <rect x={-90} y={-45} width={180} height={6} rx={3}
                  fill={GREEN} opacity={isActive ? 1 : 0.5} />
                {/* Icon */}
                <text x={-50} y={5} fontSize={28} textAnchor="middle">{tool.icon}</text>
                {/* Label */}
                <text x={20} y={-8} textAnchor="middle"
                  fontFamily="'Courier New', monospace" fontSize={16} fontWeight={700}
                  fill={GREEN}>
                  {tool.label}
                </text>
                {/* Description */}
                <text x={20} y={18} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={13} fontWeight={500}
                  fill={COLORS.light_gray}>
                  {tool.desc}
                </text>
                {/* Active indicator */}
                {isActive && (
                  <circle cx={70} cy={-30} r={5} fill={GREEN} opacity={0.8}
                    filter="url(#greenGlow09)" />
                )}
              </g>
            );
          })}

          {/* ── API pipeline ── */}
          <g opacity={apiEnter}>
            {/* Pipeline line */}
            <line x1={140} y1={830} x2={940} y2={830}
              stroke={GREEN} strokeWidth={3} opacity={0.15} />
            <line x1={140} y1={830}
              x2={140 + (800 * Math.min(pipelineProgress / 3, 1))}
              y2={830}
              stroke={GREEN} strokeWidth={3} opacity={0.6}
              strokeLinecap="round" />

            {/* Steps */}
            {API_STEPS.map((step, i) => {
              const active = pipelineProgress >= step.progress;
              const stepScale = active ? 1 : 0.8;
              return (
                <g key={i} transform={`translate(${step.x}, 830) scale(${stepScale})`}>
                  <circle cx={0} cy={0} r={22}
                    fill={active ? GREEN : '#F5F0E8'}
                    stroke={GREEN} strokeWidth={2.5}
                    filter={active ? 'url(#greenGlow09)' : undefined} />
                  <text x={0} y={5} textAnchor="middle"
                    fontFamily="'Inter', sans-serif" fontSize={12} fontWeight={900}
                    fill={active ? 'white' : GREEN}>
                    {i + 1}
                  </text>
                  <text x={0} y={50} textAnchor="middle"
                    fontFamily="'Inter', sans-serif" fontSize={15} fontWeight={700}
                    fill={active ? GREEN : COLORS.light_gray}
                    letterSpacing="0.06em">
                    {step.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── Code execution panel ── */}
          <g opacity={codeEnter}>
            <rect x={140} y={920} width={800} height={220} rx={16}
              fill="url(#codeGrad09)" filter="url(#shadow)" />
            {/* Terminal header */}
            <rect x={140} y={920} width={800} height={36} rx={16}
              fill="#2A2A3E" />
            <circle cx={170} cy={938} r={6} fill="#EF4444" opacity={0.8} />
            <circle cx={192} cy={938} r={6} fill="#F59E0B" opacity={0.8} />
            <circle cx={214} cy={938} r={6} fill="#22C55E" opacity={0.8} />
            <text x={540} y={942} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={12} fontWeight={600}
              fill="#6B7280">tool_executor.ts</text>

            {/* Code lines */}
            {CODE_LINES.map((line, i) => {
              const lineOp = interpolate(frame, [44 + i * 4, 52 + i * 4], [0, 1], { extrapolateRight: 'clamp' });
              const isHighlight = i === 3;
              return (
                <g key={i} opacity={lineOp}>
                  {isHighlight && (
                    <rect x={145} y={960 + i * 28} width={790} height={26} rx={2}
                      fill={GREEN} opacity={0.08} />
                  )}
                  {/* Line number */}
                  <text x={175} y={980 + i * 28} textAnchor="end"
                    fontFamily="'Courier New', monospace" fontSize={13}
                    fill="#4B5563" opacity={0.5}>
                    {i + 1}
                  </text>
                  {/* Code text */}
                  <text x={195 + line.indent * 16} y={980 + i * 28} textAnchor="start"
                    fontFamily="'Courier New', monospace" fontSize={14} fontWeight={600}
                    fill={line.color}>
                    {line.text}
                  </text>
                </g>
              );
            })}

            {/* Cursor blink */}
            {frame % 30 < 15 && (
              <rect x={195 + CODE_LINES[Math.min(Math.floor(frame * 0.06), CODE_LINES.length - 1)].text.length * 8.4}
                y={963 + Math.min(Math.floor(frame * 0.06), CODE_LINES.length - 1) * 28}
                width={2} height={18} fill={GREEN} opacity={codeEnter * 0.8} />
            )}
          </g>

          {/* ── Output blocks ── */}
          {OUTPUT_BLOCKS.map((ob, i) => {
            const obOp = interpolate(frame, [75 + i * 6, 90 + i * 6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const obSlide = interpolate(frame, [75 + i * 6, 90 + i * 6], [15, 0], { extrapolateRight: 'clamp', easing: ease });
            return (
              <g key={i} opacity={obOp * outputEnter}>
                <rect x={ob.x - 10} y={ob.y - 4 + obSlide + 100} width={ob.text.length * 9 + 20} height={30} rx={8}
                  fill={GREEN} opacity={0.08} stroke={GREEN} strokeWidth={1} />
                <text x={ob.x} y={ob.y + 16 + obSlide + 100} textAnchor="start"
                  fontFamily="'Courier New', monospace" fontSize={14} fontWeight={600}
                  fill={GREEN} opacity={0.8}>
                  {ob.text}
                </text>
              </g>
            );
          })}

          {/* ── Bottom insight box ── */}
          <g opacity={bottomEnter}>
            <rect x={120} y={1330} width={840} height={150} rx={18}
              fill="#F9FAFB" stroke={GREEN} strokeWidth={1.5}
              filter="url(#shadow)" opacity={0.9} />
            <rect x={120} y={1330} width={6} height={150} rx={3} fill={GREEN} />
            <text x={170} y={1378} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={COLORS.deep_black}>
              It calls a tool or produces an output.
            </text>
            <text x={170} y={1418} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={GREEN}>
              That is act.
            </text>
            <text x={170} y={1455} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={17} fontWeight={500}
              fill={COLORS.light_gray}>
              Tool calls · API requests · Code execution · Output generation
            </text>
          </g>

          {/* ── Decorative bottom lines ── */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={i}
              x1={100 + i * 160} y1={1540}
              x2={140 + i * 160} y2={1540}
              stroke={GREEN} strokeWidth={1.5} opacity={globalEnter * 0.1}
              strokeLinecap="round" />
          ))}
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="It calls a tool or produces an output. That is act."
          opacity={captionEnter}
          highlightWords={['tool', 'output', 'act']} />
      </PaperBackground>
    </AbsoluteFill>
  );
};
