/**
 * Scene 05 — Text Into Action
 * "...is what turns text into something a program can actually act on."
 * Layout (1080×1920):
 *   Title              top=92 → ~220
 *   Pipeline steps     top=262, 490, 718, 946 — each h=200
 *   Arrows between     y=470, 698, 926 (h=40 each)
 *   Key insight        top=1180 → ~1270
 *   Description        top=1300 → ~1490
 *   Caption            y=1730
 * Duration: 130 frames (4.33s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const PIPELINE_STEPS = [
  {
    label: 'LANGUAGE', sub: 'Natural text input', color: '#C8D0D4', bg: '#121418',
    border: 'rgba(200,208,212,0.2)',
    iconSvg: (
      <svg width={40} height={40} viewBox="0 0 40 40">
        <rect x={4} y={8} width={32} height={5} rx={2.5} fill="#C8D0D4" opacity={0.9}/>
        <rect x={4} y={17} width={25} height={5} rx={2.5} fill="#C8D0D4" opacity={0.65}/>
        <rect x={4} y={26} width={18} height={5} rx={2.5} fill="#C8D0D4" opacity={0.4}/>
      </svg>
    ),
  },
  {
    label: 'STRUCTURE', sub: 'Typed JSON schema', color: '#3B82F6', bg: '#080F1C',
    border: 'rgba(59,130,246,0.28)',
    iconSvg: (
      <svg width={40} height={40} viewBox="0 0 40 40">
        <rect x={4} y={4} width={32} height={32} rx={5} fill="none" stroke="#3B82F6" strokeWidth={2.5}/>
        <line x1={4} y1={14} x2={36} y2={14} stroke="#3B82F6" strokeWidth={1.5} opacity={0.6}/>
        <line x1={16} y1={14} x2={16} y2={36} stroke="#3B82F6" strokeWidth={1.5} opacity={0.6}/>
        <circle cx={10} cy={9} r={2.5} fill="#3B82F6" opacity={0.7}/>
      </svg>
    ),
  },
  {
    label: 'ACTION', sub: 'Program executes', color: '#00E5FF', bg: '#001418',
    border: 'rgba(0,229,255,0.28)',
    iconSvg: (
      <svg width={40} height={40} viewBox="0 0 40 40">
        <polygon points="8,4 32,20 8,36" fill="#00E5FF" opacity={0.9}/>
        <line x1={26} y1={20} x2={38} y2={20} stroke="#00E5FF" strokeWidth={2.5} strokeLinecap="round"/>
        <circle cx={38} cy={20} r={3.5} fill="#00E5FF"/>
      </svg>
    ),
  },
  {
    label: 'RESULT', sub: 'Real-world effect', color: '#22C55E', bg: '#031208',
    border: 'rgba(34,197,94,0.28)',
    iconSvg: (
      <svg width={40} height={40} viewBox="0 0 40 40">
        <circle cx={20} cy={20} r={15} fill="none" stroke="#22C55E" strokeWidth={2.5} opacity={0.5}/>
        <polyline points="10,20 17,27 30,11" fill="none" stroke="#22C55E" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export const Scene05_TextIntoAction: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const insightEnter = interpolate(frame, [90, 115], [0, 1], { extrapolateRight: 'clamp' });
  const flowPulse = (Math.sin(frame * 0.14) + 1) / 2;

  // Step layout: top=262 + i*228, height=200
  const STEP_TOP_BASE = 262;
  const STEP_SPACING = 228; // step(200) + arrow gap(28)
  const STEP_H = 200;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>

          {/* Background ambient gradient */}
          <ellipse cx={540} cy={900} rx={500} ry={700}
            fill={COLORS.electric_cyan} opacity={0.018}/>

          {/* Flow track line — vertical spine */}
          <line x1={540} y1={262} x2={540} y2={1146}
            stroke={COLORS.electric_cyan} strokeWidth={1}
            strokeDasharray="4 6" opacity={0.12 * enter}/>
        </svg>

        {/* ── Title ── */}
        <div style={{
          position: 'absolute', top: 92, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 62, fontWeight: 900,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '-0.025em',
          }}>
            Text Into
            <span style={{ color: COLORS.electric_cyan }}> Action</span>
          </div>
          <div style={{ fontSize: 28, color: COLORS.light_gray, marginTop: 10 }}>
            The pipeline that makes AI useful
          </div>
        </div>

        {/* ── Pipeline steps ── */}
        {PIPELINE_STEPS.map((step, i) => {
          const stepTop = STEP_TOP_BASE + i * STEP_SPACING;
          const stepEnter = interpolate(frame, [15 + i * 18, 38 + i * 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
          const slideDir = i % 2 === 0 ? -1 : 1;
          const arrowTop = stepTop + STEP_H + 6;
          const arrowEnter = interpolate(frame, [28 + i * 18, 48 + i * 18], [0, 1], { extrapolateRight: 'clamp' });
          const isLast = i === PIPELINE_STEPS.length - 1;

          return (
            <div key={i}>
              {/* Step card */}
              <div style={{
                position: 'absolute',
                top: stepTop, left: 78, right: 78,
                height: STEP_H,
                background: step.bg,
                borderRadius: 22,
                border: `2px solid ${step.border}`,
                boxShadow: `0 10px 36px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px ${step.color}10`,
                opacity: stepEnter,
                transform: `translateX(${interpolate(frame, [15 + i * 18, 38 + i * 18], [slideDir * 50, 0], { extrapolateRight: 'clamp' })}px)`,
                display: 'flex', alignItems: 'center', gap: 28, padding: '0 36px',
              }}>
                {/* Step number badge */}
                <div style={{
                  position: 'absolute', top: 12, right: 20,
                  fontSize: 72, fontWeight: 900,
                  color: `${step.color}12`,
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1, userSelect: 'none',
                }}>
                  {i + 1}
                </div>

                {/* Icon circle */}
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: `${step.color}10`,
                  border: `2.5px solid ${step.color}60`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 0 24px ${step.color}20`,
                }}>
                  {step.iconSvg}
                </div>

                {/* Label */}
                <div style={{ flex: 1, zIndex: 1 }}>
                  <div style={{
                    fontSize: 44, fontWeight: 900,
                    color: step.color,
                    letterSpacing: '0.03em',
                    fontFamily: '"Inter", sans-serif',
                    lineHeight: 1,
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontSize: 26, color: '#606878',
                    marginTop: 8,
                    fontFamily: '"Inter", sans-serif',
                  }}>
                    {step.sub}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{
                  width: 10, height: 130,
                  borderRadius: 5,
                  background: 'rgba(255,255,255,0.05)',
                  position: 'relative', overflow: 'hidden', flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: `${stepEnter * 100}%`,
                    background: `linear-gradient(0deg, ${step.color} 0%, ${step.color}80 100%)`,
                    borderRadius: 5,
                    boxShadow: `0 0 10px ${step.color}`,
                  }}/>
                </div>
              </div>

              {/* Flow arrow between steps */}
              {!isLast && (
                <div style={{
                  position: 'absolute',
                  top: arrowTop,
                  left: 0, right: 0,
                  display: 'flex', justifyContent: 'center',
                  opacity: arrowEnter,
                }}>
                  <svg width={40} height={22} viewBox="0 0 40 22"
                    style={{
                      filter: `drop-shadow(0 0 8px ${COLORS.electric_cyan})`,
                      transform: `scale(${0.85 + flowPulse * 0.15})`,
                    }}>
                    <line x1={20} y1={2} x2={20} y2={14}
                      stroke={COLORS.electric_cyan} strokeWidth={3.5} strokeLinecap="round"/>
                    <polyline points="10,8 20,18 30,8"
                      fill="none" stroke={COLORS.electric_cyan}
                      strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}

        {/* ── Key insight ── top=1182 */}
        <div style={{
          position: 'absolute', top: 1182, left: 78, right: 78,
          opacity: insightEnter,
          background: 'rgba(0,229,255,0.07)',
          border: '2px solid rgba(0,229,255,0.28)',
          borderRadius: 18, padding: '22px 36px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 30, fontWeight: 800,
            color: COLORS.electric_cyan,
            fontFamily: '"Inter", sans-serif',
          }}>
            Structure is the bridge between language and action.
          </div>
        </div>

        {/* ── Description ── top=1300 */}
        <div style={{
          position: 'absolute', top: 1300, left: 78, right: 78,
          opacity: interpolate(frame, [100, 125], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(59,130,246,0.06)',
          border: '1.5px solid rgba(59,130,246,0.2)',
          borderRadius: 18, padding: '24px 36px',
        }}>
          <div style={{ fontSize: 27, color: COLORS.light_gray, lineHeight: 1.65 }}>
            Without structure, language stays language.
            With structure, it becomes
            <span style={{ color: COLORS.warm_blue, fontWeight: 700 }}> a command a machine can obey</span>.
          </div>
        </div>

        <CaptionBar
          text="is what turns text into something a program can actually act on"
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
