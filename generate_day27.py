import csv
import os
import math

csv_path = "src/Instructions/ai27_word_by_word_transcript.csv"
fps = 30

rows = []
with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(row)

# Group words into scenes (~5-10 words per scene, or by punctuation)
scenes = []
current_scene = []
for row in rows:
    current_scene.append(row)
    word = row['Word'].strip()
    if word.endswith('.') or word.endswith(',') or len(current_scene) >= 12:
        scenes.append(current_scene)
        current_scene = []

if current_scene:
    scenes.append(current_scene)

os.makedirs("src/Day27/frames", exist_ok=True)
os.makedirs("src/Day27/helpers", exist_ok=True)

# Generate timing.ts
timing_ts = """export const FPS = 30;

export const COLORS = {
  bg_paper:       '#F5F0E8',
  bg_black:       '#0D0D0D',
  electric_cyan:  '#00E5FF',
  warm_blue:      '#3B82F6',
  cool_silver:    '#C8D0D4',
} as const;

export const SCENE_TIMING = {\n"""

for i, scene in enumerate(scenes):
    start_time = float(scene[0]['Start Time (s)'])
    end_time = float(scene[-1]['End Time (s)'])
    # Need padding to avoid zero duration or gaps
    start_frame = int(start_time * fps)
    end_frame = int(end_time * fps) + 15 # Give it half a second extra padding to overlap or transition
    if i < len(scenes) - 1:
        next_start_time = float(scenes[i+1][0]['Start Time (s)'])
        end_frame = int(next_start_time * fps)

    dur = end_frame - start_frame
    if dur < 1: dur = 30
    
    timing_ts += f"  s{i+1:02d}: {{ from: {start_frame}, duration: {dur} }},\n"

timing_ts += "};\n"

with open("src/Day27/helpers/timing.ts", "w") as f:
    f.write(timing_ts)


# Generate Scene Components
scene_imports = []
scene_tags = []

for i, scene in enumerate(scenes):
    s_idx = f"{i+1:02d}"
    comp_name = f"Scene{s_idx}"
    
    start_time = float(scene[0]['Start Time (s)'])
    end_time = float(scene[-1]['End Time (s)'])
    words_text = " ".join([w['Word'].replace('"', '\\"') for w in scene])
    
    scene_code = f"""import React from 'react';
import {{ AbsoluteFill, useCurrentFrame, interpolate, spring }} from 'remotion';
import {{ COLORS, FPS }} from '../helpers/timing';

export const {comp_name}: React.FC = () => {{
  const frame = useCurrentFrame();
  const opacity = interpolate(Math.min(frame, 15), [0, 15], [0, 1], {{ extrapolateRight: 'clamp' }});
  
  const yOffset = spring({{
    frame,
    fps: FPS,
    config: {{ damping: 12, stiffness: 90 }}
  }});

  return (
    <AbsoluteFill style={{{{
      backgroundColor: COLORS.bg_paper,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      opacity
    }}}}>
      <h1 style={{{{
        color: COLORS.bg_black,
        fontSize: '80px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '0 80px',
        transform: `translateY(${{(1 - yOffset) * 50}}px)`
      }}}}>
        {words_text}
      </h1>
      <div style={{{{
          marginTop: '40px',
          width: '200px',
          height: '10px',
          backgroundColor: COLORS.electric_cyan,
          borderRadius: '5px',
          transform: `scaleX(${{yOffset}})`
      }} />
    </AbsoluteFill>
  );
}};
"""
    with open(f"src/Day27/frames/{comp_name}.tsx", "w") as f:
        f.write(scene_code)
    
    scene_imports.append(f"import {{ {comp_name} }} from './frames/{comp_name}';")
    scene_tags.append(f"""        <Sequence from={{SCENE_TIMING.s{s_idx}.from}} durationInFrames={{SCENE_TIMING.s{s_idx}.duration}}}}>
          <{comp_name} />
        </Sequence>""")


max_end_time = float(rows[-1]['End Time (s)'])
total_frames = int(max_end_time * fps) + 60

main_scene = f"""import React from 'react';
import {{ AbsoluteFill, Sequence }} from 'remotion';
import {{ SCENE_TIMING }} from './helpers/timing';

{chr(10).join(scene_imports)}

export const Day27Scene: React.FC = () => {{
  return (
    <AbsoluteFill style={{{{ backgroundColor: '#0D0D0D' }}}}>
{chr(10).join(scene_tags)}
    </AbsoluteFill>
  );
}};
"""
with open("src/Day27/Scene.tsx", "w") as f:
    f.write(main_scene)

print("Generated Day 27 successfully! Total frames:", total_frames)
