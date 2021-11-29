import { Application } from "express";
import {  routes as authroutes } from "./auth.routes";
import {  routes as paymentoutes } from "./payment.routes";
import {  routes as usersroutes } from "./users.routes";

const routes = (app: Application) => {
    authroutes(app);
    usersroutes(app);
    paymentoutes(app);
}

export default routes;