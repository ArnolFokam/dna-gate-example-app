import mongoose from "mongoose";
import user from "./user.model";

mongoose.Promise = global.Promise;

export default  {
    mongoose: mongoose,
    user: user
};