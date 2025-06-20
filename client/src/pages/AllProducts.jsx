import React, { useEffect, useState } from 'react'
import ProductsCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const AllProducts = () => {
    const { products, searchQuery, setSearchQuery } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    
    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({
        min: '',
        max: ''
    });
    const [sortBy, setSortBy] = useState('');

    // Get unique categories from products
    const categories = [...new Set(products.map(product => product.category))].filter(Boolean);

    useEffect(() => {
        const removeVietnameseTones = (str) => {
            return str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D")
                .toLowerCase();
        };

        let filtered = [...products];

        // Filter by search query
        if (searchQuery.length > 0) {
            filtered = filtered.filter((product) =>
                removeVietnameseTones(product.name).includes(removeVietnameseTones(searchQuery))
            );
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filter by price range
        if (priceRange.min !== '' || priceRange.max !== '') {
            filtered = filtered.filter(product => {
                const price = product.offerPrice || product.price;
                const minPrice = priceRange.min !== '' ? parseFloat(priceRange.min) : 0;
                const maxPrice = priceRange.max !== '' ? parseFloat(priceRange.max) : Infinity;
                return price >= minPrice && price <= maxPrice;
            });
        }

        // Sort products
        if (sortBy) {
            filtered.sort((a, b) => {
                switch (sortBy) {
                    case 'price-low-high':
                        return (a.offerPrice || a.price) - (b.offerPrice || b.price);
                    case 'price-high-low':
                        return (b.offerPrice || b.price) - (a.offerPrice || a.price);
                    default:
                        return 0;
                }
            });
        }

        setFilteredProducts(filtered);
    }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setPriceRange({ min: '', max: '' });
        setSortBy('');
    };

    const hasActiveFilters = searchQuery || selectedCategory || priceRange.min || priceRange.max || sortBy;

    return (
        <div className='flex flex-col mt-40 px-6 md:px-16 lg:px-24 xl:px-32'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
                <div className='flex flex-col items-start w-max mb-4 md:mb-0'>
                    <p className='text-2xl font-medium uppercase'>Tất cả món ăn</p>
                    <p className='text-gray-600 mt-1'>
                        {filteredProducts.length} món ăn
                        {hasActiveFilters && ` (đã lọc từ ${products.length} món)`}
                    </p>
                </div>
                
                {/* Filter Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Bộ lọc
                    {hasActiveFilters && (
                        <span className='bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                            !
                        </span>
                    )}
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className='bg-gray-50 rounded-lg p-4 mb-6'>
                    <div className='flex flex-col gap-4'>
                        {/* First Row: Category and Sort */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Category Filter */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Danh mục
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className='w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map((category, idx) => (
                                        <option key={idx} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Sắp xếp theo
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className='w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-md focus:outline-none '
                                >
                                    <option value="">Mặc định</option>
                                    <option value="price-low-high">Giá: Thấp đến Cao</option>
                                    <option value="price-high-low">Giá: Cao đến Thấp</option>
                                </select>
                            </div>
                        </div>

                        {/* Second Row: Price Range and Clear Button */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
                            {/* Price Range Filter */}
                            <div className='md:col-span-2'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Khoảng giá (VNĐ)
                                </label>
                                <div className='flex gap-2'>
                                    <input
                                        type="number"
                                        placeholder="Từ"
                                        min="0"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                        className='flex-1 cursor-pointer px-3 py-2 border border-gray-300 rounded-md focus:outline-none '
                                    />
                                    <input
                                        type="number"
                                        placeholder="Đến"
                                        min="0"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                        className='flex-1 cursor-pointer px-3 py-2 border border-gray-300 rounded-md focus:outline-none '
                                    />
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            {hasActiveFilters && (
                                <div>
                                    <button
                                        onClick={clearAllFilters}
                                        className='w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer'
                                    >
                                        Xóa tất cả bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Tags */}
            {hasActiveFilters && (
                <div className='flex flex-wrap gap-2 mb-6'>
                    {searchQuery && (
                        <span className='inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full'>
                            Tìm kiếm: "{searchQuery}"
                            <button 
                                onClick={() => setSearchQuery('')}
                                className='hover:bg-orange-200 rounded-full p-1'
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </span>
                    )}
                    {selectedCategory && (
                        <span className='inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'>
                            Danh mục: {selectedCategory}
                            <button 
                                onClick={() => setSelectedCategory('')}
                                className='hover:bg-blue-200 rounded-full p-1'
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </span>
                    )}
                    {(priceRange.min || priceRange.max) && (
                        <span className='inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full'>
                            Giá: {priceRange.min ? priceRange.min + '.000' : '0'} - {priceRange.max ? priceRange.max + '.000' : '∞'} VNĐ
                            <button 
                                onClick={() => setPriceRange({ min: '', max: '' })}
                                className='hover:bg-green-200 rounded-full p-1'
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </span>
                    )}
                    {sortBy && (
                        <span className='inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full'>
                            Sắp xếp: {
                                sortBy === 'price-low-high' ? 'Giá thấp đến cao' :
                                sortBy === 'price-high-low' ? 'Giá cao đến thấp' :
                                sortBy
                            }
                            <button 
                                onClick={() => setSortBy('')}
                                className='hover:bg-purple-200 rounded-full p-1'
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </span>
                    )}
                </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-6'>
                    {filteredProducts.map((prd, idx) => (
                        <ProductsCard key={idx} product={prd} />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center mt-12 py-8'>
                    <div className='text-gray-400 text-6xl mb-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                    </div>
                    <h3 className='text-xl font-medium text-gray-800'>Không tìm thấy kết quả</h3>
                    <p className='text-gray-500 mt-2 mb-6 text-center'>
                        {hasActiveFilters 
                            ? 'Không có món ăn nào phù hợp với các bộ lọc đã chọn'
                            : `Không có món ăn nào phù hợp với từ khóa "${typeof searchQuery === 'string' ? searchQuery : ''}"`
                        }
                    </p>
                    <button 
                        onClick={clearAllFilters}
                        className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors cursor-pointer'
                    >
                        {hasActiveFilters ? 'Xóa tất cả bộ lọc' : 'Xóa tìm kiếm'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllProducts