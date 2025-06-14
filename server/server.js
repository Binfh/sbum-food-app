import cookieParser from 'cookie-parser';
import express from 'express'; 
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config'
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { vnpayReturn } from './controllers/orderController.js';
import adminReviewRouter from './routes/adminReviewRoute.js';
import reviewsRouter from './routes/reviewRoutes.js';
import dialogFlowrouter from './routes/dialogflowRoute.js';


const app = express();
const PORT = process.env.PORT || 3000;

await connectDB()
await connectCloudinary()

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173']

app.get('/vnpay-return', vnpayReturn);

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials:true}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)
app.use('/api/reviews', reviewsRouter);
app.use('/api/admin/reviews', adminReviewRouter);
app.use('/api/dialogflow', dialogFlowrouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});