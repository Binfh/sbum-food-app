import { useState, useRef, useEffect } from 'react';
import {assets} from '../assets/assets'
import 'boxicons'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' },
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setIsTyping(true);
    
    const currentInput = input;
    setInput('');

    try {
      const response = await fetch('http://localhost:3000/api/dialogflow/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, sessionId: 'user-session-1' }),
      });

      const data = await response.json();

      // Simulate typing delay
      setTimeout(() => {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: data.reply || 'Xin lỗi, tôi không thể trả lời ngay bây giờ.' }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Lỗi kết nối server. Vui lòng thử lại sau.' }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <img src={assets.chatbot} alt="chatbot" onClick={() => setIsMinimized(true)} className='w-20 object-cover cursor-pointer'/>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 z-50">
      {/* Chat Container */}
      {isMinimized && (<div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-red-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <img src={assets.chatbot} alt="avatar-chatbot" />
            </div>
            <div>
              <h3 className="text-white font-semibold">SBum Chatbot</h3>
              <p className="text-white/80 text-sm">Đang hoạt động</p>
            </div>
          </div>
          <div onClick={() => setIsMinimized(false)} className='cursor-pointer'><box-icon name="x" color="white"/></div>
        </div>

        {/* Messages */}
        <div className="h-72 p-4 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/50 backdrop-blur-sm">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                      : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-bl-md border border-gray-200/50'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2">
                <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-bl-md shadow-lg border border-gray-400/50">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/90 backdrop-blur-xl border-t border-gray-500/50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="w-full p-3 pr-12 bg-gray-100/80 backdrop-blur-sm border border-gray-400/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300 text-sm"
                rows="1"
                style={{
                  minHeight: '44px',
                  maxHeight: '120px',
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-2 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:cursor-not-allowed disabled:transform-none"
            >
              <box-icon
                name="send"
                color="white"
              />
            </button>
          </div>
        </div>
      </div>)}
    </div>
  );
};

export default Chatbot;