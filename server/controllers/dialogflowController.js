import { keyFile, sessionClient } from "../configs/dialogflow.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const detectIntent = async (text, sessionId = 'sbum-session') => {
  const sessionPath = sessionClient.projectAgentSessionPath(
    keyFile.project_id,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: 'vi',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult;
};


// Xử lý webhook chính từ Dialogflow
// export const handleWebhook = async (req, res) => {
//   try {
//     const intentName = req.body.queryResult.intent.displayName;
//     const parameters = req.body.queryResult.parameters;
    
//     console.log(`Received intent: ${intentName} with parameters:`, parameters);

//     switch (intentName) {
//       case 'get-product-info':
//         return await getProductInfo(parameters, res);
//       case 'check-order-status':
//         return await checkOrderStatus(parameters, res);
//       case 'get-menu-categories':
//         return await getMenuCategories(res);
//       case 'get-dishes-by-category':
//         return await getDishesByCategory(parameters, res);
//       default:
//         return res.json({
//           fulfillmentText: 'Tôi không hiểu yêu cầu của bạn. Bạn có thể nói rõ hơn được không?'
//         });
//     }
//   } catch (error) {
//     console.error('Error in dialogflow webhook:', error);
//     return res.json({
//       fulfillmentText: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.'
//     });
//   }
// };

// Xử lý webhook chính từ Dialogflow (cải tiến)
export const handleWebhook = async (req, res) => {
  try {
    // Kiểm tra request body
    if (!req.body || !req.body.queryResult) {
      return res.json({
        fulfillmentText: 'Yêu cầu không hợp lệ.'
      });
    }

    const intentName = req.body.queryResult.intent?.displayName;
    const parameters = req.body.queryResult.parameters || {};
    const queryText = req.body.queryResult.queryText;
    
    console.log(`Received intent: ${intentName} with parameters:`, parameters);
    console.log(`User query: ${queryText}`);

    // Kiểm tra intent có tồn tại không
    if (!intentName) {
      return res.json({
        fulfillmentText: 'Tôi không hiểu ý bạn. Bạn có thể hỏi về menu, món ăn, hoặc đơn hàng.'
      });
    }

    switch (intentName) {
      case 'get-product-info':
        return await getProductInfo(parameters, res);
      case 'check-order-status':
        return await checkOrderStatus(parameters, res);
      case 'get-menu-categories':
        return await getMenuCategories(res);
      case 'get-dishes-by-category':
        return await getDishesByCategory(parameters, res);
      case 'get-product-details':
        return await getProductDetails(parameters, res);
      case 'get-available-dishes':
        return await getAvailableDishes(parameters, res);
      case 'Default Welcome Intent':
        return res.json({
          fulfillmentText: 'Xin chào! Tôi có thể giúp bạn:\n🍽️ Xem menu và danh mục món ăn\n🔍 Tìm kiếm thông tin món ăn\n📦 Kiểm tra trạng thái đơn hàng\n\nBạn cần gì ạ?'
        });
      case 'Default Fallback Intent':
        return res.json({
          fulfillmentText: 'Xin lỗi, tôi không hiểu yêu cầu của bạn. Bạn có thể:\n- Hỏi "có những danh mục nào?"\n- Hỏi "món gì trong danh mục [tên danh mục]?"\n- Hỏi "thông tin về món [tên món]"\n- Hỏi "trạng thái đơn hàng [mã đơn]"'
        });
      default:
        return res.json({
          fulfillmentText: `Intent "${intentName}" chưa được xử lý. Vui lòng liên hệ quản trị viên.`
        });
    }
  } catch (error) {
    console.error('Error in dialogflow webhook:', error);
    return res.json({
      fulfillmentText: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.'
    });
  }
};

