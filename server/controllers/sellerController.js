import jwt from 'jsonwebtoken'

// Login Seller

export const sellerLogin = async(req,res) =>{
    try{
        const {email,password} = req.body;

        if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
            const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'});

            res.cookie('sellerToken',token,{
                httpOnly : true,
                secure: process.env.NODE_ENV || 'production',
                sameSite :process.env.NODE_ENV || 'production' ? 'none' : 'strict',
                maxAge : 7 * 24 * 60 * 60 * 1000
            });

            return res.json({success:true,message:'Đăng nhập thành công'})
        }else{
            return res.json({success:false,message:'Sai thông tin đăng nhập'})
        }
    }catch(err){
        console.log(err.message);
        return res.json({success:false,message:err.message})
    }
}

//Check Auth Seller 
export const isSellerAuth = async(req,res) =>{
    try{
        return res.json({success:true})
    }catch(err){
        console.log(err.message);
        return res.json({success:false,message:err.message})
    }
}

//Logout Seller 

export const sellerLogout = async(req,res) =>{
    try{
        res.clearCookie('sellerToken',{
            httpOnly:true,
            secure: process.env.NODE_ENV || 'production',
            sameSite :process.env.NODE_ENV || 'production' ? 'none' : 'strict',
        });
        return res.json({success:true,message:'Đăng xuất thành công'})
    }catch(err){
        console.log(err.message);
        return res.json({success:false,message:err.message})
    }
}