import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import * as Tone from 'tone';
import {
  RackDestination,
  RReverb,
  RFeedbackDelay,
  useNoteEmitter,
} from 'react-tone-rack';

import { Synth } from './Synth';

const PushButton: React.FC<
  React.PropsWithChildren<{ onClick: () => void }>
> = ({ onClick, children }) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-sm cursor-pointer select-none',
        'font-sans font-bold tracking-tighter uppercase',
        'border-egreen border-2 bg-egreen',
        'text-eblack',
        'active:bg-eblack active:border-ewhite active:text-ewhite'
      )}
      type="button"
      onClick={onClick}
    >
      <span className={clsx('flex scale-y-125')}>{children}</span>
    </button>
  );
};

const TestButton = () => {
  const emitNote = useNoteEmitter('exampleSynth');

  return (
    <PushButton
      onClick={() => {
        const testPattern = new Tone.Part<[string, string]>(
          (time, chord) => {
            for (const note of chord.split(/\s+/g)) {
              emitNote(time, note);
            }
          },
          [
            // Yamanote departure jingle
            ['0:0:0', 'G5'],
            ['0:0:2', 'G4'],
            ['0:1:0', 'A4'],
            ['0:1:2', 'G4'],
            ['0:2:0', 'C5'],
            ['0:2:2', 'G4'],
            ['0:3:0', 'E5'],
            ['0:3:2', 'G4'],

            ['1:0:0', 'G5 G6'],
            ['1:0:2', 'G4'],
            ['1:1:0', 'A4'],
            ['1:1:2', 'G4'],
            ['1:2:0', 'C5'],
            ['1:2:2', 'G4'],
            ['1:3:0', 'E5'],
            ['1:3:2', 'G4'],

            ['2:0:0', 'G5'],
            ['2:0:2', 'G4'],
            ['2:1:0', 'A4'],
            ['2:1:2', 'G4'],
            ['2:2:0', 'B4'],
            ['2:2:2', 'G4'],
            ['2:3:0', 'D5'],
            ['2:3:2', 'G4'],

            ['3:0:0', 'G5 G6'],
            ['3:0:2', 'G4'],
            ['3:1:0', 'A4'],
            ['3:1:2', 'G4'],
            ['3:2:0', 'B4'],
            ['3:2:2', 'G4'],
            ['3:3:0', 'D5'],
            ['3:3:2', 'G4'],

            ['4:0:0', 'G4 C5'],
            ['4:0:2', 'E4'],
            ['4:1:0', 'G4'],
            ['4:1:2', 'C5'],
            ['4:2:0', 'C5 E5'],
            ['4:2:2', 'C5'],
            ['4:3:0', 'E5'],
            ['4:3:2', 'G5'],

            ['5:0:0', 'G5 C6'],
          ]
        );
        // testPattern.loop = true;
        // testPattern.loopEnd = '2m';
        testPattern.start();

        // emitNote(Tone.immediate(), 'C4');
      }}
    >
      Play Note
    </PushButton>
  );
};

const TestMidi = () => {
  const emitNote = useNoteEmitter('exampleSynth');

  const [midiInputs, setMidiInputs] = useState<WebMidi.MIDIInput[] | null>(
    null
  );
  useEffect(() => {
    navigator.requestMIDIAccess().then(
      (result) => {
        setMidiInputs([...result.inputs.values()]);
      },
      (err) => console.log('MIDI init error', err)
    );
  }, []);

  const [selectedInput, setSelectedInput] = useState<WebMidi.MIDIInput | null>(
    null
  );
  useEffect(() => {
    if (!selectedInput) {
      return;
    }

    const messageListener = (message: WebMidi.MIDIMessageEvent) => {
      if (message.data[0] === 144) {
        // note on
        const note = Tone.Frequency(message.data[1], 'midi').toNote();
        console.log('midi', note);

        emitNote(Tone.immediate(), note);
      }
    };

    // listen in
    console.log('listening to MIDI:', selectedInput);
    selectedInput.addEventListener('midimessage', messageListener);

    return () => {
      console.log('cleaning up MIDI');
      selectedInput.removeEventListener('midimessage', messageListener as any);
    };
  }, [selectedInput, emitNote]);

  if (selectedInput) {
    return (
      <button
        type="button"
        onClick={() => {
          setSelectedInput(null);
        }}
      >
        Disconnect: {selectedInput.name}
      </button>
    );
  }

  return (
    <>
      {midiInputs &&
        midiInputs.map((input) => {
          return (
            <button
              key={input.id}
              type="button"
              onClick={() => {
                setSelectedInput(input);
              }}
            >
              Connect: {input.name}
            </button>
          );
        })}
    </>
  );
};

const Main = () => {
  return (
    <div className="App">
      <RackDestination>
        <TestMidi />
        <TestButton />

        <RReverb decay={3} wet={0.6}>
          <RFeedbackDelay wet={0.2} delayTime={0.3} feedback={0.1}>
            <Synth />
          </RFeedbackDelay>
        </RReverb>
      </RackDestination>
    </div>
  );
};

export default function App() {
  const [started, setStarted] = useState(false);

  const startCallback = () => {
    Tone.start().then(() => {
      Tone.context.lookAhead = 0; // interactive performance
      Tone.Transport.start();
      console.log('ToneJS started');

      setStarted(true);
    });
  };

  return (
    <div className="text-center">
      <h1 className="text-xl mb-4">React ToneJS E-Piano Experiment</h1>

      {started ? (
        <Main />
      ) : (
        <PushButton onClick={startCallback}>Initialize</PushButton>
      )}
    </div>
  );
}
