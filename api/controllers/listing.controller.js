import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({userRef: req.params.id});
            res.status(201).json(listings);
        } catch (error) {
            next(error.message);
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listings!'));
    }
}

export const deleteUserListings = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    console.log(listing)
    if(!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    };

    if(req.user.id !== listing.userRef) {
        return next(errorHandler(404, 'You can only delete your own listings!'));
    };

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(201).json('User listing has been deleted!');
    } catch (error) {
        next(error.message);
    }
}