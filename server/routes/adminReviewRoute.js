import express from 'express';
import { adminDeleteReply, adminDeleteReview, adminReplyReview, getAllReviews, getProductReviews } from '../controllers/reviewController.js';
import authSeller from '../middlewares/authSeller.js'

const adminReviewRouter = express.Router();

adminReviewRouter.get('/all', authSeller, getAllReviews);

adminReviewRouter.get('/product/:productId', authSeller, getProductReviews);

adminReviewRouter.delete('/:reviewId', authSeller, adminDeleteReview);

adminReviewRouter.post('/reply/:reviewId', authSeller, adminReplyReview);

adminReviewRouter.delete('/reply/:reviewId', authSeller, adminDeleteReply);

export default adminReviewRouter;