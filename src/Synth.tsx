import * as Tone from 'tone';
import { createRackableInstrument, RecursivePartial } from 'react-tone-rack';

const RFMSynth = createRackableInstrument<
  RecursivePartial<Tone.FMSynthOptions>
>(Tone.MonoSynth);

export const Synth: React.FC = () => {
  return (
    <RFMSynth
      notes="exampleSynth"
      duration="4n"
      volume={-1}
      modulationIndex={0.3}
    />
  );
};
