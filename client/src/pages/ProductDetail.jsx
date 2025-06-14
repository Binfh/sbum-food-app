import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductsCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';
import { formatVND } from '../assets/assets';

const ProductDetail = () => {
    const { products, navigate, currency, addToCart, user ,axios,setShowUserLogin} = useAppContext();
    const { id } = useParams();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const product = products.find((item) => item._id === id);

    // Lấy đánh giá sản phẩm
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/reviews/product/${id}`);
            if (response.data.success) {
                setReviews(response.data.reviews);
            }
        } catch (error) {
            console.error('Lỗi khi lấy đánh giá:', error);
        }
    };

    // Thêm đánh giá mới
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            setErrorMsg('Vui lòng nhập nội dung đánh giá');
            return;
        }
        setErrorMsg('');
        
        try {
            const response = await axios.post('/api/reviews/add', {
                productId: id,
                comment: comment.trim()
            });

            if (response.data.success) {
                setSuccessMsg(response.data.message);
                setComment('');
                fetchReviews(); // Cập nhật lại danh sách đánh giá
                setTimeout(() => {
                    setSuccessMsg('');
                }, 3000);
            } else {
                setErrorMsg(response.data.message);
            }
        } catch (error) {
            setErrorMsg('Có lỗi xảy ra khi gửi đánh giá');
            console.error('Lỗi:', error);
        } 
    };

    // Xóa đánh giá
    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await axios.delete(`/api/reviews/${reviewId}`);
            if (response.data.success) {
                setSuccessMsg('Xóa đánh giá thành công');
                // Cập nhật lại danh sách đánh giá sau khi xóa
                setReviews(reviews.filter(review => review._id !== reviewId));
                setTimeout(() => {
                    setSuccessMsg('');
                }, 3000);
            } else {
                setErrorMsg(response.data.message);
            }
        } catch (error) {
            setErrorMsg('Có lỗi xảy ra khi xóa đánh giá');
            console.error('Lỗi:', error);
        }
    };

    useEffect(() => {
        if (products.length > 0 && product) {
            const productCopy = products.filter(
                (item) => product.category === item.category && item._id !== product._id
            );
            setRelatedProducts(productCopy.slice(0, 4));
        }
    }, [products, product]);

    useEffect(() => {
        if (id) {
            fetchReviews();
        }
    }, [id]);

    // Hàm định dạng ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return product && (
        <div className="mt-40 px-6 md:px-16 lg:px-24 xl:px-32">
            <p>
                <Link to={'/'}>Trang chủ</Link> /
                <Link to={'/products'}> Thực đơn</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="border border-gray-500/30 max-w-150 rounded overflow-hidden w-full">
                    <img className='w-full h-full' src={product.image} alt={product.name} />
                </div>
                    
                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="mt-6">
                        {product.offerPrice ? (
                            <p>
                                <span className="text-gray-500/70 line-through">{formatVND(product.price)}{currency}</span>
                                <span className="text-2xl font-medium">{formatVND(product.offerPrice)}.{currency}</span>
                            </p>
                        ) : (
                            <p className="text-2xl font-medium">{formatVND(product.price)}{currency}</p>
                        )}
                    </div>

                    <p className="text-base font-medium mt-6 mb-2">Thông tin về món ăn</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.des.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={() => addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-200 text-black hover:bg-white border border-transparent hover:border-primary-2 transition" >
                            Thêm vào giỏ hàng
                        </button>
                        <button 
                            onClick={() => {
                            addToCart(product._id);
                            navigate('/cart')}}
                            className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-2 transition" >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>

            {/* Phần đánh giá sản phẩm */}
            <div className="mt-16">
                <h2 className="text-2xl font-medium">Đánh giá sản phẩm</h2>
                <div className="mt-6">
                    {user ? (
                        <form onSubmit={handleSubmitReview} className="mb-8">
                            <div className="flex flex-col">
                                <label htmlFor="comment" className="mb-2 font-medium">
                                    Viết đánh giá của bạn
                                </label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="border p-3 rounded min-h-24 resize-none"
                                    placeholder="Hãy chia sẻ cảm nhận của bạn về món ăn này..."
                                ></textarea>
                            </div>
                            {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
                            {successMsg && <p className="text-green-500 mt-2">{successMsg}</p>}
                            <button
                                type="submit"
                                className="mt-4 bg-primary text-white py-2 px-6 rounded hover:bg-primary-2 transition cursor-pointer"
                            >
                                Gửi đánh giá
                            </button>
                        </form>
                    ) : (
                        <div className="bg-gray-100 p-4 rounded mb-8">
                            <p>Vui lòng <button onClick={() => {setShowUserLogin(true)}} className="text-primary cursor-pointer hover:underline">đăng nhập</button> để viết đánh giá.</p>
                        </div>
                    )}

                    <h3 className="font-medium text-xl mb-4">Tất cả đánh giá ({reviews.length})</h3>
                    {reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b pb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{review.userName}</p>
                                            <p className="text-gray-500 text-sm">{formatDate(review.createdAt)}</p>
                                        </div>
                                        {user && user._id === review.userId && (
                                            <button
                                                onClick={() => handleDeleteReview(review._id)}
                                                className="text-red-500 hover:underline cursor-pointer hover:text-red-700"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                    <p className="mt-2 text-gray-800">{review.comment}</p>
                                    
                                    {/* Hiển thị trả lời của admin */}
                                    {review.adminReply && (
                                        <div className="mt-4 ml-6 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-blue-800 font-medium text-sm">
                                                    Phản hồi từ {review.adminName || 'SBumShop'}
                                                </p>
                                                <span className="text-blue-600 text-xs">
                                                    {formatDate(review.adminRepliedAt)}
                                                </span>
                                            </div>
                                            <p className="text-blue-900">{review.adminReply}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                    )}
                </div>
            </div>

            <div className='flex flex-col items-center my-20'>
                <div className='flex flex-col items-center w-max'>
                    <p className='text-3xl font-medium'>
                        Các món ăn có thể bạn sẽ thích
                    </p>
                    <div className='w-20 h-0.5 bg-primary rounded-full mt-2'></div>
                </div>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-6'>
                {relatedProducts.filter((product) => product.inStock).map((product, idx) => (
                    <ProductsCard key={idx} product={product} />
                ))}
            </div>
            <button onClick={() => {navigate('/products'); scrollTo(0,0)}} className='mx-auto flex items-center cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition'>
                Xem thêm
            </button>
        </div>
    );
};

export default ProductDetail;