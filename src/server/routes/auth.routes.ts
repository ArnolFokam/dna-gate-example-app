import { createPaymentIntent } from "./../controllers/payment.controller";
import { Request, Response, NextFunction, Application } from "express";

import { signin, signup, signinWithFace, checkFacialIdentity, checkVocalIdentity, signinWithVoice } from "./../controllers/auth.controller";
import { checkDuplicateEmail } from "./../middlewares/verifySignUp";
import { verifyToken } from "./../middlewares/authJwt";

export const routes = (app: Application) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            checkDuplicateEmail
        ],
        signup
    );

    app.post(
        "/api/creat-payment-intent",
        createPaymentIntent
    );


    // authentication routes
    app.post("/api/auth/signin/pass", signin);
    app.post("/api/auth/signin/face", signinWithFace);
    app.post("/api/auth/signin/voice", signinWithVoice);

    // biometrics verification
    app.post("/api/auth/check/face", [verifyToken], checkFacialIdentity);
    app.post("/api/auth/check/voice", [verifyToken], checkVocalIdentity);
}