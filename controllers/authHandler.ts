import express, { type Express, type Request, type Response } from "express";
import { createUser, getUserByEmail, getUserByEmailWithAuth } from "../db/users";
import {  random, maskPassword } from "../helper";

export const register: express.RequestHandler = async (req: Request, res: Response): Promise<void> =>  {
    try {
        const { email, password, userName } = req.body;
        if (!email || !password || !userName) {
            res.status(400).send("Bad Request").end();
        }
        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.status(409).send("User already exists").end();
        }

        //genrate salt
        const salt = random();
        //create user and save to DB
        const user = await createUser({
            email,
            userName,
            auth: {
                password: maskPassword(salt, password),
                salt,
            },
        });

        res.status(200).json(user).end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error").end();
    }
}

export const login: express.RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send("Bad Request").end();
            return;
        }

        const user = await getUserByEmailWithAuth(email);

        if (!user || !user.auth || !user.auth.salt) {
            res.status(400).send("User not found or invalid authentication data").end();
            return;
        }

        const exprectedHash = maskPassword(user.auth.salt, password);
        
        if (user.auth.password !== exprectedHash) {
            res.status(403).send("Unauthorized").end();
            return;
        }

        const salt = random();
        user.auth.sessionToken = maskPassword(salt, user._id.toString());
        await user.save();

        res.cookie("sessionToken", user.auth.sessionToken, { domain: "localhost", httpOnly: true, path: '/'});
        res.status(200).json(user).end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error").end();
        return;
    }
}