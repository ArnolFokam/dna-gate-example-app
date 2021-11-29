import { Request, Response, NextFunction, ErrorRequestHandler  } from "express";
import db from "./../models";

const UserSchema = db.user;

export const checkDuplicateEmail = (req: Request, res: Response, next: NextFunction) => {

    UserSchema.findOne({
        email: req.body.email
    }).exec((err: any, user: any) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        
        if (user) {
            res.status(400).send({
                message: "User already exists!"
            });
            return;
        }

        next();
    })
}