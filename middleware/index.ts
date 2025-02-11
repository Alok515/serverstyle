import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const authMiddleware: express.RequestHandler = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const token = req.cookies["sessionToken"];
        if (!token) {
            res.status(401).send("Unauthorized").end();
            return;
        }

        const user = await getUserBySessionToken(token);
        if (!user) {
            res.status(403).send("Unauthorized").end();
            return;
        }

        merge(req, { identity: user });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error").end();
    }
}