// models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    adminReply: {
        type: String,
        default: null
    },
    adminRepliedAt: {
        type: Date,
        default: null
    },
}, { timestamps: true });

const Review = mongoose.models.review || mongoose.model('review', reviewSchema);

export default Review;