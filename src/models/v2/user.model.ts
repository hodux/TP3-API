import mongoose from "mongoose";
import { IUser } from "../../interfaces/v2/user.interface.ts";

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },
    username: { type: String, required: true }
})

export const User = mongoose.model<IUser>('User', userSchema);