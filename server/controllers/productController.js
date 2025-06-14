import {v2 as cloudinary} from "cloudinary"
import Product from "../models/Product.js"
import Review from "../models/Review.js";
//Add product
export const addProduct = async(req,res) =>{
    try {
        let productData = JSON.parse(req.body.productData)

        const image = req.file;
        const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
        const imageUrl = result.secure_url;

        await Product.create({ ...productData, image: imageUrl });


        res.json({success:true,message:"Thêm món ăn thành công"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

// Update product
export const updateProduct = async (req, res) => {
    try {
        const { id, productData } = req.body;

        if (!id || !productData) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin cập nhật" });
        }

        let updatedData = JSON.parse(productData);

        // Nếu có file ảnh mới thì cập nhật ảnh
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
            updatedData.image = result.secure_url;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
        }

        res.json({ success: true, message: "Cập nhật sản phẩm thành công", product: updatedProduct });
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error.message);
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật sản phẩm" });
    }
}

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Thiếu ID sản phẩm" });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
        }

        res.json({ success: true, message: "Xóa sản phẩm thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error.message);
        res.status(500).json({ success: false, message: "Lỗi khi xóa sản phẩm" });
    }
}


//Get product
export const productList = async(req,res) =>{
    try {
        const products = await Product.find({})
        res.json({success:true,products})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//Get single product
export const productById = async(req,res) =>{
    try {
        const {id} = req.body
        const product = await Product.findById(id)
         if (!product) {
            return res.json({success: false, message: "Không tìm thấy sản phẩm"});
        }
        const reviews = await Review.find({productId: id}).sort({createdAt: -1});
        
        res.json({success: true, product, reviews});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//Change product inStock
export const changeStock = async(req, res) => {
    try {
        const { id, inStock } = req.body;
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu thông tin sản phẩm" 
            });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { inStock }, 
            { new: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm"
            });
        }
        return res.json({
            success: true, 
            message: inStock ? "Đã cập nhật: Còn món" : "Đã cập nhật: Hết món",
            product: updatedProduct 
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi khi cập nhật trạng thái sản phẩm" 
        });
    }
}