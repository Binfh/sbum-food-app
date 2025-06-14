import React, { useEffect, useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const AddProducts = () => {

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  const location = useLocation();
  const editingProduct = location.state?.product || null;

  const { axios,navigate } = useAppContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const productData = {
      name,
      des: description,
      category,
      price,
      offerPrice: offerPrice ? Number(offerPrice) : null,
    };

    // Check if we're editing or adding a new product
    if (editingProduct) {
      formData.append('id', editingProduct._id);
      formData.append('productData', JSON.stringify(productData));
      
      if (files[0] instanceof File) {
        formData.append('image', files[0]);
      }

      try {
        const { data } = await axios.put('/api/product/update', formData);
        if (data.success) {
          toast.success('Cập nhật món ăn thành công!');
          
          // Reset form và quay về trạng thái thêm món ăn mới
          resetForm();
          
          // Xóa trạng thái chỉnh sửa trong history
          navigate('/seller', { replace: true });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error.response?.data);
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
      }
    } else {
      formData.append('productData', JSON.stringify(productData));
      if (files[0]) {
        formData.append('image', files[0]);
      }

      try {
        const { data } = await axios.post('/api/product/add', formData);
        if (data.success) {
          toast.success('Đã thêm món ăn!');
          resetForm();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error.response?.data);
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
      }
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setOfferPrice('');
    setFiles([]);
  };
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.des);
      setCategory(editingProduct.category);
      setPrice(editingProduct.price);
      setOfferPrice(editingProduct.offerPrice);
      setFiles([editingProduct.image]);
    }
  }, [editingProduct]);

  return (
    <div className="no-scrollbar overflow-y-scroll flex flex-col flex-1 h-[95vh] justify-between ">
      <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Ảnh món ăn</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <label htmlFor="image" className="cursor-pointer">
              <input 
                type="file" 
                id="image" 
                hidden 
                onChange={(e) => setFiles([e.target.files[0]])} 
              />
              <img
  className="max-w-24 cursor-pointer"
  src={files[0] && files[0] instanceof File ? URL.createObjectURL(files[0]) : (editingProduct?.image || assets.upLoad_area)}
  alt="uploadArea"
  width={100}
  height={100}
/>

            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">Tên món ăn</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="product-name" 
            type="text" 
            placeholder="Nhập tên món" 
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
            required 
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">Mô tả món ăn</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            id="product-description" 
            rows={4} 
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" 
            placeholder="Nhập mô tả" 
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">Danh mục</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            id="category" 
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Chọn danh mục món ăn</option>
            {categories.map((category, index) => (
              <option key={index} value={category.path}>{category.path}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">Giá món ăn</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              id="product-price" 
              type="number" 
              placeholder="0" 
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
              required 
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">Giá món ăn khuyến mãi</label>
            <input
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              id="offer-price" 
              type="number" 
              placeholder="0" 
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
            />
          </div>
        </div>
        <button className="px-8 py-2.5 cursor-pointer bg-primary text-white font-medium rounded">
          {editingProduct ? 'Cập nhật món ăn' : 'Thêm món ăn'}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
