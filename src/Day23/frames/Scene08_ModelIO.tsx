/**
 * Scene 08 — Model: One Input, One Output
 * "A model takes one input. It produces one output. That is it."
 * Layout (1080×1920, no overlaps):
 *   Title           y=60–200
 *   INPUT box       y=220–420
 *   Arrow 1         y=430–550
 *   ProcessorUnit   y=560–900  (cy=730, size=340 → 560..900)
 *   Arrow 2         y=910–1030
 *   OUTPUT box      y=1040–1240
 *   Tags row        y=1280–1370
 *   Caption         y=1700
 * Duration: 170 frames (5.67s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, ProcessorUnit, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene08_ModelIO: React.FC = () => {
  const frame = useCurrentFrame();
  const enter      = interpolate(frame, [0,  30],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const chipEnter  = interpolate(frame, [30, 70],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const outputEnter= interpolate(frame, [80, 120], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const tagsEnter  = interpolate(frame, [120, 155],[0, 1], { extrapolateRight: 'clamp' });
  const arrowPulse = 0.55 + Math.sin(frame * 0.1) * 0.45;
  const chipScale  = interpolate(frame, [30, 62], [0.72, 1], { extrapolateRight: 'clamp' });

  // ProcessorUnit center y=730 → spans y 730-170=560 … 730+170=900
  const CHIP_CY = 730;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>

          {/* Subtle vertical guide track */}
          <line x1={540} y1={200} x2={540} y2={1680}
            stroke={COLORS.warm_blue} strokeWidth={1}
            strokeDasharray="4 8" opacity={enter * 0.08}/>

          {/* Arrow 1: INPUT → MODEL  (y 430→550) */}
          {chipEnter > 0.05 && (
            <g opacity={chipEnter * arrowPulse}>
              <line x1={540} y1={430} x2={540} y2={530}
                stroke={COLORS.warm_blue} strokeWidth={7} strokeLinecap="round"/>
              <polygon points="514,520 540,562 566,520"
                fill={COLORS.warm_blue}/>
            </g>
          )}

          {/* Arrow 2: MODEL → OUTPUT  (y 910→1030) */}
          {outputEnter > 0.05 && (
            <g opacity={outputEnter * arrowPulse}>
              <line x1={540} y1={908} x2={540} y2={1008}
                stroke={COLORS.electric_cyan} strokeWidth={7} strokeLinecap="round"
                filter="url(#cyanGlow)"/>
              <polygon points="514,998 540,1040 566,998"
                fill={COLORS.electric_cyan} filter="url(#cyanGlow)"/>
            </g>
          )}

          {/* ProcessorUnit chip */}
          <ProcessorUnit cx={540} cy={CHIP_CY} size={340}
            opacity={chipEnter} scale={chipScale}
            variant="active" label="MODEL" frame={frame}/>
        </svg>

        {/* ── Title ── */}
        <div style={{
          position: 'absolute', top: 60, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
          transform: `translateY(${interpolate(frame, [0, 28], [-18, 0], { extrapolateRight: 'clamp' })}px)`,
        }}>
          <div style={{
            fontSize: 62, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            The <span style={{ color: COLORS.warm_blue }}>Model</span>
          </div>
          <div style={{
            fontSize: 28, color: COLORS.light_gray, marginTop: 6,
            fontWeight: 400, letterSpacing: '0.01em',
          }}>
            One input · One output · That is it.
          </div>
        </div>

        {/* ── INPUT box  y=220 ── */}
        <div style={{
          position: 'absolute', top: 220, left: 120, right: 120,
          background: 'linear-gradient(140deg, #0E1830 0%, #0A1020 100%)',
          borderRadius: 20,
          border: `2px solid ${COLORS.warm_blue}45`,
          boxShadow: `0 0 28px rgba(59,130,246,0.08), 0 12px 32px rgba(0,0,0,0.35)`,
          padding: '26px 32px',
          opacity: enter,
          transform: `translateY(${interpolate(frame, [0, 30], [-22, 0], { extrapolateRight: 'clamp' })}px)`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 20, fontWeight: 800, letterSpacing: '0.12em',
            color: COLORS.warm_blue, marginBottom: 14,
          }}>
            <svg width={18} height={18} viewBox="0 0 18 18">
              <polyline points="3,5 9,2 15,5 15,13 9,16 3,13 3,5" fill="none" stroke={COLORS.warm_blue} strokeWidth={2} strokeLinejoin="round"/>
            </svg>
            INPUT
          </div>
          <div style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 26, color: '#7090C8', lineHeight: 1.5,
          }}>
            "What is the capital of France?"
          </div>
        </div>

        {/* ── OUTPUT box  y=1050 ── */}
        <div style={{
          position: 'absolute', top: 1050, left: 120, right: 120,
          background: 'linear-gradient(140deg, #001A0C 0%, #001008 100%)',
          borderRadius: 20,
          border: `2px solid ${COLORS.electric_cyan}45`,
          boxShadow: `0 0 36px rgba(0,229,255,0.1), 0 12px 32px rgba(0,0,0,0.35)`,
          padding: '26px 32px',
          opacity: outputEnter,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 20, fontWeight: 800, letterSpacing: '0.12em',
            color: COLORS.electric_cyan, marginBottom: 14,
          }}>
            <svg width={18} height={18} viewBox="0 0 18 18">
              <polyline points="3,5 9,2 15,5 15,13 9,16 3,13 3,5" fill="none" stroke={COLORS.electric_cyan} strokeWidth={2} strokeLinejoin="round"/>
            </svg>
            OUTPUT
          </div>
          <div style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 26, color: '#50907A', lineHeight: 1.5,
          }}>
            "Paris is the capital of France."
          </div>
        </div>

        {/* ── Property tags y=1280 ── */}
        <div style={{
          position: 'absolute', top: 1290, left: 60, right: 60,
          display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
          opacity: tagsEnter,
        }}>
          {['STATELESS', 'SINGLE STEP', 'NO LOOP', 'NO MEMORY'].map((tag, i) => (
            <div key={i} style={{
              background: 'rgba(59,130,246,0.09)',
              border: '1.5px solid rgba(59,130,246,0.28)',
              borderRadius: 12, padding: '10px 22px',
              fontSize: 20, fontWeight: 800, color: COLORS.warm_blue,
              letterSpacing: '0.06em',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>
              {tag}
            </div>
          ))}
        </div>

        {/* ── Key insight card y=1420 ── */}
        <div style={{
          position: 'absolute', top: 1420, left: 80, right: 80,
          background: 'rgba(59,130,246,0.06)',
          border: '1.5px solid rgba(59,130,246,0.2)',
          borderRadius: 16, padding: '22px 32px',
          textAlign: 'center',
          opacity: tagsEnter,
        }}>
          <div style={{
            fontSize: 26, fontWeight: 700, color: COLORS.light_gray, lineHeight: 1.5,
          }}>
            The model does not <span style={{ color: COLORS.vibrant_red, fontWeight: 800 }}>observe</span> what
            happens to its output.
            <br/>It does not <span style={{ color: COLORS.vibrant_red, fontWeight: 800 }}>adapt</span>.
            It does not <span style={{ color: COLORS.vibrant_red, fontWeight: 800 }}>repeat</span>.
          </div>
        </div>

        <CaptionBar
          text="A model takes one input. It produces one output. That is it."
          opacity={enter} y={1700}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
