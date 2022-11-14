import * as Tone from 'tone';
import {
  RPolySynth,
  createRackableInstrument,
  RecursivePartial,
} from 'react-tone-rack';

const RPolyFMSynth = createRackableInstrument<
  RecursivePartial<Tone.PolySynthOptions<Tone.FMSynth>>
>(
  Tone.PolySynth as any // @todo
);

const RPolySimpleSynth = createRackableInstrument<
  RecursivePartial<Tone.PolySynthOptions<Tone.Synth>>
>(
  Tone.PolySynth as any // @todo
);

const RFMSynth = createRackableInstrument<
  RecursivePartial<Tone.FMSynthOptions>
>(Tone.FMSynth);

const RSynth = createRackableInstrument<RecursivePartial<Tone.SynthOptions>>(
  Tone.Synth
);

export const Synth: React.FC = () => {
  return (
    <>
      <RPolyFMSynth
        notes="exampleSynth"
        duration="4n"
        volume={-3}
        voice={Tone.FMSynth}
        options={{
          modulationIndex: 30,
          harmonicity: 18,
          modulationEnvelope: {
            attack: 0,
            decay: 0,
            sustain: 1,
            release: 0,
          },
          envelope: {
            attack: 0.01,
            decay: 0.5,
            sustain: 0,
            release: 0,
          },
        }}
      />

      <RPolySimpleSynth
        notes="exampleSynth"
        duration="4n"
        volume={-2}
        voice={Tone.Synth}
        options={{
          oscillator: {
            type: 'sine', // tonebar vibration
          },
          envelope: {
            attack: 0.02, // slightly slower start
            decay: 0.5, // very slow decay
            sustain: 0.2,
            release: 0.3,
          },
        }}
      />
    </>
  );
};
