import express from 'express'
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, updateProduct, deleteProduct , changeStock, productById, productList } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add',upload.single('image'),authSeller,addProduct)
productRouter.put('/update', upload.single('image'), authSeller, updateProduct);
productRouter.delete('/delete/:id', authSeller, deleteProduct);
productRouter.get('/list',productList)
productRouter.get('/id',productById)
productRouter.post('/stock',authSeller,changeStock)

export default productRouter;