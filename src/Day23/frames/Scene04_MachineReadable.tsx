/**
 * Scene 04 — Machine Readable Format
 * "...forcing the model's completion into a machine readable format..."
 * Layout (1080×1920):
 *   Title              top=92 → ~230
 *   LEFT raw panel     top=248, w=450 → ~870
 *   RIGHT JSON panel   top=248, w=450 → ~870
 *   Center arrow       SVG cx=540 cy=555 (centered between panels mid-height)
 *   "What Changed?"    top=900 → ~1050
 *   Three change pills top=1060 → ~1280
 *   Insight box        top=1300 → ~1470
 *   Caption            y=1730
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
  { key: 'intent', value: '"book_flight"', kColor: '#79C0FF', vColor: '#FFA657' },
  { key: 'destination', value: '"Tokyo"', kColor: '#79C0FF', vColor: '#A5D6FF' },
  { key: 'departure', value: '"2024-03-15"', kColor: '#79C0FF', vColor: '#A5D6FF' },
  { key: 'passengers', value: '2', kColor: '#79C0FF', vColor: '#F47067' },
  { key: 'class', value: '"economy"', kColor: '#79C0FF', vColor: '#A5D6FF' },
];

const CHANGE_PILLS = [
  { from: 'Ambiguous prose', to: 'Precise types', fromColor: '#EF4444', toColor: '#22C55E' },
  { from: 'Unactionable text', to: 'Callable data', fromColor: '#EF4444', toColor: COLORS.electric_cyan },
  { from: 'Natural language', to: 'API payload', fromColor: '#EF4444', toColor: COLORS.warm_blue },
];

export const Scene04_MachineReadable: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const arrowProg = interpolate(frame, [40, 80], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const jsonEnter = interpolate(frame, [70, 110], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const changesEnter = interpolate(frame, [100, 128], [0, 1], { extrapolateRight: 'clamp' });
  const arrowGlow = 0.7 + Math.sin(frame * 0.18) * 0.3;

  // Panel dimensions
  const PANEL_LEFT = 70;
  const PANEL_W = 450;
  const PANEL_GAP = 40; // between panels: 70+450+gap+450+70=1080 → gap=40
  const PANEL_RIGHT_X = PANEL_LEFT + PANEL_W + PANEL_GAP; // 560
  const CENTER_X = PANEL_LEFT + PANEL_W + PANEL_GAP / 2; // 540

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>

          {/* Ambient glow — left red, right cyan */}
          <ellipse cx={295} cy={560} rx={260} ry={320}
            fill="#EF4444" opacity={0.025}/>
          <ellipse cx={785} cy={560} rx={260} ry={320}
            fill={COLORS.electric_cyan} opacity={0.025}/>

          {/* Vertical center line */}
          <line x1={CENTER_X} y1={240} x2={CENTER_X} y2={900}
            stroke={COLORS.light_gray} strokeWidth={1}
            strokeDasharray="5 6" opacity={enter * 0.18}/>

          {/* Transform arrow — center between panels, vertically centered ~y=555 */}
          {arrowProg > 0.05 && (
            <g>
              {/* Glow burst */}
              <circle cx={CENTER_X} cy={555} r={56}
                fill={COLORS.electric_cyan}
                opacity={arrowProg * arrowGlow * 0.14}
                filter="url(#cyanGlow)"/>
              {/* Circle background */}
              <circle cx={CENTER_X} cy={555} r={38}
                fill="#F5F0E8"
                stroke={COLORS.electric_cyan}
                strokeWidth={3.5}
                opacity={arrowProg}/>
              {/* Arrow pointing right */}
              <path d={`M ${CENTER_X - 16},547 L ${CENTER_X + 4},547 L ${CENTER_X + 4},538 L ${CENTER_X + 22},555 L ${CENTER_X + 4},572 L ${CENTER_X + 4},563 L ${CENTER_X - 16},563 Z`}
                fill={COLORS.electric_cyan}
                opacity={arrowProg}/>
            </g>
          )}
        </svg>

        {/* ── Header ── */}
        <div style={{
          position: 'absolute', top: 92, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 58, fontWeight: 900,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '-0.025em',
          }}>
            <span style={{ color: COLORS.warm_blue }}>Forcing</span> the Completion
          </div>
          <div style={{
            fontSize: 28, color: COLORS.light_gray, marginTop: 10,
            fontFamily: '"Inter", sans-serif',
          }}>
            Raw language → machine-readable format
          </div>
        </div>

        {/* ── LEFT: Raw text panel ── */}
        <div style={{
          position: 'absolute', top: 248, left: PANEL_LEFT, width: PANEL_W,
          opacity: enter,
        }}>
          {/* Header tab */}
          <div style={{
            background: 'linear-gradient(90deg, #B91C1C 0%, #EF4444 100%)',
            borderRadius: '14px 14px 0 0',
            padding: '14px 22px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <svg width={22} height={22} viewBox="0 0 22 22">
              <line x1={3} y1={3} x2={19} y2={19} stroke="white" strokeWidth={3} strokeLinecap="round"/>
              <line x1={19} y1={3} x2={3} y2={19} stroke="white" strokeWidth={3} strokeLinecap="round"/>
            </svg>
            <span style={{
              fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '0.07em',
            }}>
              RAW TEXT
            </span>
          </div>
          {/* Panel body */}
          <div style={{
            background: 'linear-gradient(160deg, #1A0808 0%, #0F0505 100%)',
            borderRadius: '0 0 18px 18px',
            border: '2px solid rgba(239,68,68,0.25)',
            borderTop: 'none',
            padding: '28px 26px',
            minHeight: 560,
            boxShadow: '0 14px 40px rgba(0,0,0,0.3)',
          }}>
            {RAW_LINES.map((line, i) => (
              <div key={i} style={{
                fontSize: 25, color: '#B08080',
                fontFamily: '"Courier New", monospace',
                lineHeight: 1.85,
                opacity: interpolate(frame, [5 + i * 8, 25 + i * 8], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                {line}
              </div>
            ))}
            {/* Blinking cursor */}
            <span style={{
              display: 'inline-block', width: 16, height: 30,
              background: '#EF4444',
              opacity: frame % 30 < 15 ? 0.8 : 0,
              marginTop: 10, verticalAlign: 'middle',
            }}/>
            {/* Problem badge */}
            <div style={{
              marginTop: 36,
              padding: '14px 18px',
              background: 'rgba(239,68,68,0.1)',
              border: '1.5px solid rgba(239,68,68,0.28)',
              borderLeft: '4px solid #EF4444',
              borderRadius: 10,
              opacity: interpolate(frame, [40, 65], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              <div style={{
                fontSize: 22, color: '#EF4444', fontWeight: 800, marginBottom: 4,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width={18} height={18} viewBox="0 0 18 18">
                  <circle cx={9} cy={9} r={8} fill="none" stroke="#EF4444" strokeWidth={2}/>
                  <line x1={9} y1={5} x2={9} y2={10} stroke="#EF4444" strokeWidth={2} strokeLinecap="round"/>
                  <circle cx={9} cy={13} r={1.5} fill="#EF4444"/>
                </svg>
                Unparseable
              </div>
              <div style={{ fontSize: 20, color: '#C8A0A0' }}>
                No program can act on this
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Structured JSON panel ── */}
        <div style={{
          position: 'absolute', top: 248, left: PANEL_RIGHT_X, width: PANEL_W,
          opacity: jsonEnter,
        }}>
          {/* Header tab */}
          <div style={{
            background: 'linear-gradient(90deg, #15803D 0%, #22C55E 100%)',
            borderRadius: '14px 14px 0 0',
            padding: '14px 22px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <svg width={22} height={22} viewBox="0 0 22 22">
              <path d="M4,11 L9,16 L18,6" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '0.07em',
            }}>
              STRUCTURED
            </span>
          </div>
          {/* Panel body */}
          <div style={{
            background: 'linear-gradient(160deg, #061812 0%, #030E09 100%)',
            borderRadius: '0 0 18px 18px',
            border: '2px solid rgba(34,197,94,0.22)',
            borderTop: 'none',
            padding: '28px 22px',
            minHeight: 560,
            boxShadow: '0 14px 40px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              fontSize: 28, color: '#4B5563',
              fontFamily: '"Courier New", monospace',
              marginBottom: 8,
            }}>{'{'}</div>
            {TYPED_FIELDS.map((f, i) => {
              const fEnter = interpolate(frame, [75 + i * 8, 95 + i * 8], [0, 1], { extrapolateRight: 'clamp' });
              return (
                <div key={i} style={{
                  paddingLeft: 26, marginBottom: 10,
                  opacity: fEnter,
                  transform: `translateX(${interpolate(frame, [75 + i * 8, 95 + i * 8], [20, 0], { extrapolateRight: 'clamp' })}px)`,
                }}>
                  <span style={{
                    fontSize: 26, color: f.kColor,
                    fontFamily: '"Courier New", monospace', fontWeight: 600,
                  }}>
                    "{f.key}":
                  </span>
                  <span style={{
                    fontSize: 26, color: f.vColor,
                    fontFamily: '"Courier New", monospace', marginLeft: 8,
                  }}>
                    {f.value}
                  </span>
                </div>
              );
            })}
            <div style={{
              fontSize: 28, color: '#4B5563',
              fontFamily: '"Courier New", monospace',
              marginTop: 4,
            }}>{'}'}</div>
            {/* Success badge */}
            <div style={{
              marginTop: 30, padding: '14px 18px',
              background: 'rgba(34,197,94,0.1)',
              border: '1.5px solid rgba(34,197,94,0.28)',
              borderLeft: '4px solid #22C55E',
              borderRadius: 10,
              opacity: interpolate(frame, [108, 130], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              <div style={{
                fontSize: 22, color: '#22C55E', fontWeight: 800, marginBottom: 4,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width={18} height={18} viewBox="0 0 18 18">
                  <circle cx={9} cy={9} r={8} fill="none" stroke="#22C55E" strokeWidth={2}/>
                  <path d="M5,9 L8,12 L13,6" fill="none" stroke="#22C55E" strokeWidth={2} strokeLinecap="round"/>
                </svg>
                Parseable
              </div>
              <div style={{ fontSize: 20, color: '#90C0A0' }}>
                Program can act immediately
              </div>
            </div>
          </div>
        </div>

        {/* ── What Changed section ── top=902 */}
        <div style={{
          position: 'absolute', top: 902, left: 78, right: 78,
          opacity: changesEnter,
        }}>
          <div style={{
            fontSize: 30, fontWeight: 800,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            marginBottom: 22,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 6, height: 30, borderRadius: 3,
              background: COLORS.electric_cyan,
            }}/>
            What the transformation achieves
          </div>

          {/* Change pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CHANGE_PILLS.map((pill, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 18,
                opacity: interpolate(frame, [100 + i * 8, 122 + i * 8], [0, 1], { extrapolateRight: 'clamp' }),
                transform: `translateX(${interpolate(frame, [100 + i * 8, 122 + i * 8], [-30, 0], { extrapolateRight: 'clamp' })}px)`,
              }}>
                <div style={{
                  flex: 1, padding: '14px 20px',
                  background: 'rgba(239,68,68,0.08)',
                  border: `1.5px solid rgba(239,68,68,0.25)`,
                  borderRadius: 10,
                  fontSize: 24, color: '#C08080',
                  fontFamily: '"Inter", sans-serif', textAlign: 'center',
                  textDecoration: 'line-through',
                }}>
                  {pill.from}
                </div>
                <svg width={32} height={32} viewBox="0 0 32 32">
                  <line x1={4} y1={16} x2={22} y2={16} stroke={COLORS.electric_cyan} strokeWidth={3} strokeLinecap="round"/>
                  <polyline points="14,8 22,16 14,24" fill="none" stroke={COLORS.electric_cyan} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{
                  flex: 1, padding: '14px 20px',
                  background: 'rgba(0,229,255,0.07)',
                  border: `1.5px solid rgba(0,229,255,0.28)`,
                  borderRadius: 10,
                  fontSize: 24, color: pill.toColor,
                  fontFamily: '"Inter", sans-serif', textAlign: 'center',
                  fontWeight: 700,
                }}>
                  {pill.to}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Insight box ── top=1302 */}
        <div style={{
          position: 'absolute', top: 1302, left: 78, right: 78,
          opacity: interpolate(frame, [116, 140], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(0,229,255,0.05) 100%)',
          border: '2px solid rgba(59,130,246,0.25)',
          borderRadius: 20, padding: '26px 36px',
        }}>
          <div style={{
            fontSize: 28, fontWeight: 700, color: COLORS.warm_blue, marginBottom: 12,
          }}>
            The transformation
          </div>
          <div style={{ fontSize: 27, color: COLORS.light_gray, lineHeight: 1.65 }}>
            Instead of freeform text, the model is
            <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}> constrained</span> to emit
            valid, typed, structured data — ready for any program to consume.
          </div>
        </div>

        <CaptionBar
          text="forcing the model's completion into a machine readable format"
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
