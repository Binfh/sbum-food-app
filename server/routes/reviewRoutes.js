// routes/reviewRoutes.js
import express from 'express';
import { addReview, getProductReviews, deleteReview } from '../controllers/reviewController.js';
import authUser from '../middlewares/authUser.js'

const reviewsRouter = express.Router();

reviewsRouter.post('/add', authUser, addReview);

reviewsRouter.get('/product/:productId', getProductReviews);

reviewsRouter.delete('/:reviewId', authUser, deleteReview);

export default reviewsRouter;