import express, { type Express, type Request, type Response } from "express";

import { getUsers, deleteUser } from "../db/users";
import { json } from "body-parser";

export const getAllUsers: express.RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsers();
        res.status(200).json(users).end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error").end();
    }
}

export const deleteUserById: express.RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await deleteUser(id);
        res.status(200).json(user).end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error").end();
    }
}