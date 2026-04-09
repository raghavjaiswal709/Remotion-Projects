/**
 * Scene 03 — Last Time: Structured Output
 * "Last time, we saw structured output."
 * Hero: JSON code block with syntax highlighting, pencil-style bracket drawing animation.
 * Duration: 72 frames (2.4s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const JSON_LINES = [
  { txt: '{', color: '#C8D0D4', indent: 0 },
  { txt: '"intent":', color: '#22C55E', indent: 1, val: '"book_flight"', valColor: '#F59E0B' },
  { txt: '"destination":', color: '#22C55E', indent: 1, val: '"Tokyo"', valColor: '#60A5FA' },
  { txt: '"departure":', color: '#22C55E', indent: 1, val: '"2024-03-15"', valColor: '#60A5FA' },
  { txt: '"passengers":', color: '#22C55E', indent: 1, val: '2', valColor: '#F87171' },
  { txt: '"class":', color: '#22C55E', indent: 1, val: '"economy"', valColor: '#60A5FA' },
  { txt: '"confirmed":', color: '#22C55E', indent: 1, val: 'true', valColor: '#A78BFA' },
  { txt: '}', color: '#C8D0D4', indent: 0 },
];

export const Scene03_StructuredOutput: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>
          {/* Background accent grid */}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1={0} y1={240 + i * 220} x2={1080} y2={240 + i * 220}
              stroke={COLORS.electric_cyan} strokeWidth={0.6} opacity={0.04}/>
          ))}
          {/* Tag: "RECAP" */}
          <rect x={80} y={200} width={180} height={52} rx={10}
            fill={COLORS.warm_blue} opacity={enter}/>
          <text x={170} y={233} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={900}
            fill="white" opacity={enter}>RECAP</text>
        </svg>

        {/* Section title */}
        <div style={{
          position: 'absolute', top: 280, left: 80, right: 80,
          opacity: enter,
        }}>
          <div style={{
            fontSize: 72, fontWeight: 900,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}>
            Structured
            <br/>
            <span style={{ color: COLORS.warm_blue }}>Output</span>
          </div>
          <div style={{
            marginTop: 16, fontSize: 30, fontWeight: 500,
            color: COLORS.light_gray,
            fontFamily: '"Inter", sans-serif',
          }}>
            Forcing model completions into machine-readable format
          </div>
        </div>

        {/* JSON Code block */}
        <div style={{
          position: 'absolute', top: 560, left: 80, right: 80,
          background: '#0D1A2E',
          borderRadius: 24,
          border: `2px solid rgba(0,229,255,0.2)`,
          padding: '32px 44px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
          opacity: enter,
        }}>
          {/* Window controls */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            {['#EF4444', '#F59E0B', '#22C55E'].map((c, i) => (
              <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c }}/>
            ))}
            <span style={{ fontSize: 22, color: '#6B7280', marginLeft: 16, fontFamily: 'monospace' }}>
              structured_output.json
            </span>
          </div>
          {/* JSON Lines */}
          {JSON_LINES.map((line, i) => {
            const lineEnter = interpolate(frame, [8 + i * 5, 26 + i * 5], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{
                display: 'flex', gap: 12,
                paddingLeft: line.indent * 36,
                marginBottom: 8,
                opacity: lineEnter,
                transform: `translateX(${interpolate(frame, [8 + i*5, 26 + i*5], [-20, 0], { extrapolateRight: 'clamp' })}px)`,
              }}>
                <span style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: 32, color: line.color, fontWeight: 600,
                }}>
                  {line.txt}
                </span>
                {line.val && <>
                  <span style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 32, color: '#C8D0D4', fontWeight: 400, marginLeft: 4,
                  }}> </span>
                  <span style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 32, color: line.valColor, fontWeight: 500,
                  }}>
                    {line.val}
                  </span>
                </>}
              </div>
            );
          })}
        </div>

        {/* Context description */}
        <div style={{
          position: 'absolute', top: 1360, left: 80, right: 80,
          opacity: interpolate(frame, [35, 65], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            background: 'rgba(59,130,246,0.08)',
            border: '1.5px solid rgba(59,130,246,0.25)',
            borderRadius: 16,
            padding: '24px 32px',
          }}>
            <div style={{
              fontSize: 32, fontWeight: 700,
              color: COLORS.deep_black,
              fontFamily: '"Inter", sans-serif',
              marginBottom: 10,
            }}>
              Why it matters
            </div>
            <div style={{
              fontSize: 28, color: COLORS.light_gray,
              fontFamily: '"Inter", sans-serif',
              lineHeight: 1.6,
            }}>
              Structured output turns unstructured language into data that a program can
              <span style={{ color: COLORS.warm_blue, fontWeight: 700 }}> actually act on</span>.
            </div>
          </div>
        </div>

        <CaptionBar text="Last time, we saw structured output." opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
