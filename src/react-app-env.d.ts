/// <reference types="react-scripts" />
interface Window {
  webkitAudioContext: typeof AudioContext
  localStream: typeof AudioStream
}

declare module 'audio-recorder-js';