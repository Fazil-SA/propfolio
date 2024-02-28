import express from 'express';
import { createListing, deleteUserListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);

router.post('/delete/:id', verifyToken, deleteUserListings)

export default router;