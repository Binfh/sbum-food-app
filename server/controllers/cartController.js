import User from "../models/User.js"

export const updateCart = async(req,res) =>{
    try {
        const {userId, cartItems} = req.body;
        
        console.log("=== CART UPDATE START ===");
        console.log("Request userId:", userId);
        console.log("Auth userId:", req.user?.userId);
        console.log("Request cartItems:", JSON.stringify(cartItems));
        console.log("CartItems keys:", Object.keys(cartItems || {}));

        if (!userId) {
            console.log("ERROR: Missing userId");
            return res.json({
                success: false, 
                message: "Missing userId"
            });
        }

        // Tìm user hiện tại trước khi update
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            console.log("ERROR: User not found");
            return res.json({
                success: false, 
                message: "User not found"
            });
        }

        console.log("Current user cartItems BEFORE update:", JSON.stringify(currentUser.cartItems));

        // Update cart
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { cartItems: cartItems },
            { new: true }
        ).select("-password");

        console.log("Updated user cartItems AFTER update:", JSON.stringify(updatedUser.cartItems));
        console.log("Update successful:", updatedUser ? "YES" : "NO");
        console.log("=== CART UPDATE END ===");

        res.json({
            success: true,
            message: "Cart Updated",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update cart error:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
}