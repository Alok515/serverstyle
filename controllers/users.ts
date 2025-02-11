import express, { type Express, type Request, type Response } from "express";

import { getUsers } from "../db/users";

export const getAllUsers: express.RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsers();
        res.status(200).json(users).end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error").end();
    }
}