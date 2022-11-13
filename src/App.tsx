import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { RackDestination, RReverb, useNoteEmitter } from 'react-tone-rack';

import { Synth } from './Synth';

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
          <Synth />
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
