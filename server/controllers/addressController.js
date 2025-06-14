import Address from "../models/Address.js"


// Add Address
export const addAddress = async(req,res) =>{
    try {
        const { address } = req.body
        const userId = req.user.userId
        await Address.create({...address,userId})
        res.json({success:true,message:"Địa chỉ được thêm thành công"})
    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message})
    }
}

// Get Address

export const getAddress = async(req,res) =>{
    try {
        const userId = req.user.userId
        const addresses = await Address.find({userId})
        res.json({success:true,addresses})
    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message})
    }
}