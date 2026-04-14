/**
 * Scene01_ScrollTimeline
 * Duration: 150 frames = 5s (SILENT — no audio plays during this scene)
 * Shows: full day list from architecture file, scrolls to current day 27
 * Shows: "DAY 27 / 120" progress badge (top-left)
 * Theme: Dark #1D1D1C + grid + series accent color #76ABAE
 * Font: Galaxie Copernicus ExtraBold
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { DarkBackground } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

interface Props {
  currentDay: number;
  totalDays: number;
  seriesTitle: string;
}

const ALL_DAYS = [
  { day: 1, topic: "What Is Intelligence?" },
  { day: 2, topic: "What Is a Decision?" },
  { day: 3, topic: "What Is Information?" },
  { day: 4, topic: "What Is a Model?" },
  { day: 5, topic: "What Is a Prediction?" },
  { day: 6, topic: "What Is Learning?" },
  { day: 7, topic: "What Is Language?" },
  { day: 8, topic: "Why Language Is Hard for Machines" },
  { day: 9, topic: "What Is a Neural Network?" },
  { day: 10, topic: "What Is a Large Language Model?" },
  { day: 11, topic: "What Is a Token?" },
  { day: 12, topic: "What Is a Context Window?" },
  { day: 13, topic: "What Is Attention?" },
  { day: 14, topic: "What Is Temperature?" },
  { day: 15, topic: "What Is a Prompt?" },
  { day: 16, topic: "What Is a System Prompt?" },
  { day: 17, topic: "What Is In-Context Learning?" },
  { day: 18, topic: "Zero-Shot vs Few-Shot" },
  { day: 19, topic: "What Is Hallucination?" },
  { day: 20, topic: "What Is Grounding?" },
  { day: 21, topic: "What Is a Completion?" },
  { day: 22, topic: "What Is Structured Output?" },
  { day: 23, topic: "A Model Is Not an Agent" },
  { day: 24, topic: "What Is the Agent Loop?" },
  { day: 25, topic: "What Is an Action?" },
  { day: 26, topic: "What Is an Observation?" },
  { day: 27, topic: "What Is a Tool?" },
  { day: 28, topic: "What Is Tool Calling?" },
  { day: 29, topic: "What Is an Agent Runtime?" },
  { day: 30, topic: "What Is a Task?" },
  { day: 31, topic: "What Is Autonomy?" },
  { day: 32, topic: "What Is a Trajectory?" },
  { day: 33, topic: "What Is a Step?" },
  { day: 34, topic: "What Is Task Decomposition?" },
  { day: 35, topic: "Agent vs. Pipeline" },
  { day: 36, topic: "Why Agents Need Memory" },
  { day: 37, topic: "What Is In-Context Memory?" },
  { day: 38, topic: "What Is External Memory?" },
  { day: 39, topic: "What Is a Vector?" },
  { day: 40, topic: "What Is Embedding?" },
  { day: 41, topic: "What Is a Vector Database?" },
  { day: 42, topic: "What Is Semantic Search?" },
  { day: 43, topic: "What Is RAG?" },
  { day: 44, topic: "What Is Chunking?" },
  { day: 45, topic: "What Is the Retrieval Precision Problem?" },
  { day: 46, topic: "What Is Chunking Strategy?" },
  { day: 47, topic: "What Is Reranking?" },
  { day: 48, topic: "What Is Episodic Memory?" },
  { day: 49, topic: "What Is Semantic Memory?" },
  { day: 50, topic: "What Is Working Memory?" },
  { day: 51, topic: "What Is Prompt Engineering?" },
  { day: 52, topic: "What Is Role Prompting?" },
  { day: 53, topic: "What Is Chain of Thought?" },
  { day: 54, topic: "Why Chain of Thought Works" },
  { day: 55, topic: "What Is Zero-Shot Chain of Thought?" },
  { day: 56, topic: "What Is Few-Shot Chain of Thought?" },
  { day: 57, topic: "What Is ReAct?" },
  { day: 58, topic: "What Is Self-Consistency?" },
  { day: 59, topic: "What Is Reflection?" },
  { day: 60, topic: "What Is a Scratchpad?" },
  { day: 61, topic: "What Is Prompt Injection?" },
  { day: 62, topic: "What Is an Instruction Hierarchy?" },
  { day: 63, topic: "What Is a Function Signature?" },
  { day: 64, topic: "What Is a Tool Schema?" },
  { day: 65, topic: "What Is Tool Selection?" },
  { day: 66, topic: "What Is Parallel Tool Use?" },
  { day: 67, topic: "What Is Tool Chaining?" },
  { day: 68, topic: "What Is Error Handling in Tool Use?" },
  { day: 69, topic: "What Is a Code Interpreter Tool?" },
  { day: 70, topic: "What Is a Web Search Tool?" },
  { day: 71, topic: "What Is a Browser Tool?" },
  { day: 72, topic: "What Is a File System Tool?" },
  { day: 73, topic: "What Is a Database Tool?" },
  { day: 74, topic: "What Is Tool Safety?" },
  { day: 75, topic: "What Is Tool Versioning?" },
  { day: 76, topic: "What Is Planning?" },
  { day: 77, topic: "What Is a Plan?" },
  { day: 78, topic: "What Is Plan-and-Execute?" },
  { day: 79, topic: "What Is Dynamic Replanning?" },
  { day: 80, topic: "What Is a Goal Hierarchy?" },
  { day: 81, topic: "What Is Backtracking in Planning?" },
  { day: 82, topic: "What Is Task Parallelism?" },
  { day: 83, topic: "What Is a Dependency Graph?" },
  { day: 84, topic: "What Is Planning Horizon?" },
  { day: 85, topic: "What Is LLM-as-Planner?" },
  { day: 86, topic: "What Is the Explore-Exploit Tradeoff?" },
  { day: 87, topic: "What Is Uncertainty in Planning?" },
  { day: 88, topic: "Why One Agent Is Not Enough" },
  { day: 89, topic: "What Is a Multi-Agent System?" },
  { day: 90, topic: "What Is an Orchestrator Agent?" },
  { day: 91, topic: "What Is a Subagent?" },
  { day: 92, topic: "What Is Agent Communication?" },
  { day: 93, topic: "What Is a Shared Memory System?" },
  { day: 94, topic: "What Is Agent Specialization?" },
  { day: 95, topic: "What Is the Orchestrator Pattern?" },
  { day: 96, topic: "What Is the Peer-to-Peer Pattern?" },
  { day: 97, topic: "What Is a Critic Agent?" },
  { day: 98, topic: "What Is the Debate Pattern?" },
  { day: 99, topic: "What Is Context Isolation?" },
  { day: 100, topic: "What Is Agent State Management?" },
  { day: 101, topic: "What Is the MapReduce Pattern?" },
  { day: 102, topic: "What Is a Swarm?" },
  { day: 103, topic: "What Is Agent Coordination Failure?" },
  { day: 104, topic: "What Is Evaluation?" },
  { day: 105, topic: "What Is a Benchmark?" },
  { day: 106, topic: "What Is Trajectory Evaluation?" },
  { day: 107, topic: "What Is an LLM Judge?" },
  { day: 108, topic: "What Is Regression Testing?" },
  { day: 109, topic: "What Is Latency Evaluation?" },
  { day: 110, topic: "What Is Cost Evaluation?" },
  { day: 111, topic: "What Is Agent Safety?" },
  { day: 112, topic: "What Is Least Privilege?" },
  { day: 113, topic: "What Is a Guardrail?" },
  { day: 114, topic: "What Is a Human-in-the-Loop Checkpoint?" },
  { day: 115, topic: "What Is Prompt Injection Defense?" },
  { day: 116, topic: "What Is an Audit Log?" },
  { day: 117, topic: "What Is Sandboxing?" },
  { day: 118, topic: "What Is the Reversibility Principle?" },
  { day: 119, topic: "What Is an Agent Framework?" },
  { day: 120, topic: "What Is a Production Agentic System?" },
];

const ROW_H = 220;
const VISIBLE = 6;
const VIEW_H = ROW_H * VISIBLE;
const VIEW_Y = Math.round((1920 - VIEW_H) / 2);

export const Scene01_ScrollTimeline: React.FC<Props> = ({ currentDay, totalDays, seriesTitle }) => {
  const frame = useCurrentFrame();

  const targetScrollY = -(currentDay - 1 - Math.floor(VISIBLE / 2) + 0.5) * ROW_H;
  const clampedTarget = Math.min(0, Math.max(-(ALL_DAYS.length - VISIBLE) * ROW_H, targetScrollY));

  const scrollY = interpolate(frame, [0, 120], [0, clampedTarget], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const sceneFade = interpolate(frame, [130, 149], [1, 0], { extrapolateRight: 'clamp' });
  const headerEnter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const progressWidth = (currentDay / totalDays) * 960;
  const progressEnter = interpolate(frame, [10, 60], [0, progressWidth], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: sceneFade }} width={1080} height={1920}>
        <DarkBackground />

        {/* ── DAY N / TOTAL progress badge — top-left ─────────────────────── */}
        <g opacity={headerEnter}>
          <text
            x={60} y={100}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.05em"
          >
            DAY {currentDay}
          </text>
          <text
            x={60 + 40 * (String(currentDay).length * 0.65 + 3.5)}
            y={100}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}
          >
            / {totalDays}
          </text>
          {/* Progress track */}
          <rect x={60} y={120} width={960} height={6} rx={3} fill="rgba(255,255,255,0.08)" />
          {/* Progress fill */}
          <rect x={60} y={120} width={progressEnter} height={6} rx={3} fill={COLORS.accent} opacity={0.9} />
        </g>

        {/* Series title — centered, fixed */}
        <text
          x={540} y={190}
          textAnchor="middle"
          fontFamily={FONT} fontSize={26} fontWeight={800}
          fill={COLORS.text_muted} letterSpacing="0.18em"
          opacity={headerEnter * 0.8}
        >
          {seriesTitle}
        </text>

        {/* Clip scrolling rows */}
        <defs>
          <clipPath id={`scrollClip-d${currentDay}`}>
            <rect x={0} y={VIEW_Y} width={1080} height={VIEW_H} />
          </clipPath>
        </defs>

        {/* Fade masks at scroll window edges — use bg_primary fill */}
        <rect x={0} y={VIEW_Y} width={1080} height={60} fill={COLORS.bg_primary} opacity={0.8} />
        <rect x={0} y={VIEW_Y + VIEW_H - 60} width={1080} height={60} fill={COLORS.bg_primary} opacity={0.8} />

        {/* Scrolling rows */}
        <g clipPath={`url(#scrollClip-d${currentDay})`} transform={`translate(0, ${VIEW_Y + scrollY})`}>
          {ALL_DAYS.map((d, idx) => {
            const isCurrent = d.day === currentDay;
            const rowY = idx * ROW_H;
            return (
              <g key={d.day}>
                {isCurrent && (
                  <rect x={60} y={rowY + 12} width={960} height={ROW_H - 24} rx={16}
                    fill={COLORS.accent} opacity={0.08} />
                )}
                {isCurrent && (
                  <rect x={60} y={rowY + 30} width={6} height={ROW_H - 60} rx={3} fill={COLORS.accent} />
                )}
                <text
                  x={isCurrent ? 90 : 80} y={rowY + 88}
                  fontFamily={FONT}
                  fontSize={isCurrent ? 56 : 40} fontWeight={800}
                  fill={isCurrent ? COLORS.accent : COLORS.text_muted}
                  opacity={isCurrent ? 1 : 0.4}
                >
                  {`DAY ${d.day}`}
                </text>
                <text
                  x={isCurrent ? 90 : 80} y={rowY + 148}
                  fontFamily={FONT}
                  fontSize={isCurrent ? 36 : 28} fontWeight={800}
                  fill={isCurrent ? COLORS.white : COLORS.text_muted}
                  opacity={isCurrent ? 0.9 : 0.35}
                >
                  {d.topic}
                </text>
                <line x1={60} y1={rowY + ROW_H - 1} x2={1020} y2={rowY + ROW_H - 1}
                  stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
