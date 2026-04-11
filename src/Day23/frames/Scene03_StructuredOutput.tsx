/**
 * Scene 03 — Last Time: Structured Output
 * "Last time, we saw structured output."
 * Layout (1080×1920):
 *   RECAP chip         SVG y=60-116
 *   Title              top=140 → ~350
 *   JSON Terminal      top=378 → ~978 (600px hero block)
 *   Stat badges        top=1000 → ~1110
 *   Description        top=1140 → ~1360
 *   Applications       top=1395 → ~1495
 *   Caption            y=1730
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const JSON_LINES = [
  { txt: '{', color: '#C8D0D4', indent: 0, lineNum: 1 },
  { txt: '"intent":', color: '#79C0FF', indent: 1, val: '"book_flight"', valColor: '#FFA657', lineNum: 2 },
  { txt: '"destination":', color: '#79C0FF', indent: 1, val: '"Tokyo"', valColor: '#A5D6FF', lineNum: 3 },
  { txt: '"departure":', color: '#79C0FF', indent: 1, val: '"2024-03-15"', valColor: '#A5D6FF', lineNum: 4 },
  { txt: '"passengers":', color: '#79C0FF', indent: 1, val: '2', valColor: '#F47067', lineNum: 5 },
  { txt: '"class":', color: '#79C0FF', indent: 1, val: '"economy"', valColor: '#A5D6FF', lineNum: 6 },
  { txt: '"confirmed":', color: '#79C0FF', indent: 1, val: 'true', valColor: '#D2A8FF', lineNum: 7 },
  { txt: '}', color: '#C8D0D4', indent: 0, lineNum: 8 },
];

const STAT_BADGES = [
  { label: 'Type-safe', color: COLORS.warm_blue, bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)',
    icon: <svg width={28} height={28} viewBox="0 0 28 28"><rect x={3} y={3} width={22} height={22} rx={4} fill="none" stroke="#3B82F6" strokeWidth={2.5}/><path d="M9,14 L13,18 L19,10" fill="none" stroke="#3B82F6" strokeWidth={2.5} strokeLinecap="round"/></svg> },
  { label: 'Validated', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)',
    icon: <svg width={28} height={28} viewBox="0 0 28 28"><circle cx={14} cy={14} r={10} fill="none" stroke="#22C55E" strokeWidth={2.5}/><path d="M9,14 L13,18 L19,10" fill="none" stroke="#22C55E" strokeWidth={2.5} strokeLinecap="round"/></svg> },
  { label: 'Actionable', color: COLORS.electric_cyan, bg: 'rgba(0,229,255,0.1)', border: 'rgba(0,229,255,0.3)',
    icon: <svg width={28} height={28} viewBox="0 0 28 28"><polygon points="6,4 22,14 6,24" fill="none" stroke="#00E5FF" strokeWidth={2.5} strokeLinejoin="round"/></svg> },
];

export const Scene03_StructuredOutput: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const codeEnter = interpolate(frame, [10, 45], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const badgeEnter = interpolate(frame, [38, 58], [0, 1], { extrapolateRight: 'clamp' });
  const descEnter = interpolate(frame, [48, 68], [0, 1], { extrapolateRight: 'clamp' });
  const blockGlow = 0.6 + Math.sin(frame * 0.14) * 0.4;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>

          {/* Subtle matrix background */}
          {Array.from({ length: 7 }, (_, col) =>
            Array.from({ length: 14 }, (_, row) => (
              <circle key={`${col}-${row}`}
                cx={120 + col * 140} cy={200 + row * 120}
                r={2.5} fill={COLORS.electric_cyan}
                opacity={0.03 + Math.abs(Math.sin(col * 1.3 + row * 0.9)) * 0.02}/>
            ))
          ).flat()}

          {/* RECAP chip background glow */}
          <rect x={76} y={56} width={200} height={60} rx={14}
            fill={COLORS.warm_blue} opacity={enter * 0.25} filter="url(#softGlow)"/>
          {/* RECAP chip */}
          <rect x={80} y={60} width={192} height={52} rx={12}
            fill={COLORS.warm_blue} opacity={enter}/>
          <text x={176} y={95} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={900}
            letterSpacing="0.10em" fill="white" opacity={enter}>RECAP</text>

          {/* Terminal outer glow pulse */}
          <rect x={72} y={372} width={936} height={612} rx={30}
            fill={COLORS.electric_cyan}
            opacity={codeEnter * blockGlow * 0.04}
            filter="url(#strongCyanGlow)"/>
        </svg>

        {/* Title */}
        <div style={{
          position: 'absolute', top: 142, left: 80, right: 80,
          opacity: enter,
        }}>
          <div style={{
            fontSize: 78, fontWeight: 900,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.0, letterSpacing: '-0.04em',
          }}>
            Structured<br/>
            <span style={{ color: COLORS.warm_blue }}>Output</span>
          </div>
          <div style={{
            marginTop: 16, fontSize: 28, fontWeight: 500,
            color: COLORS.light_gray,
            fontFamily: '"Inter", sans-serif',
          }}>
            Forcing completions into machine-readable format
          </div>
        </div>

        {/* JSON Terminal block */}
        <div style={{
          position: 'absolute', top: 380, left: 78, right: 78,
          background: 'linear-gradient(170deg, #0D1117 0%, #090C12 100%)',
          borderRadius: 26,
          border: '2px solid rgba(0,229,255,0.2)',
          boxShadow: '0 28px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,229,255,0.07), inset 0 1px 0 rgba(255,255,255,0.04)',
          overflow: 'hidden',
          opacity: codeEnter,
        }}>
          {/* Terminal title bar */}
          <div style={{
            background: 'linear-gradient(90deg, #161B22 0%, #1C2230 100%)',
            borderBottom: '1.5px solid rgba(255,255,255,0.06)',
            padding: '18px 26px',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['#FF5F57', '#FF3B30'], ['#FFBD2E', '#FF9F0A'], ['#28CA41', '#30D158']].map(([bg, shadow], i) => (
                <div key={i} style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: bg, boxShadow: `0 0 8px ${shadow}70`,
                }}/>
              ))}
            </div>
            <div style={{
              flex: 1, textAlign: 'center',
              fontSize: 22, color: '#768390',
              fontFamily: '"Courier New", monospace',
            }}>
              structured_output.json
            </div>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#22C55E', boxShadow: '0 0 8px #22C55E',
            }}/>
          </div>

          {/* Code area */}
          <div style={{ display: 'flex', padding: '24px 0' }}>
            {/* Line numbers */}
            <div style={{
              width: 62, flexShrink: 0,
              borderRight: '1px solid rgba(255,255,255,0.05)',
              paddingTop: 2,
            }}>
              {JSON_LINES.map((line, i) => (
                <div key={i} style={{
                  fontSize: 28, lineHeight: '1.75', textAlign: 'right',
                  paddingRight: 16, color: '#3D444D',
                  fontFamily: '"Courier New", monospace',
                  opacity: interpolate(frame, [8 + i * 5, 26 + i * 5], [0, 0.7], { extrapolateRight: 'clamp' }),
                }}>
                  {line.lineNum}
                </div>
              ))}
            </div>

            {/* Code lines */}
            <div style={{ flex: 1, paddingLeft: 24, paddingRight: 28 }}>
              {JSON_LINES.map((line, i) => {
                const lineEnter = interpolate(frame, [8 + i * 5, 26 + i * 5], [0, 1], { extrapolateRight: 'clamp' });
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'baseline', gap: 0,
                    paddingLeft: line.indent * 36,
                    lineHeight: 1.75,
                    opacity: lineEnter,
                    transform: `translateX(${interpolate(frame, [8 + i * 5, 26 + i * 5], [-28, 0], { extrapolateRight: 'clamp' })}px)`,
                  }}>
                    <span style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize: 30, color: line.color, fontWeight: 500,
                    }}>
                      {line.txt}
                    </span>
                    {line.val && (
                      <span style={{
                        fontFamily: '"Courier New", monospace',
                        fontSize: 30, color: line.valColor, marginLeft: 10,
                      }}>
                        {line.val}{i < JSON_LINES.length - 2 ? ',' : ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            background: '#0A0E14',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            padding: '11px 26px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            opacity: codeEnter,
          }}>
            <span style={{ fontSize: 20, color: '#57606A', fontFamily: 'monospace' }}>
              JSON • UTF-8 • Ln 8
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }}/>
              <span style={{ fontSize: 20, color: '#22C55E', fontFamily: 'monospace', fontWeight: 700 }}>
                Valid Schema
              </span>
            </div>
          </div>
        </div>

        {/* Stat badges */}
        <div style={{
          position: 'absolute', top: 1002, left: 78, right: 78,
          display: 'flex', gap: 18,
          opacity: badgeEnter,
        }}>
          {STAT_BADGES.map((badge, i) => (
            <div key={i} style={{
              flex: 1,
              background: badge.bg,
              border: `1.5px solid ${badge.border}`,
              borderRadius: 16, padding: '18px 14px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8,
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              opacity: interpolate(frame, [38 + i * 6, 56 + i * 6], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `translateY(${interpolate(frame, [38 + i * 6, 56 + i * 6], [18, 0], { extrapolateRight: 'clamp' })}px)`,
            }}>
              {badge.icon}
              <span style={{
                fontSize: 22, fontWeight: 800, color: badge.color,
                fontFamily: '"Inter", sans-serif',
              }}>
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{
          position: 'absolute', top: 1142, left: 78, right: 78,
          opacity: descEnter,
          background: 'linear-gradient(135deg, rgba(59,130,246,0.09) 0%, rgba(0,229,255,0.05) 100%)',
          border: '2px solid rgba(59,130,246,0.26)',
          borderRadius: 20, padding: '28px 36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}>
          <div style={{
            fontSize: 28, fontWeight: 800, color: COLORS.warm_blue,
            fontFamily: '"Inter", sans-serif', marginBottom: 12,
          }}>
            Why structured output matters
          </div>
          <div style={{
            fontSize: 27, color: COLORS.light_gray,
            fontFamily: '"Inter", sans-serif', lineHeight: 1.65,
          }}>
            Turns unstructured language into data a program can
            <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}> actually execute</span> —
            not just read.
          </div>
        </div>

        {/* Application tags */}
        <div style={{
          position: 'absolute', top: 1398, left: 78, right: 78,
          opacity: interpolate(frame, [55, 72], [0, 1], { extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{
            fontSize: 22, color: COLORS.light_gray, fontWeight: 600,
            fontFamily: '"Inter", sans-serif', marginBottom: 4,
          }}>
            Used in:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['Flight booking', 'API calls', 'Form validation', 'Tool calling', 'Data extraction'].map((tag, i) => (
              <div key={i} style={{
                padding: '8px 18px',
                background: 'rgba(0,229,255,0.06)',
                border: '1px solid rgba(0,229,255,0.2)',
                borderRadius: 30,
                fontSize: 22, color: COLORS.electric_cyan,
                fontFamily: '"Inter", sans-serif',
                opacity: interpolate(frame, [56 + i * 3, 70 + i * 3], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        <CaptionBar text="Last time, we saw structured output." opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
