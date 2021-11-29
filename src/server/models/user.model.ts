import mongoose from "mongoose";

export interface User {
    name: string;
    email: string;
    password: string;
    biometricId: string;
}

export default mongoose.model<User>(
    "User",
    new mongoose.Schema<User>({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        biometricId: {
            type: String,
            require: false
        },
    })
);