import express from 'express';
import { createListing, deleteUserListings, getListing, getListings, updateListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);

router.post('/delete/:id', verifyToken, deleteUserListings);

router.post('/update/:id', verifyToken, updateListing);

router.get('/get/:id', getListing);

router.get('/get', getListings)

export default router;