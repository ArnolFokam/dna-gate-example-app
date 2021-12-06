import React, { useContext, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/solid";
import Recorder from 'audio-recorder-js';
import Countdown from "react-countdown";
import NotyfContext from "src/client/config/NotyfContext";

interface VoiceRecModalProps {
  setHandleCloseModal: Function;
  setValidateRecording: Function;
  title?: string;
};

const VoiceRecModal = ({ setHandleCloseModal, setValidateRecording, title }: VoiceRecModalProps) => {

  const notyf = useContext(NotyfContext);

  const [blob, setBlob] = useState<Blob>();
  const [blobUrl, setBlobUrl] = useState<string>();
  const [audioRecorder, setAudioRecorder] = useState<typeof Recorder>();
  const [recording, setRecording] = useState<boolean>();
  const clockRef = useRef<Countdown>(null);
  const handleStartCountdown = () => clockRef.current?.start();
  const handleStopCountdown = () => clockRef.current?.stop();

  const blobToBase64 = async (blob: Blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  const startRecording = async () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const recorder = new Recorder(audioContext, {
      numChannels: 1,
      sampleRate: 16000,
      sampleBits: 8,
      bufferLen: 256,
      mimeType: 'audio/wav'
    });

    await navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        recorder.init(stream);
      })
      .catch(() => notyf.error('Uh oh... unable to get stream...'));
    await recorder.start().then(() => {
      handleStartCountdown();
      setRecording(true);
    });
    setAudioRecorder(recorder);
  }

  const stopRecording = async () => {
    audioRecorder.stream.getTracks().forEach((track: any) => track.stop());
    await audioRecorder.stop().then(({ blob }: any) => {
      setBlob(blob);
      handleStopCountdown();
      setRecording(false);
      setBlobUrl(window.URL.createObjectURL(blob));
    }).catch(() => (undefined))
  }

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  return (
    <div id="bio-modal" className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        {/*This element is to trick the browser into centering the modal contents.*/}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-xl text-center leading-6 font-medium text-gray-900" id="modal-title">
                {title || "Voice Authentication"}
              </h3>
              <div className="pt-8 pb-2">
                <p>
                  Please make sure that:
                </p>
                <ul className="list-disc list-inside">
                  <li>You are in a quite room.</li>
                  <li>You speak audibly enough.</li>
                </ul>
              </div>
              <div className="w-full">
                <div className="py-5 flex-col flex justify-center items-center">
                  <h3 className="text-center ">Pronounce this 👉 <b>Merry Christmass</b></h3>
                  <div className="py-5 flex-col items-center justify-center align-center text-center">
                    <button className={`relative w-24 h-24 rounded-full bg-white focus:outline-none`} onClick={toggleRecording}>
                      {recording && <span className="animate-ping absolute left-0 h-full w-full rounded-full bg-red-500 opacity-75"></span>}
                      {recording ? <PauseIcon className="text-red-500 " /> : <PlayIcon className="text-blue-500" />}
                    </button>
                    <Countdown
                      date={Date.now() + 2000}
                      zeroPadTime={2}
                      autoStart={false}
                      ref={clockRef}
                      renderer={({ seconds, completed }) => {
                        if (completed) {
                          stopRecording();
                          <div>00:02</div>
                        }
                        return <div>00:0{seconds}</div>;
                      }} />
                    <audio controls src={blobUrl} className={`pt-3 pointer-events-${blobUrl ? 'auto' : 'none'} opacity-${blobUrl ? '100' : '30'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              disabled={!blob}
              onClick={() => setValidateRecording(blobToBase64(blob!))}
              type="button" className="disabled:opacity-50 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
              Validate Recording
            </button>
            <button type="button"
              onClick={() => setHandleCloseModal()}
              className=" mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceRecModal;