import express from 'express';

import { getAllUsers } from '../controllers/users';
import { authMiddleware } from '../middleware';

export default (router: express.Router) => {
    router.get('/users', authMiddleware, getAllUsers);
}