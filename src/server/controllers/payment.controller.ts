import Stripe from "stripe";
import { NextFunction } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2020-08-27',
});

export const createPaymentIntent = async (req: any, res: any, next: NextFunction) => {
    const { paymentMethodType, amount } = req.body;
    
    try {
        const paymentIntent =  await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: [paymentMethodType]
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch(e: any) {
        res.status(400).json({error: {
            message: e.message
        }});
    }
}