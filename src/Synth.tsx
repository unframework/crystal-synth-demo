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
        volume={-7} // quieter than tonebar
        voice={Tone.FMSynth}
        options={{
          modulationIndex: 30,
          harmonicity: 18, // high ratio to create lots of metallic overtones
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
            release: 0.05, // softer cut-off just in case
          },
        }}
      />

      <RPolySimpleSynth
        notes="exampleSynth"
        duration="4n"
        volume={-6}
        voice={Tone.Synth}
        options={{
          oscillator: {
            type: 'sine', // tonebar vibration
          },
          envelope: {
            attack: 0.02, // slightly slower start
            decay: 0.3,
            sustain: 0.5,
            release: 1.5, // residual vibration
          },
        }}
      />
    </>
  );
};
