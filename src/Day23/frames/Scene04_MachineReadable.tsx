/**
 * Scene 04 — Machine Readable Format
 * "...forcing the model's completion into a machine readable format..."
 * Hero: Split panel — raw text on left → typed JSON on right, transform arrow.
 * Duration: 146 frames (4.87s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const RAW_LINES = [
  'Okay so I need to get a flight to',
  'Tokyo sometime in mid-March, maybe',
  'the 15th? Two people, keeping it',
  'budget so economy class please.',
];

const TYPED_FIELDS = [
  { key: 'intent', value: '"book_flight"', kColor: '#22C55E', vColor: '#F59E0B' },
  { key: 'destination', value: '"Tokyo"', kColor: '#22C55E', vColor: '#60A5FA' },
  { key: 'departure', value: '"2024-03-15"', kColor: '#22C55E', vColor: '#60A5FA' },
  { key: 'passengers', value: '2', kColor: '#22C55E', vColor: '#F87171' },
  { key: 'class', value: '"economy"', kColor: '#22C55E', vColor: '#60A5FA' },
];

export const Scene04_MachineReadable: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const arrowProg = interpolate(frame, [40, 80], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const jsonEnter = interpolate(frame, [70, 110], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          {/* Background grid */}
          <line x1={540} y1={200} x2={540} y2={1750}
            stroke={COLORS.electric_cyan} strokeWidth={1.5} opacity={0.08}/>
          {/* Decorative circuit */}
          <path d="M 100,1100 L 200,1100 L 200,1200 L 300,1200"
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}
            opacity={0.12} strokeLinecap="round"/>
          <path d="M 780,600 L 900,600 L 900,700 L 980,700"
            fill="none" stroke={COLORS.warm_blue} strokeWidth={1.5}
            opacity={0.12} strokeLinecap="round"/>
          {/* Arrow center */}
          {arrowProg > 0.1 && (
            <g>
              <circle cx={540} cy={960} r={50}
                fill={COLORS.electric_cyan} opacity={arrowProg * 0.15}
                filter="url(#cyanGlow)"/>
              <circle cx={540} cy={960} r={34}
                fill="#F5F0E8" stroke={COLORS.electric_cyan} strokeWidth={4}/>
              {/* Arrow right */}
              <path d="M 522,953 L 545,953 L 545,944 L 566,960 L 545,976 L 545,967 L 522,967 Z"
                fill={COLORS.electric_cyan} opacity={arrowProg}/>
            </g>
          )}
        </svg>

        {/* Section header */}
        <div style={{
          position: 'absolute', top: 100, left: 80, right: 80,
          opacity: enter,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 52, fontWeight: 900,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: COLORS.warm_blue }}>Forcing</span> the Completion
          </div>
          <div style={{ fontSize: 30, color: COLORS.light_gray, marginTop: 8 }}>
            Raw natural language → machine-readable format
          </div>
        </div>

        {/* LEFT: Raw text panel */}
        <div style={{
          position: 'absolute', top: 240, left: 80, width: 420,
          opacity: enter,
        }}>
          {/* Panel label */}
          <div style={{
            background: '#EF4444', borderRadius: '10px 10px 0 0',
            padding: '12px 20px',
            fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '0.06em',
          }}>
            RAW COMPLETION
          </div>
          <div style={{
            background: '#1A0A0A',
            borderRadius: '0 0 16px 16px',
            border: '2px solid rgba(239,68,68,0.3)',
            borderTop: 'none',
            padding: '28px 24px',
            minHeight: 600,
          }}>
            {RAW_LINES.map((line, i) => (
              <div key={i} style={{
                fontSize: 26, color: '#C8A0A0',
                fontFamily: '"Courier New", monospace',
                lineHeight: 1.8,
                opacity: interpolate(frame, [5 + i*8, 25 + i*8], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                {line}
              </div>
            ))}
            {/* Cursor blink */}
            <span style={{
              display: 'inline-block', width: 16, height: 32,
              background: '#EF4444',
              opacity: frame % 30 < 15 ? 0.8 : 0,
              marginTop: 8,
            }}/>
            {/* Problem label */}
            <div style={{
              marginTop: 32,
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.1)',
              borderLeft: '3px solid #EF4444',
              borderRadius: 8,
              opacity: interpolate(frame, [40, 65], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              <div style={{ fontSize: 22, color: '#EF4444', fontWeight: 700 }}>⚠ Unparseable</div>
              <div style={{ fontSize: 20, color: '#C8A0A0', marginTop: 4 }}>Program cannot act on this</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Structured JSON panel */}
        <div style={{
          position: 'absolute', top: 240, right: 80, width: 460,
          opacity: jsonEnter,
        }}>
          {/* Panel label */}
          <div style={{
            background: '#22C55E', borderRadius: '10px 10px 0 0',
            padding: '12px 20px',
            fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '0.06em',
          }}>
            STRUCTURED OUTPUT
          </div>
          <div style={{
            background: '#091A12',
            borderRadius: '0 0 16px 16px',
            border: '2px solid rgba(34,197,94,0.3)',
            borderTop: 'none',
            padding: '28px 24px',
            minHeight: 600,
          }}>
            <div style={{ fontSize: 28, color: '#6B7280', fontFamily: 'monospace', marginBottom: 12 }}>{'{'}</div>
            {TYPED_FIELDS.map((f, i) => {
              const fEnter = interpolate(frame, [75 + i * 8, 95 + i * 8], [0, 1], { extrapolateRight: 'clamp' });
              return (
                <div key={i} style={{
                  paddingLeft: 28, marginBottom: 10,
                  opacity: fEnter,
                  transform: `translateX(${interpolate(frame, [75+i*8, 95+i*8], [20, 0], { extrapolateRight: 'clamp' })}px)`,
                }}>
                  <span style={{ fontSize: 26, color: f.kColor, fontFamily: 'monospace', fontWeight: 600 }}>
                    "{f.key}":
                  </span>
                  <span style={{ fontSize: 26, color: f.vColor, fontFamily: 'monospace', marginLeft: 8 }}>
                    {f.value}
                  </span>
                </div>
              );
            })}
            <div style={{ fontSize: 28, color: '#6B7280', fontFamily: 'monospace', marginTop: 4 }}>{'}'}</div>
            {/* Success label */}
            <div style={{
              marginTop: 24, padding: '12px 16px',
              background: 'rgba(34,197,94,0.1)',
              borderLeft: '3px solid #22C55E',
              borderRadius: 8,
              opacity: interpolate(frame, [110, 135], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, color: '#22C55E', fontWeight: 700 }}>
                <svg width={20} height={20} viewBox="0 0 20 20"><polyline points="3,10 8,15 17,5" fill="none" stroke="#22C55E" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
                Parseable
              </div>
              <div style={{ fontSize: 20, color: '#90C0A0', marginTop: 4 }}>Program can act on this</div>
            </div>
          </div>
        </div>

        {/* Bottom description */}
        <div style={{
          position: 'absolute', top: 1380, left: 80, right: 80,
          opacity: interpolate(frame, [100, 135], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(59,130,246,0.07)',
          border: '1.5px solid rgba(59,130,246,0.2)',
          borderRadius: 16, padding: '24px 32px',
        }}>
          <div style={{
            fontSize: 30, fontWeight: 700, color: COLORS.warm_blue, marginBottom: 10,
          }}>
            The transformation
          </div>
          <div style={{
            fontSize: 28, color: COLORS.light_gray, lineHeight: 1.6,
          }}>
            Instead of freeform text, the model is <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}>
            constrained</span> to emit valid, typed, structured data.
          </div>
        </div>

        <CaptionBar
          text="forcing the model's completion into a machine readable format"
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
