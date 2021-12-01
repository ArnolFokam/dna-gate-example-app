import { DNA_GATE_API_KEY,  DNA_GATE_URL } from "./../config/dna_gate.config";

import got from "got";
import { FormData, Blob } from 'formdata-node';
import {FormDataEncoder} from "form-data-encoder";
import { Readable } from "stream";

global.atob = require("atob");

function b64toBlob(dataURI: string, type: string = 'image/jpeg') {
    
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: type });
}

export const saveBiometricEmbedding = async (face?: string | null, recording?: string | null) => {

    const form = new FormData();

    if(face) {
        form.set("face_image", b64toBlob(face), "face.jpeg");
    }

    if (recording) {
        form.set("voice_recording", b64toBlob(recording, 'audio/wav'), "voice.wav");
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
    const form = new FormData();
    form.set("face_image", b64toBlob(face), "face.jpeg");

    const encoder = new FormDataEncoder(form)
    return await got.post(DNA_GATE_URL! + "/api/biometrics/info/verify/face/" + faceId,
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