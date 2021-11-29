import { createPaymentIntent } from "./../controllers/payment.controller";
import {Application} from "express";
import { verifyToken } from "./../middlewares/authJwt";

export const routes = (app: Application) => {
    app.post(
        "/api/creat-payment-intent",
        [verifyToken],
        createPaymentIntent
    );
}