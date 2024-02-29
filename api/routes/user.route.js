import express from 'express';
import { test, updateUser, deleteUser, getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { getUserListings } from '../controllers/listing.controller.js';

const router = express.Router();

router.get('/test', test);

router.post('/update/:id', verifyToken, updateUser);

router.post('/delete/:id', verifyToken, deleteUser);

router.get('/listings/:id', verifyToken, getUserListings);

router.get('/:id', verifyToken, getUser);

export default router;