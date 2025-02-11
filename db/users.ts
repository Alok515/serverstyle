import { password } from "bun";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    auth: {
        password: {
            type: String,
            required: true,
            select: false,
        },
        salt: {
            type: String,
            select: false,
        },
        sessionToken: {
            type: String,
            select: false,
        }
    },
});

export const User = mongoose.model("User", UserSchema);

export const getUsers = async () => await User.find();
export const getUserById = async (id: string) => await User.findById(id);
export const getUserByEmail = async (email: string) => await User.findOne({ email });
export const getUserByEmailWithAuth = async (email: string) => await User.findOne({ email }).select("+auth.salt +auth.password");
export const getUserBySessionToken = async (sessionToken: string) => await User.findOne({ "auth.sessionToken": sessionToken });
export const createUser = async (values: Record<string, any>) => await new User(values)
    .save()
    .then((user) => user.toObject());

export const updateUser = async (id: string, values: Record<string, any>) => await User.findByIdAndUpdate(id, values); 
export const deleteUser = async (id: string) => await User.findByIdAndDelete({ _id: id });
