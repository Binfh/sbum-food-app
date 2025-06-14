import dialogflow from '@google-cloud/dialogflow';
import { readFileSync } from 'fs';
import path from 'path';

// Đường dẫn tới file key.json
const keyPath = path.resolve('key.json');

// Đọc nội dung key
const keyFile = JSON.parse(readFileSync(keyPath));

// Tạo session client
const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    client_email: keyFile.client_email,
    private_key: keyFile.private_key
  }
});

export { sessionClient, keyFile };
