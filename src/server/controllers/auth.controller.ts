import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import db from "./../models";
import { SECRET_KEY } from "./../config/auth.config";
import { saveFacialEmbedding, verifyFacialEmbedding } from "./../services/dna-gate.services";

const UserSchema = db.user;

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, image } = req.body;

    const exists = await UserSchema.exists({email: email});
    
    // check the user exists
    if (exists) {
        res.status(400).send({ message: 'User already exists.' });
        return;
    }

    //const faceId = await fe
    const {biometricId, error} = await saveFacialEmbedding(image);
    if (error) {
        res.status(400).send({ message: error });
        return;
    }

    bcrypt.genSalt(10, function (err: any, salt: any) {
        if (err) return next(err);
        bcrypt.hash(password, salt, function (err: any, hash: any) {

            const newUser = new UserSchema({
                name: name,
                password: hash,
                email: email,
                biometricId: biometricId
            });

            newUser.save();
            res.send({ message: "User was registered successfully!" });
        });
    });
}

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    const {username, password} = req.body;

    UserSchema.findOne({ email: username }, function (err: any, user: any) {
        if (err) return res.status(500).send({ message: err });
        if (!user) return res.status(404).send({ message: "Incorrect email!" });

        bcrypt.compare(password, user.password, function(err: any, result: any) {
            if (err) res.status(500).send({ message: err });
            if (result == false) return res.status(401).send({
                accessToken: null,
                message: "Incorrect Password!"
              });

              const token = jwt.sign({ email: user.email }, SECRET_KEY, {
                expiresIn: 86400 // 24 hours
              });

              res.status(200).send({
                access_token: token,
                token_type: "bearer"
              });
        });
    });
}

export const signinwithface = async (req: Request, res: Response, next: NextFunction) => {
    const {username, image} = req.body;

    UserSchema.findOne({ email: username }, async function (err: any, user: any) {
        if (err) return res.status(500).send({ message: err });
        if (!user) return res.status(404).send({ message: "Incorrect email!" });

        const {match, error} = await verifyFacialEmbedding(image, user.biometricId);
        if (error) {
            res.status(400).send({ message: error });
            return;
        }

        if (!match) {
            return res.status(401).send({
                accessToken: null,
                message: "Unrecognized person"
              });
        }

        const token = jwt.sign({ email: user.email }, SECRET_KEY, {
            expiresIn: 86400 // 24 hours
          });

          res.status(200).send({
            access_token: token,
            token_type: "bearer"
          });
        
    });
}

export const checkFacialIdentity = async (req: any, res: any, next: NextFunction) => {
    const { userEmail } = req;
    const { image } = req.body;
    
    UserSchema.findOne({ email: userEmail }, async function (err: any, user: any) {
        if (err) return res.status(500).send({ message: err });
        if (!user) return res.status(404).send({ message: "Incorrect email!" });

        const {match, error} = await verifyFacialEmbedding(image, user.biometricId);
        if (error) {
            res.status(400).send({ message: error });
            return;
        }

        if (!match) {
            return res.status(401).send({
                accessToken: null,
                message: "Unrecognized person"
              });
        }

        res.status(204).send();  
    });
}