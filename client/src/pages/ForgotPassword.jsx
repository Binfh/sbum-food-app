import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const { setShowUserLogin,navigate, axios } = useAppContext();
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập mã OTP và mật khẩu mới
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Step 1: Gửi mã OTP
  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    if (!email) {
      setMessage({ type: 'error', text: 'Vui lòng nhập email' });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/user/forgot-password', { email });
      const data = res.data;

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setStep(2);
        toast.success('Mã xác nhận đã được gửi đến email của bạn!');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi gửi mã xác nhận' });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    // Validation
    if (!resetCode || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/user/reset-password', {
        email,
        resetCode,
        newPassword
      });
      
      const data = res.data;

      if (data.success) {
        toast.success('Đặt lại mật khẩu thành công!');
        navigate('/')
        setShowUserLogin(true);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi đặt lại mật khẩu' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 
              ? 'Nhập email của bạn để nhận mã xác nhận'
              : 'Nhập mã xác nhận và mật khẩu mới'
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {step === 1 ? (
            // Step 1: Email Input
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email của bạn
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition duration-200"
              >
                {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowUserLogin(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          ) : (
            // Step 2: OTP and New Password
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="resetCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Mã xác nhận (6 chữ số)
                </label>
                <input
                  type="text"
                  id="resetCode"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Mã đã được gửi đến: <span className="font-medium">{email}</span>
                </p>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition duration-200"
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  ← Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Gửi lại mã
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Mã xác nhận có hiệu lực trong 10 phút</p>
          <p>Kiểm tra cả thư mục spam nếu không thấy email</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;