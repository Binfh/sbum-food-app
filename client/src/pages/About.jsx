import React from 'react';
import { assets } from '../assets/assets';
import {Link} from 'react-router-dom'

const About = () => {
    return (
        <div className='mt-32'>
            <img 
                src={assets.about} 
                alt="SBum Fastfood" 
                className="relative"
            />
            <p className='absolute top-[220px] text-[20px] text-white left-20'><Link className='font-bold hover:underline pl-1' to={'/'}>Trang chủ</Link> / <span>Giới thiệu</span> </p>
            <div className=" bg-yellow-100 py-10">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-700 leading-relaxed mb-4">
                        SBum là nơi mà hương vị, niềm vui và sự tiện lợi hội tụ trong từng khoảnh khắc. 
                        Chúng tôi không đơn thuần là một chuỗi cửa hàng thức ăn nhanh – mà là một không gian nơi mọi người có thể tìm thấy sự ấm áp, thân thiện và một bữa ăn chất lượng giữa nhịp sống hiện đại.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Từ những ngày đầu tiên, SBum đã được xây dựng dựa trên tình yêu dành cho ẩm thực và mong muốn mang đến trải nghiệm đáng nhớ cho mỗi thực khách. 
                        Chúng tôi tin rằng một bữa ăn ngon không chỉ nằm ở hương vị, mà còn ở cảm giác được chào đón và phục vụ tận tâm. 
                        Mỗi chi tiết nhỏ – từ nguyên liệu, cách chế biến đến dịch vụ – đều được chăm chút để tạo nên một tổng thể hài hòa và đáng tin cậy.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Chúng tôi luôn nỗ lực không ngừng để đổi mới, phát triển và lắng nghe ý kiến từ cộng đồng khách hàng – những người đã và đang đồng hành cùng chúng tôi trong hành trình này. 
                        Với SBum, mỗi ngày là một cơ hội để lan tỏa năng lượng tích cực, mang lại nụ cười và sự hài lòng thông qua từng trải nghiệm tại cửa hàng.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Dù bạn là khách quen hay lần đầu ghé thăm, SBum luôn chào đón bạn như một người thân trong gia đình. 
                        Chúng tôi rất vinh dự được góp mặt trong những phút giây sum họp, chia sẻ và thư giãn của bạn – và hy vọng sẽ tiếp tục là lựa chọn đồng hành của bạn trong nhiều năm tới.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
