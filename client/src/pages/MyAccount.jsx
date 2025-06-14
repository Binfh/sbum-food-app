import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MyAccount = () => {
  const { navigate, user, setUser, axios } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openNameForm, setOpenNameForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // Password change form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Name change form state
  const [newName, setNewName] = useState('');
  const [nameMessage, setNameMessage] = useState({ type: '', text: '' });

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get('/api/address/get');
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[data.addresses.length - 1]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/user/is-auth');
        
        if (res.data.success) {
          setUser(res.data.user);
          setNewName(res.data.user.name); // Set current name as default
          getUserAddress();
        } else {
          navigate('/login');
        }
      } catch (err) {
        setError('Failed to load account information');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Thêm useEffect này để reload dữ liệu khi quay lại trang
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        getUserAddress();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Client-side validation
    if (newPassword !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
    }
    
    if (newPassword.length < 6) {
      return setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    try {
      const res = await axios.put('/api/user/change-pass', {
        currentPassword,
        newPassword
      });
      
      const data = res.data;
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message || 'Đổi mật khẩu thành công' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Đổi mật khẩu thất bại' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi đổi mật khẩu' });
    }
  };

  // NEW: Handle name change
  const handleNameChange = async (e) => {
    e.preventDefault();
    setNameMessage({ type: '', text: '' });

    if (!newName || newName.trim().length === 0) {
      return setNameMessage({ type: 'error', text: 'Vui lòng nhập tên mới' });
    }

    if (newName.trim().length < 2) {
      return setNameMessage({ type: 'error', text: 'Tên phải có ít nhất 2 ký tự' });
    }

    try {
      const res = await axios.put('/api/user/change-name', {
        newName: newName.trim()
      });
      
      const data = res.data;
      
      if (data.success) {
        setNameMessage({ type: 'success', text: data.message || 'Đổi tên thành công' });
        setUser(data.user); // Update user in context
        toast.success('Đổi tên thành công!');
      } else {
        setNameMessage({ type: 'error', text: data.message || 'Đổi tên thất bại' });
      }
    } catch (err) {
      setNameMessage({ type: 'error', text: 'Có lỗi xảy ra khi đổi tên' });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="mt-40 max-w-4xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
      <h1 className='text-4xl text-primary text-center font-bold mb-10'>Tài khoản của tôi</h1>
      {user && (
        <div>
          <div className='flex items-center gap-2 text-xl mb-5'>
            <h1 className=" text-gray-800">Xin chào {user.name}.</h1>
            <p>Với trang này, bạn sẽ quản lý được tất cả thông tin tài khoản của mình.</p>
          </div>
          
          {/* Account Information Section */}
          <div className=" border border-gray-300 rounded-lg">
            <div className='bg-btn mb-5 p-4 rounded-tl-lg rounded-tr-lg text-black font-bold text-lg uppercase'>
              Thông tin tài khoản
            </div>
            <div className="p-4 flex flex-col">
              <span className="font-semibold flex gap-2">Tên người dùng: <span className='font-medium'>{user.name}</span></span> 
              <span className="font-semibold flex gap-2">Email: <span className='font-medium'>{user.email}</span></span> 
            </div>
            <div className='flex gap-4 m-4'>
              <button 
                onClick={() => setOpenNameForm(!openNameForm)}
                className='text-green-600 underline hover:cursor-pointer'>
                Đổi tên
              </button>
              <button 
                onClick={() => setOpenForm(!openForm)}
                className='text-blue-500 underline hover:cursor-pointer'>
                Đổi mật khẩu
              </button>
            </div>
          </div>

          {/* Name Change Form */}
          {openNameForm && (
            <div className="border border-gray-300 rounded-lg mt-6 p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Đổi tên tài khoản</h2>
              
              {nameMessage.text && (
                <div className={`mb-6 p-4 rounded-md w-80 ${
                  nameMessage.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {nameMessage.text}
                </div>
              )}
              
              <form onSubmit={handleNameChange} className="space-y-6">
                <div className="flex flex-col gap-2 w-80">
                  <label htmlFor="newName" className="font-medium text-gray-700">
                    Tên mới
                  </label>
                  <input
                    type="text"
                    id="newName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập tên mới của bạn"
                    required
                  />
                </div>
                
                <div className='flex gap-4'>
                  <button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition duration-200"
                  >
                    Đổi tên
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setOpenNameForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-md transition duration-200"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Password Change Form */}
          {openForm && (
            <div className="border border-gray-300 rounded-lg mt-6 p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Đổi mật khẩu</h2>
              
              {message.text && (
                <div className={`mb-6 p-4 rounded-md w-80 ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}
              
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="flex flex-col gap-2 w-80">
                  <label htmlFor="currentPassword" className="font-medium text-gray-700">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-2 w-80">
                  <label htmlFor="newPassword" className="font-medium text-gray-700">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-2 w-80">
                  <label htmlFor="confirmPassword" className="font-medium text-gray-700">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className='flex gap-4'>
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200"
                  >
                    Đổi mật khẩu
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setOpenForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-md transition duration-200"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delivery Address Section */}
          <div className=" border border-gray-300 rounded-lg mt-10">
            <div className='bg-btn mb-5 p-4 rounded-tl-lg rounded-tr-lg text-black font-bold text-lg uppercase'>
              Địa chỉ giao hàng
            </div>
            <div className="p-4 flex flex-col">
              <p className="text-gray-500">
                {selectedAddress ? (
                  <>
                    {selectedAddress.street}, {selectedAddress.state}, {selectedAddress.city}
                    <br />
                    <span className="flex items-center">
                      Số điện thoại: <span className='pl-2'>{selectedAddress.phone}</span>
                    </span>
                  </>
                ) : (
                  'Chưa có địa chỉ'
                )}
              </p>
            </div>
            <button 
              onClick={() => navigate('/add-address')}
              className='text-blue-500 underline hover:cursor-pointer m-4'>
              Thay đổi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAccount;