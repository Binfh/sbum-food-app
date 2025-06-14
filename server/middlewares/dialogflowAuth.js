import 'dotenv/config';

// Middleware này sẽ kiểm tra xem request có đến từ Dialogflow không
// Bạn có thể thêm logic xác thực header hoặc token tại đây
export const verifyDialogflowRequest = (req, res, next) => {
  // Kiểm tra header hoặc một secret key trong request
  const authHeader = req.headers['dialogflow-auth'];
  const dialogflowSecret = process.env.DIALOGFLOW_SECRET;
  
  // Ví dụ xác thực đơn giản (bạn có thể thay đổi theo nhu cầu)
  if (!dialogflowSecret || authHeader === dialogflowSecret) {
    return next();
  }
  
  // Nếu xác thực thất bại
  console.log('Unauthorized Dialogflow request');
  return res.status(401).json({ error: 'Unauthorized request' });
};