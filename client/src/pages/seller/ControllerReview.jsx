import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ReviewManagement = () => {
    const { axios } = useAppContext();
    const [allReviews, setAllReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Lấy tất cả đánh giá
    const fetchAllReviews = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/reviews/all');
            if (res.data.success) {
                setAllReviews(res.data.reviews);
            }
        } catch (err) {
            setError('Lỗi khi tải đánh giá');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Xóa đánh giá với quyền admin
    const handleDeleteReview = async (reviewId) => {
        
        try {
            const res = await axios.delete(`/api/admin/reviews/${reviewId}`);
            if (res.data.success) {
                setSuccess('Xóa đánh giá thành công');
                setAllReviews(allReviews.filter(review => review._id !== reviewId));
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(res.data.message);
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi xóa đánh giá');
            setTimeout(() => setError(''), 3000);
            console.error(err);
        }
    };

    // Trả lời đánh giá
    const handleReplyReview = async (reviewId) => {
        if (!replyText.trim()) {
            setError('Vui lòng nhập nội dung trả lời');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            const res = await axios.post(`/api/admin/reviews/reply/${reviewId}`, {
                reply: replyText.trim()
            });
            
            if (res.data.success) {
                setSuccess('Trả lời đánh giá thành công');
                // Cập nhật review trong state và giữ lại productName
                setAllReviews(allReviews.map(review => 
                    review._id === reviewId ? {
                        ...res.data.review,
                        productName: review.productName // Giữ lại productName từ review cũ
                    } : review
                ));
                setReplyingTo(null);
                setReplyText('');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(res.data.message);
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi trả lời đánh giá');
            setTimeout(() => setError(''), 3000);
            console.error(err);
        }
    };

    // Xóa trả lời của admin
    const handleDeleteReply = async (reviewId) => {
        try {
            const res = await axios.delete(`/api/admin/reviews/reply/${reviewId}`);
            if (res.data.success) {
                setSuccess('Xóa trả lời thành công');
                // Cập nhật review trong state
                setAllReviews(allReviews.map(review => 
                    review._id === reviewId ? {
                        ...review,
                        adminReply: null,
                        adminRepliedAt: null,
                        adminName: null
                    } : review
                ));
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(res.data.message);
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi xóa trả lời');
            setTimeout(() => setError(''), 3000);
            console.error(err);
        }
    };

    // Hủy trả lời
    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    useEffect(() => {
        fetchAllReviews();
    }, []);

    // Định dạng ngày tháng
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

    useEffect(() => {
    if (error) {
        toast.error(error);
        setError(''); // Xóa lỗi sau khi hiện toast
    }
    }, [error]);

    useEffect(() => {
        if (success) {
            toast.success(success);
            setSuccess(''); // Xóa thông báo sau khi hiện toast
        }
    }, [success]);


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Quản lý đánh giá</h1>
                
            

            {loading ? (
                <div className="text-center py-10">Đang tải...</div>
            ) : (
                <div className="space-y-6">
                    {allReviews.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            Chưa có đánh giá nào
                        </div>
                    ) : (
                        allReviews.map(review => (
                            <div key={review._id} className="bg-white border rounded-lg p-6 shadow-sm w-[600px] mx-auto">
                                {/* Thông tin đánh giá chính */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-lg">{review.productName}</h3>
                                            <p className="text-gray-600">Người dùng: {review.userName}</p>
                                            <p className="text-gray-500 text-sm">{formatDate(review.createdAt)}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer text-sm"
                                        >
                                            Xóa đánh giá
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-gray-800">{review.comment}</p>
                                    </div>
                                </div>

                                {/* Phần trả lời của admin */}
                                {review.adminReply && (
                                    <div className="mb-4">
                                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-blue-800 font-medium">
                                                        Trả lời từ sbumshop
                                                    </p>
                                                    <p className="text-blue-600 text-sm">
                                                        {formatDate(review.adminRepliedAt)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteReply(review._id)}
                                                    className="text-red-500 hover:text-red-700 text-sm cursor-pointer hover:underline"
                                                >
                                                    Xóa trả lời
                                                </button>
                                            </div>
                                            <p className="text-blue-900">{review.adminReply}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Form trả lời */}
                                {replyingTo === review._id ? (
                                    <div>
                                        <div className="border rounded p-4 bg-gray-50">
                                            <h4 className="font-medium mb-2">Trả lời đánh giá:</h4>
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                className="w-full border rounded p-3 min-h-20 resize-none"
                                                placeholder="Nhập trả lời của bạn..."
                                            />
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => handleReplyReview(review._id)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                                                >
                                                    Gửi trả lời
                                                </button>
                                                <button
                                                    onClick={handleCancelReply}
                                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : !review.adminReply && (
                                    <div>
                                        <button
                                            onClick={() => setReplyingTo(review._id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                                        >
                                            Trả lời đánh giá
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                       
                    )}
                    
                </div>
            )}
        </div>
    );
};

export default ReviewManagement;