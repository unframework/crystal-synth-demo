import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import {
  RackDestination,
  RPolySynth,
  RReverb,
  useNoteEmitter,
} from 'react-tone-rack';

import './App.css';

const TestButton = () => {
  const emitNote = useNoteEmitter('exampleSynth');

  return (
    <button
      type="button"
      onClick={() => {
        emitNote(Tone.immediate(), 'C4');
      }}
    >
      Play Note
    </button>
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

        <RReverb wet={0.5}>
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
    <div>
      <h1>React ToneJS Sandbox</h1>

      {started ? (
        <Main />
      ) : (
        <button type="button" onClick={() => startCallback()}>
          Initialize
        </button>
      )}
    </div>
  );
}
