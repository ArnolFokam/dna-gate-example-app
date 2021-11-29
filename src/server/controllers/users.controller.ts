import { NextFunction } from "express";

import db from "./../models";

const UserSchema = db.user;

export const getCurrentUser = async (req: any, res: any, next: NextFunction) => {
    const email = req.userEmail;

    UserSchema.findOne({ email: email }, (err: any, user: any) => {
        if (err) res.status(500).send({ message: err });
        if (!user) res.status(404).send({ message: "Unknown user" });

        res.status(200).send({
            name: user.name,
            email: user.email
        });
    });

}