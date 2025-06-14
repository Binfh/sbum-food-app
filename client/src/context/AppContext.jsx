import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios"

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [isSeller,setIsSeller] = useState(false);
    const [showUserLogin,setShowUserLogin] = useState(false);
    const [products,setProducts] = useState([]);
    const [loginState, setLoginState] = useState('login');

    const [cartItems,setCartItems] = useState({});
    const [searchQuery,setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    
    //Fetch Seller Status
    const fetchSeller = async () =>{
        setLoading(true)
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }finally {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false); 
        }
    }

    const fetchUser = async() => {
        console.log("=== FETCH USER START ===");
        try {
            const {data} = await axios.get('/api/user/is-auth');
            console.log("Fetch user response:", data);
            
            if(data.success && data.user) {
                const userWithCart = {
                    ...data.user,
                    cartItems: data.user.cartItems || {}
                };
                console.log("Setting user with cartItems:", JSON.stringify(userWithCart.cartItems));
                setUser(userWithCart);
                setCartItems(userWithCart.cartItems);
            } else {
                console.log("User not authenticated");
                setUser(false);
                setCartItems({});
            }
        } catch (error) {
            console.error('Fetch user error:', error);
            setUser(false);
            setCartItems({});
        }
        console.log("=== FETCH USER END ===");
    }

    const fetchProducts = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, []);

    const updateProductStock = useCallback(async (id, inStock) => {
        try {
            // Đặt loading state cho product này (xử lý ở component)
            
            // Cập nhật UI ngay lập tức (optimistic update)
            setProducts(prevProducts => 
                prevProducts.map(product => 
                    product._id === id ? { ...product, inStock } : product
                )
            );
            
            const { data } = await axios.post('/api/product/stock', { id, inStock });
            
            if (!data.success) {
                setProducts(prevProducts => 
                    prevProducts.map(product => 
                        product._id === id ? { ...product, inStock: !inStock } : product
                    )
                );
                toast.error(data.message || "Không thể cập nhật trạng thái");
            } else {
                if (data.product) {
                    setProducts(prevProducts => 
                        prevProducts.map(product => 
                            product._id === id ? { ...product, ...data.product } : product
                        )
                    );
                }
                toast.success(data.message || "Đã cập nhật thành công");
            }
            
            return data.success;
        } catch (error) {
            setProducts(prevProducts => 
                prevProducts.map(product => 
                    product._id === id ? { ...product, inStock: !inStock } : product
                )
            );
            toast.error(error.message || "Có lỗi xảy ra");
            return false;
        }
    }, []);

    const clearCart = async () => {
        try {
            if (user && user._id) {
                const { data } = await axios.post('/api/cart/clear');
                if (data.success) {
                    setUser(data.user);
                    setCartItems({});
                    return true;
                }
            } else {
                setCartItems({});
                return true;
            }
        } catch (error) {
            console.error("Clear cart error:", error);
            return false;
        }
    };

    const addToCart = async (itemId) => {
        if(!user || !user._id){
            toast("Đăng nhập để thêm sản phẩm vào giỏ hàng nhé!", { icon: "🛒" });
            return
        }
    
        try {
            let cartData = structuredClone(cartItems);
            if(cartData[itemId]) {
                cartData[itemId] += 1;
            } else {
                cartData[itemId] = 1;
            }

            console.log("New cartData:", JSON.stringify(cartData));

            // Chỉ cập nhật lên server khi đã đăng nhập
            if(user && user._id) {
                console.log("Sending request to server...");
                
                const {data} = await axios.post('/api/cart/update', {
                    userId: user._id,
                    cartItems: cartData
                });
                
                console.log("Server response:", data);
                
                if(!data.success) {
                    console.error("Server error:", data.message);
                    toast.error(data.message);
                    return;
                }

                // Cập nhật state từ server response
                if(data.user && data.user.cartItems) {
                    console.log("Updating frontend state with:", JSON.stringify(data.user.cartItems));
                    setUser(data.user);
                    setCartItems(data.user.cartItems);
                } else {
                    console.error("Server didn't return user or cartItems");
                }
            } else {
                console.log("User not logged in, updating local state only");
                setCartItems(cartData);
            }
            
            toast.success("Đã thêm món ăn vào giỏ hàng!");
            console.log("=== ADD TO CART END ===");
            
        } catch (error) {
            console.error("Add to cart error:", error);
            toast.error("Không thể thêm món ăn vào giỏ hàng!");
        }
    }

    const updateToCart = async (itemId, quantity) => {
        console.log("=== UPDATE CART START ===");
        console.log("ItemId:", itemId, "Quantity:", quantity);
        
        try {
            let cartData = structuredClone(cartItems);
            cartData[itemId] = quantity;

            console.log("New cartData:", JSON.stringify(cartData));

            // Cập nhật lên server nếu user đã đăng nhập
            if(user && user._id) {
                console.log("Sending request to server...");
                
                const {data} = await axios.post('/api/cart/update', {
                    userId: user._id,
                    cartItems: cartData
                });
                
                console.log("Server response:", data);
                
                if(!data.success) {
                    console.error("Server error:", data.message);
                    toast.error(data.message);
                    return;
                }

                // Cập nhật state từ server response
                if(data.user && data.user.cartItems !== undefined) {
                    console.log("Updating frontend state with:", JSON.stringify(data.user.cartItems));
                    setUser(data.user);
                    setCartItems(data.user.cartItems);
                }
            } else {
                console.log("User not logged in, updating local state only");
                setCartItems(cartData);
            }

            toast.success("Đã cập nhật giỏ hàng!");
            console.log("=== UPDATE CART END ===");
        } catch (error) {
            console.error("Update cart error:", error);
            toast.error("Không thể cập nhật giỏ hàng!");
        }
    }

    const removeFromCart = async (itemId) => {
        console.log("=== REMOVE FROM CART START ===");
        console.log("ItemId:", itemId);
        console.log("Current cartItems:", JSON.stringify(cartItems));
        
        try {
            let cartData = structuredClone(cartItems);
            if(cartData[itemId]) {
                cartData[itemId] -= 1;
                if(cartData[itemId] === 0) {
                    delete cartData[itemId];
                }

                console.log("New cartData:", JSON.stringify(cartData));

                // Cập nhật lên server nếu user đã đăng nhập
                if(user && user._id) {
                    console.log("Sending request to server...");
                    
                    const {data} = await axios.post('/api/cart/update', {
                        userId: user._id,
                        cartItems: cartData
                    });
                    
                    console.log("Server response:", data);
                    
                    if(!data.success) {
                        console.error("Server error:", data.message);
                        toast.error(data.message);
                        return;
                    }

                    // Cập nhật state từ server response
                    if(data.user && data.user.cartItems !== undefined) {
                        console.log("Updating frontend state with:", JSON.stringify(data.user.cartItems));
                        setUser(data.user);
                        setCartItems(data.user.cartItems);
                    } else {
                        console.error("Server didn't return user or cartItems");
                    }
                } else {
                    console.log("User not logged in, updating local state only");
                    setCartItems(cartData);
                }

                toast.success("Đã xóa món ăn khỏi giỏ hàng!");
            }
            
            console.log("=== REMOVE FROM CART END ===");
        } catch (error) {
            console.error("Remove from cart error:", error);
            toast.error("Không thể xóa món ăn khỏi giỏ hàng!");
        }
    }

    const deleteFromCart = async (itemId) => {
        console.log("=== DELETE FROM CART START ===");
        console.log("ItemId:", itemId);
        
        try {
            let cartData = structuredClone(cartItems);
            if (!cartData[itemId]) {
                console.log("Item not in cart, returning");
                return;
            }

            // Xóa item khỏi cartData
            delete cartData[itemId];
            console.log("New cartData:", JSON.stringify(cartData));

            // Cập nhật lên server nếu user đã đăng nhập
            if (user && user._id) {
                console.log("Sending request to server...");
                
                try {
                    const {data} = await axios.post('/api/cart/update', {
                        userId: user._id,
                        cartItems: cartData
                    });
                    
                    console.log("Server response:", data);
                    
                    if (!data.success) {
                        console.error('Update cart error:', data.message);
                        toast.error(data.message);
                        return;
                    }

                    // Cập nhật state từ server response
                    if(data.user && data.user.cartItems !== undefined) {
                        console.log("Updating frontend state with:", JSON.stringify(data.user.cartItems));
                        setUser(data.user);
                        setCartItems(data.user.cartItems);
                    } else {
                        console.error("Server didn't return user or cartItems");
                    }
                    
                    toast.success("Đã xóa món ăn khỏi giỏ hàng!");
                } catch (error) {
                    console.error('API call error:', error);
                    toast.error("Lỗi kết nối server!");
                    return;
                }
            } else {
                console.log("User not logged in, updating local state only");
                setCartItems(cartData);
                toast.success("Đã xóa món ăn khỏi giỏ hàng!");
            }
            
            console.log("=== DELETE FROM CART END ===");
        } catch (error) {
            console.error("Delete cart error:", error);
            toast.error("Không thể xóa món ăn khỏi giỏ hàng!");
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for(let item in cartItems) {
            const productExists = products.find((product) => product._id === item);
            if (productExists) {
                totalCount += cartItems[item];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(let items in cartItems) {
            const product = products.find((product) => product._id === items);
            if(product) {
                if(product.offerPrice){
                    totalAmount += product.offerPrice * cartItems[items];
                }else{
                    totalAmount += product.price * cartItems[items];
                }
            } else {
                const updatedCart = {...cartItems};
                delete updatedCart[items];
                setCartItems(updatedCart);
            }
        }
        return totalAmount;
    }

    const validateCartItems = useCallback(() => {
        if (Object.keys(cartItems).length > 0 && products.length > 0) {
            let hasInvalidItems = false;
            const updatedCartItems = {...cartItems};
            
            for (const key in updatedCartItems) {
                const productExists = products.some(product => product._id === key);
                if (!productExists) {
                    delete updatedCartItems[key];
                    hasInvalidItems = true;
                }
            }
            
            if (hasInvalidItems) {
                setCartItems(updatedCartItems);
                toast.error("Một số món trong giỏ hàng không còn tồn tại và đã được xóa");
            }
        }
    }, [cartItems, products, setCartItems]);

    useEffect(() => {
        // Fetch tất cả data cần thiết khi component mount
        const initializeData = async () => {
            await Promise.all([
                fetchProducts(),
                fetchUser(),
                fetchSeller()
            ]);
        };

        initializeData();
    }, []);

    useEffect(() => {
        validateCartItems();
    }, [products, validateCartItems]);

    useEffect(() => {
        if(user && user.cartItems) {
            // Chỉ update khi cartItems thực sự khác nhau
            const currentCartStr = JSON.stringify(cartItems);
            const userCartStr = JSON.stringify(user.cartItems);
            
            if(currentCartStr !== userCartStr) {
                console.log("Syncing cart from user data");
                setCartItems(user.cartItems);
            }
        } else if(user === false) {
            // Chỉ clear khi user là false (đã logout), không phải null (đang loading)
            console.log("User logged out, clearing cart");
            setCartItems({});
        }
    }, [user]); 


    const value = {navigate,user,setUser,isSeller,setIsSeller,showUserLogin,setShowUserLogin,products,currency,addToCart,updateToCart,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartCount,getCartAmount,axios,loading,setLoading,fetchProducts,setCartItems,deleteFromCart,setProducts,updateProductStock,loginState,setLoginState,clearCart};
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    return useContext(AppContext);
}