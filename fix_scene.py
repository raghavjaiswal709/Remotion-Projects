import os

scenes = [
    "Scene01_DayCard", "Scene02_SnapZoomPunch", "Scene03_SeriesAnchor", "Scene04_LastTime",
    "Scene05_TheClaim", "Scene06_OneInput", "Scene07_OneStep", "Scene08_Done",
    "Scene09_PromptCompletion", "Scene10_AgentArchitecturallyDifferent", "Scene11_AgentInputOutputObserve",
    "Scene12_ObservationLoopForms", "Scene13_AndItRunsAgain", "Scene14_LoopIsDefinition",
    "Scene15_ModelAnswersAgentActs", "Scene16_ModelIsFrozen", "Scene17_LoopNotFeature",
    "Scene18_WithoutLoopCalc", "Scene19_WithLoop", "Scene20_NavigatingWorld",
    "Scene21_LoopIsEverything", "Scene22_NextAgentLoop", "Scene23_DayCountFlash",
    "Scene24_SeriesCard", "Scene25_FadeToBlack"
]

out = """import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import { WordByWordSubtitle } from '../helpers/WordByWordSubtitle';
import * as T from './helpers/timing';

"""

for s in scenes:
    out += f"import {{ {s} }} from './frames/{s}';\n"

out += """
export const Day23Scene: React.FC = () => {
\treturn (
\t\t<AbsoluteFill style={{ backgroundColor: '#000000' }}>
\t\t\t<Sequence from={0} durationInFrames={T.TOTAL_FRAMES}>
\t\t\t\t<Audio src={staticFile(T.AUDIO_FILENAME)} startFrom={0} endAt={T.TOTAL_FRAMES - T.AUDIO_OFFSET_FRAMES} volume={1} />
\t\t\t</Sequence>
"""

# Now write sequence tags
for idx, s in enumerate(scenes):
    i = str(idx+1).zfill(2)
    out += f"\t\t\t<Sequence from={{T.SCENE_{i}_IN}} durationInFrames={{T.SCENE_{i}_OUT - T.SCENE_{i}_IN}}>\n"
    out += f"\t\t\t\t<{s} />\n"
    out += f"\t\t\t</Sequence>\n"

out += """\t\t</AbsoluteFill>
\t);
};
"""

with open("src/Day23/Scene.tsx", "w") as f:
    f.write(out)

