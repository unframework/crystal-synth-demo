import * as Tone from 'tone';
import { createRackableInstrument, RecursivePartial } from 'react-tone-rack';

const RFMSynth = createRackableInstrument<
  RecursivePartial<Tone.FMSynthOptions>
>(Tone.FMSynth);

export const Synth: React.FC = () => {
  return (
    <RFMSynth
      notes="exampleSynth"
      duration="4n"
      volume={-1}
      modulationIndex={50}
      harmonicity={18}
      modulationEnvelope={{
        attack: 0,
        decay: 0,
        sustain: 1,
        release: 0,
      }}
      envelope={{
        attack: 0.01,
        decay: 0.5,
        sustain: 0,
        release: 0,
      }}
    />
  );
};
