import logo from './logo.png';
import main_banner from './main_banner.jpg';
import main_banner_sm from './main_banner_sm.jpg';
import burger from './cate_burger.png'
import fried_chicken from './cate_fried_chicken.png'
import pasta from './cate_pasta.png'
import pizza from './cate_pizza.png'
import sides from './cate_sides.png'
import drinks from './cate_drinks.png'
import sw_hotdog from './cate_sw_hotdog.png'
import sub_banner from './sub_banner.jpg'
import sub_banner_sm from './sub_banner_sm.jpg'
import add_address from './add-address.jpg'
import upLoad_area from './upload_area.png'
import foodIcon from './food-svgrepo-com.svg'
import userAvatar from './user_image_avatar.png'
import check_ic from './check_ic.png'
import logo_vnpay from './logo_vnpay.png'
import ic_cry from './ic_cry.png'
import empty_cart from './empty_cart.png'
import cod from './cod.jpg'
import about from './about.jpg'
import chatbot from './chatbot.png'
 
export const assets = {
    logo,
    main_banner,
    main_banner_sm,
    burger,fried_chicken,pasta,pizza,sides,drinks,sw_hotdog,
    sub_banner,sub_banner_sm,
    add_address,
    upLoad_area,
    foodIcon,
    userAvatar,
    check_ic,
    logo_vnpay,cod,
    about,
    ic_cry,
    empty_cart,
    chatbot
}

export const categories = [
    {
      path: "burgers",
      text: "Burgers",
      image: assets.burger,
      bgColor: "#FFE5B4" 
    },
    {
      path: "fried-chicken",
      text: "Gà rán",
      image: assets.fried_chicken,
      bgColor: "#f4f592" 
    },
    {
      path: "pizza",
      text: "Pizza",
      image: assets.pizza,
      bgColor: "#FFEFD5" 
    },
    {
      path: "pasta",
      text: "Mỳ Ý",
      image: assets.pasta,
      bgColor: "#E0FFFF" 
    },
    {
      path: "sandwich-hotdog",
      text: "Sandwich & Hotdog",
      image: assets.sw_hotdog,
      bgColor: "#F0E68C" 
    },
    {
      path: "sides",
      text: "Món phụ",
      image: assets.sides,
      bgColor: "#FAFAD2" 
    },
    {
      path: "drinks",
      text: "Đồ uống",
      image: assets.drinks,
      bgColor: "#D1E7FF" 
    }
];
  
export const features = [
  {
    icon: "rocket",
    title: "Giao hàng siêu tốc",
    des: "Chỉ 30 phút để món ăn nóng hổi đến tay bạn.",
    type: "solid",
  },
  {
    icon: "baguette",
    title: "Nguyên liệu tươi ngon",
    des: "Chọn lọc từ những nguồn cung uy tín mỗi ngày.",
    type: "solid",
  },
  {
    icon: "support",
    title: "Hỗ trợ 24/7",
    des: "Luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.",
    type: "regular",
  },
  {
    icon: "money",
    title: "Giá cả hợp lý",
    des: "Món ngon chất lượng với mức giá phải chăng.",
    type: "regular",
  },
];

export const linkSections = [
  {
      title: "Liên kết nhanh",
      links: ["Trang chủ", "Món bán chạy", "Khuyến mãi", "Liên hệ", "Câu hỏi thường gặp"],
      hrefs:['/','#','#','/contact','#']
  },
  {
      title: "Hỗ trợ khách hàng",
      links: ["Thông tin giao hàng", "Chính sách đổi/trả", "Phương thức thanh toán", "Theo dõi đơn hàng", "Liên hệ hỗ trợ"],
      hrefs:['#','#','#','#','#']
  },
  {
      title: "Theo dõi chúng tôi",
      links: ["Facebook", "Instagram", "TikTok", "YouTube"],
      hrefs:['https://www.facebook.com/sonbinhkhong2410','https://www.instagram.com/sonbinh_2410/','https://www.tiktok.com/@sonbinh2410?lang=en','https://www.youtube.com/@khongsonbinh5875']
  }
];

export const formatVND = (value) => (value * 1000).toLocaleString("vi-VN") ;
