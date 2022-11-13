import * as Tone from 'tone';
import { RPolySynth } from 'react-tone-rack';

export const Synth: React.FC = () => {
  return (
    <RPolySynth
      notes="exampleSynth"
      duration="4n"
      voice={Tone.MonoSynth}
      volume={-1}
      options={{
        oscillator: {
          type: 'fatsawtooth',
          count: 3,
          spread: 10,
        },
        envelope: {
          attack: 0.05,
          decay: 0.5,
          sustain: 0.9,
          release: 0.1,
        },
        filter: {
          type: 'bandpass',
          Q: 1.8,
        },
        filterEnvelope: {
          baseFrequency: 'C3',
          octaves: 4,
          attack: 0.01,
          decay: 0.3,
          sustain: 0,
          release: 0.2,
        },
      }}
    />
  );
};
