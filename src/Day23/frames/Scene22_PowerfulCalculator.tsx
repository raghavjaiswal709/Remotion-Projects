/**
 * Scene 22 — Without the Loop: Powerful Calculator
 * "Without the loop, you have a very powerful calculator."
 * Hero: Calculator visual with model chip inside, showing limited capability.
 * Duration: 86 frames (2.87s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const CALC_BUTTONS = [
  ['7','8','9','÷'],
  ['4','5','6','×'],
  ['1','2','3','-'],
  ['0','.','=','+'],
];

export const Scene22_PowerfulCalculator: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const calcEnter = interpolate(frame, [20, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>
        </svg>

        {/* Title */}
        <div style={{ position: 'absolute', top: 100, left: 80, right: 80, textAlign: 'center', opacity: enter }}>
          <div style={{
            fontSize: 58, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            Without the Loop:
            <br/>
            <span style={{ color: COLORS.warm_blue }}>Powerful Calculator</span>
          </div>
          <div style={{ fontSize: 28, color: COLORS.light_gray, marginTop: 10 }}>
            Impressive — but limited to a single transaction.
          </div>
        </div>

        {/* Calculator UI */}
        <div style={{
          position: 'absolute', top: 340, left: 160, right: 160,
          background: '#1A1A2E',
          borderRadius: 28,
          border: '3px solid rgba(59,130,246,0.3)',
          padding: '28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          opacity: calcEnter,
        }}>
          {/* Display */}
          <div style={{
            background: '#0A0A18', borderRadius: 16,
            padding: '20px 28px', marginBottom: 20, textAlign: 'right',
            border: '2px solid rgba(59,130,246,0.2)',
          }}>
            <div style={{ fontSize: 22, color: '#6B7280', fontFamily: 'monospace', marginBottom: 4 }}>
              "What is the capital of France?"
            </div>
            <div style={{ fontSize: 36, color: COLORS.warm_blue, fontFamily: 'monospace', fontWeight: 700 }}>
              "Paris"
            </div>
          </div>

          {/* Buttons */}
          {CALC_BUTTONS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              {row.map((btn, bi) => (
                <div key={bi} style={{
                  flex: 1, height: 68, borderRadius: 12,
                  background: btn === '=' ? COLORS.warm_blue : (isNaN(Number(btn)) ? '#2A2A4E' : '#1E1E38'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 30, fontWeight: 700,
                  color: btn === '=' ? 'white' : COLORS.cool_silver,
                  border: '1px solid rgba(59,130,246,0.1)',
                }}>
                  {btn}
                </div>
              ))}
            </div>
          ))}

          {/* "Powerful but no loop" indicator */}
          <div style={{
            marginTop: 12, padding: '16px 20px',
            background: 'rgba(239,68,68,0.08)',
            borderRadius: 12,
            border: '1.5px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <svg width={28} height={28} viewBox="0 0 28 28">
              <polygon points="10,2 18,12 13,12 18,26 8,14 13,14" fill="#EF4444"/>
            </svg>
            <div>
              <div style={{ fontSize: 22, color: '#EF4444', fontWeight: 700 }}>NO LOOP CAPABILITY</div>
              <div style={{ fontSize: 20, color: '#8080A0' }}>One shot · No retry · No observation</div>
            </div>
          </div>
        </div>

        {/* What it lacks */}
        <div style={{
          position: 'absolute', top: 1002, left: 80, right: 80,
          display: 'flex', gap: 12,
          opacity: interpolate(frame, [42, 66], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {['No retry', 'No loop', 'No observation', 'No planning'].map((label, i) => (
            <div key={i} style={{
              flex: 1,
              padding: '12px 6px',
              background: 'rgba(239,68,68,0.07)',
              border: '1.5px solid rgba(239,68,68,0.22)',
              borderRadius: 10, textAlign: 'center',
              fontSize: 20, color: '#EF4444', fontWeight: 700,
              opacity: interpolate(frame, [42 + i * 5, 62 + i * 5], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Comparison vs agent */}
        <div style={{
          position: 'absolute', top: 1108, left: 80, right: 80,
          display: 'flex', gap: 16,
          opacity: interpolate(frame, [55, 82], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            flex: 1, background: '#0A1428', borderRadius: 18,
            border: '2px solid rgba(59,130,246,0.3)', padding: '24px 28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, color: COLORS.warm_blue, fontWeight: 800, marginBottom: 8 }}>
              <svg width={20} height={20} viewBox="0 0 20 20"><rect x={2} y={2} width={16} height={16} rx={2} fill="none" stroke={COLORS.warm_blue} strokeWidth={1.5}/><line x1={2} y1={7} x2={18} y2={7} stroke={COLORS.warm_blue} strokeWidth={1}/><line x1={7} y1={7} x2={7} y2={18} stroke={COLORS.warm_blue} strokeWidth={1}/></svg>
              No-Loop Model
            </div>
            {['Answers questions', 'Generates text', 'One shot only'].map((t, i) => (
              <div key={i} style={{ fontSize: 24, color: '#6080A0', marginBottom: 6 }}>
                · {t}
              </div>
            ))}
          </div>
          <div style={{
            flex: 1, background: '#001820', borderRadius: 18,
            border: '2px solid rgba(0,229,255,0.3)', padding: '24px 28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, color: COLORS.electric_cyan, fontWeight: 800, marginBottom: 8 }}>
              <svg width={20} height={20} viewBox="0 0 20 20"><rect x={3} y={7} width={14} height={10} rx={2} fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}/><circle cx={8} cy={11} r={1.5} fill={COLORS.electric_cyan}/><circle cx={12} cy={11} r={1.5} fill={COLORS.electric_cyan}/><rect x={8} y={2} width={4} height={5} rx={1.5} fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}/></svg>
              Loop Agent
            </div>
            {['Navigates problems', 'Retries & adapts', 'Autonomous goals'].map((t, i) => (
              <div key={i} style={{ fontSize: 24, color: '#609080', marginBottom: 6 }}>
                · {t}
              </div>
            ))}
          </div>
        </div>

        {/* Key insight */}
        <div style={{
          position: 'absolute', top: 1360, left: 80, right: 80,
          opacity: interpolate(frame, [68, 86], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'linear-gradient(135deg, rgba(0,229,255,0.07) 0%, rgba(59,130,246,0.05) 100%)',
          border: '2px solid rgba(0,229,255,0.22)',
          borderRadius: 18, padding: '26px 36px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.electric_cyan }}>
            Add the loop — and the calculator becomes an agent.
          </div>
        </div>

        <CaptionBar
          text="Without the loop, you have a very powerful calculator."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
