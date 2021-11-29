import {Application} from "express";
import { getCurrentUser } from "./../controllers/users.controller";
import { verifyToken } from "./../middlewares/authJwt";

export const routes = (app: Application) => {
    app.get(
        "/api/users/me",
        [
            verifyToken
        ],
        getCurrentUser
    );
}