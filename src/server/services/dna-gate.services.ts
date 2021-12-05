import { DNA_GATE_API_KEY,  DNA_GATE_URL } from "./../config/dna_gate.config";

import got from "got";
import { FormData, Blob } from 'formdata-node';
import {FormDataEncoder} from "form-data-encoder";
import { Readable } from "stream";

export const Biometrics = {
    voice: "voice",
    face: "face"
}

global.atob = require("atob");

function b64toBlob(dataURI: string) {
    var arr = dataURI.split(','),
        mime = arr[0].match(/:(.*?);/)![1],
        byteString = atob(arr[1]),
        ab = new ArrayBuffer(byteString.length),
        ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mime });
}

export const saveBiometricEmbedding = async (face?: string | null, recording?: string | null) => {

    const form = new FormData();

    if(face) {
        form.set("face_image", b64toBlob(face), "face.jpeg");
    }

    if (recording) {
        form.set("voice_recording", b64toBlob(recording), "voice.wav");
    }

    const encoder = new FormDataEncoder(form)
    return await got.post(DNA_GATE_URL! + "/api/biometrics/info/",
        {
            body: Readable.from(encoder),
            headers: {
                'content-type': encoder.contentType,
                'accept-encoding': 'application/json',
                'Api-Key': DNA_GATE_API_KEY!,
            },
            responseType: 'json'
        })
        .then((res: any) => {
            return {
                "biometricId": res.body["id"],
                "error": null
        };
        }).catch(err => {
            return {
                "biometricId": null,
                "error": (err.response && err.response.body) ? err.response.body.detail : "Unknown error"
            };
        });
}

export const verifyFacialEmbedding = async (face: string, faceId: string) => {
    return verifyEmbedding(Biometrics.face, face, faceId);
}

export const verifyVocalEmbedding = async (voice: string, voiceId: string) => {
    return verifyEmbedding(Biometrics.voice, voice, voiceId);
}

export const verifyEmbedding = async (type: string, bio: string, bioId: string) => {
    const form = new FormData();
    if (type === Biometrics.face) {
        form.set("face_image", b64toBlob(bio), "face.jpeg");
    } else if (type === Biometrics.voice){
        form.set("voice_recording", b64toBlob(bio), "voice.wav");
    }

    const encoder = new FormDataEncoder(form)
    return await got.post(DNA_GATE_URL! +  `/api/biometrics/info/verify/${type}/` + bioId,
        {
            body: Readable.from(encoder),
            headers: {
                'content-type': encoder.contentType,
                'accept-encoding': 'application/json',
                'Api-Key': DNA_GATE_API_KEY!,
            },
            responseType: 'json'
        })
        .then((res: any) => {
            return {
                "match": res.body["match"],
                "error": null
        };
        }).catch(err => {
            return {
                "match": null,
                "error": (err.response && err.response.body) ? err.response.body.detail : "Unknown error"
            };
        });
}