// Lấy danh sách category từ Product
const getMenuCategories = async (res) => {
  try {
    // Lấy tất cả category từ Product, dùng distinct để lấy danh sách duy nhất
    const categories = await Product.distinct('category');

    if (!categories.length) {
      return res.json({
        fulfillmentText: 'Hiện tại chưa có danh mục món ăn nào.'
      });
    }

    // Trả về danh sách category dạng chuỗi phân tách bằng dấu phẩy
    return res.json({
      fulfillmentText: `Menu hiện có các danh mục: ${categories.join(', ')}. Bạn muốn xem danh mục nào?`
    });
  } catch (error) {
    console.error('Error in getMenuCategories:', error);
    return res.json({
      fulfillmentText: 'Đã xảy ra lỗi khi truy vấn danh mục món ăn.'
    });
  }
};

const getDishesByCategory = async (parameters, res) => {
  try {
    const categoryRaw = parameters['category'];
    const categoryName = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw;

    if (!categoryName) {
      return res.json({
        fulfillmentText: 'Bạn cần cung cấp danh mục món ăn.'
      });
    }

    const products = await Product.find({
      category: { $regex: categoryName, $options: 'i' }
    });

    if (!products.length) {
      const allCategories = await Product.distinct('category');
      return res.json({
        fulfillmentText: `Không tìm thấy món ăn thuộc danh mục "${categoryName}". Các danh mục có sẵn: ${allCategories.join(', ')}.`
      });
    }

    const productList = products.map(p => `${p.name} - ${p.offerPrice || p.price}k`).join(';');

    return res.json({
      fulfillmentText: `Các món trong danh mục "${categoryName}":\n${productList}`
    });
  } catch (error) {
    console.error('Lỗi truy vấn món ăn:', error);
    return res.json({
      fulfillmentText: 'Đã xảy ra lỗi khi truy vấn món ăn.'
    });
  }
};


// Handler cho intent get-product-info
const getProductInfo = async (parameters, res) => {
  try {
    const productName = parameters.product;
    
    if (!productName) {
      return res.json({
        fulfillmentText: 'Bạn cần cung cấp tên sản phẩm để tôi có thể tìm kiếm.'
      });
    }
    
    // Truy vấn sản phẩm từ database
    const product = await Product.findOne({
      name: { $regex: productName, $options: 'i' }
    });
    
    if (!product) {
      return res.json({
        fulfillmentText: `Không tìm thấy sản phẩm ${productName} trong hệ thống.`
      });
    }
    
    return res.json({
      fulfillmentText: `Sản phẩm ${product.name} có giá ${product.price}đ và hiện ${product.quantity > 0 ? 'còn' : 'hết'} hàng.`
    });
  } catch (error) {
    console.error('Error in getProductInfo:', error);
    return res.json({
      fulfillmentText: 'Đã xảy ra lỗi khi tìm kiếm thông tin sản phẩm.'
    });
  }
};

// Handler cho intent check-order-status
const checkOrderStatus = async (parameters, res) => {
  try {
    const orderId = parameters.orderId;
    
    if (!orderId) {
      return res.json({
        fulfillmentText: 'Bạn cần cung cấp mã đơn hàng để tôi có thể kiểm tra.'
      });
    }
    
    // Truy vấn đơn hàng từ database
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.json({
        fulfillmentText: `Không tìm thấy đơn hàng có mã ${orderId}.`
      });
    }
    
    return res.json({
      fulfillmentText: `Đơn hàng ${orderId} hiện đang ở trạng thái: ${order.status}.`
    });
  } catch (error) {
    console.error('Error in checkOrderStatus:', error);
    return res.json({
      fulfillmentText: 'Đã xảy ra lỗi khi kiểm tra trạng thái đơn hàng.'
    });
  }
};

export const handleChatbotQuery = async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const result = await detectIntent(message, sessionId);
    // Trả về text trả lời của Dialogflow cho frontend
    return res.json({ reply: result.fulfillmentText });
  } catch (error) {
    console.error('Error in detectIntent:', error);
    return res.status(500).json({ error: 'Lỗi khi xử lý câu hỏi' });
  }
};