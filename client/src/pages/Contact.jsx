import { useState } from 'react'
import NewLetter from '../components/NewLetter';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    alert('Cảm ơn bạn đã gửi thông tin! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="mt-32 font-sans bg-gray-50 text-gray-800">
      <div className="bg-yellow-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-2">Liên Hệ Với SBum</h1>
            <div className="flex items-center text-lg">
              <span>Hãy cho chúng tôi biết bạn cần gì</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-red-600 p-3 rounded-full mb-4 flex items-center justify-center">
              <box-icon name='phone' className="text-xl" color='white'></box-icon>
            </div>
            <h3 className="font-bold text-lg mb-2">Hotline</h3>
            <p>1900 0000</p>
            <p>0123 456 789</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-red-600 p-3 rounded-full mb-4 flex items-center justify-center">
              <box-icon name='envelope' className="text-xl" color='white'></box-icon>
            </div>
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <p>info@sbum.com.vn</p>
            <p>hotro@sbum.com.vn</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-red-600 p-3 rounded-full mb-4 flex items-center justify-center">
              <box-icon name='home' className="text-xl" color='white'></box-icon>
            </div>
            <h3 className="font-bold text-lg mb-2">Trụ sở chính</h3>
            <p>Nhà hàng Fastfood SBum</p>
            <p>Quận 1, TP. Hồ Chí Minh</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-red-600 p-3 rounded-full mb-4">
              <box-icon name='time' color='white'></box-icon>
            </div>
            <h3 className="font-bold text-lg mb-2">Giờ làm việc</h3>
            <p>Thứ 2 - Chủ nhật</p>
            <p>9:00 - 22:00</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-red-600">Gửi thông tin liên hệ</h2>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block mb-1 font-medium">Họ và tên *</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-1 font-medium">Email *</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="phone" className="block mb-1 font-medium">Số điện thoại *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block mb-1 font-medium">Chủ đề *</label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="block mb-1 font-medium">Nội dung *</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="5"
                    className="w-full border border-gray-300 rounded-md p-2"
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 flex items-center justify-center"
                >
                  <span>Gửi thông tin</span>
                  <box-icon name='send' color='white'></box-icon>
                </button>
              </div>
            </div>

            <div className="rounded-md overflow-hidden">
                <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197667!2d106.69181227586932!3d10.777255789387898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3b1ecb0111%3A0x45e6492955b75b34!2zQuG6v24gVGjDoG5oLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1699529022239!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Câu hỏi thường gặp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2 text-red-600">Thời gian giao hàng là bao lâu?</h3>
            <p>SBum cam kết giao hàng trong vòng 30 phút kể từ khi xác nhận đơn hàng thành công. Nếu không, khách hàng sẽ được tặng 1 phần khoai tây chiên miễn phí cho đơn hàng tiếp theo.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2 text-red-600">Làm thế nào để đặt tiệc sinh nhật tại SBum?</h3>
            <p>Bạn có thể liên hệ với chúng tôi qua số hotline 1900 0000 hoặc điền form liên hệ trên website với chủ đề "Đặt tiệc sinh nhật" để được nhân viên hỗ trợ báo giá và sắp xếp.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2 text-red-600">SBum có chương trình khách hàng thân thiết không?</h3>
            <p>Có, SBum có chương trình khách hàng thân thiết SBum Club. Tích điểm với mỗi đơn hàng và đổi quà tặng hấp dẫn. Đăng ký thành viên miễn phí tại bất kỳ cửa hàng SBum nào.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2 text-red-600">Làm thế nào để trở thành đối tác của SBum?</h3>
            <p>Nếu bạn quan tâm đến việc trở thành đối tác/nhà cung cấp hoặc nhượng quyền SBum, vui lòng gửi email đến doitac@sbum.com.vn với đầy đủ thông tin và yêu cầu của bạn.</p>
          </div>
        </div>
      </div>

      <NewLetter/>
    </div>
  );
}

export default Contact