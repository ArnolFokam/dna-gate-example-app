import { NextFunction } from "express";
import jwt from "jsonwebtoken";

import { SECRET_KEY } from "./../config/auth.config";

export const verifyToken = (req: any, res: any, next: NextFunction) => {
  if (req.headers["authorization"]) {
    let token: string = req.headers["authorization"]!.split(' ')[1];

    if (!token) {
      res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
      if (err) {
        res.status(401).send({ message: "Unauthorized!" });
      }
      req.userEmail = decoded.email;
      next();
    });
  } else {
    res.status(403).send({ message: "No token provided!" });
  }
};