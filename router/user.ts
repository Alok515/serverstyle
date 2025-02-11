import express from 'express';

import { getAllUsers, deleteUserById } from '../controllers/users';
import { authMiddleware, isOwner } from '../middleware';

export default (router: express.Router) => {
    router.get('/users', authMiddleware, getAllUsers);
    router.delete('/users/:id', authMiddleware, isOwner, deleteUserById);
}