import React, { useState, useRef, useEffect } from 'react';
import '@styles/Chatbox.css';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestedQuestions = [
    "Tôi muốn tìm tour du lịch phù hợp với ngân sách 5 triệu đồng",
    "Có tour du lịch nào phù hợp cho gia đình có trẻ nhỏ không?",
    "Tour du lịch biển nào đang được ưa chuộng nhất?",
    "Tôi muốn tìm tour du lịch 3 ngày 2 đêm ở miền Bắc"
  ];

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    setShowSuggestions(false);
  };

  const handleFocusInput = () => {
    if (messages.length === 0) {
      setShowSuggestions(true);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    setShowSuggestions(false);
    // Add user message
    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // TODO: Replace with your actual API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();
      
      // Add AI response
      const aiMessage = {
        text: data.response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h2>Tư Vấn Tour Du Lịch</h2>
        <p className="header-description">Hãy để AI của chúng tôi giúp bạn tìm tour du lịch phù hợp nhất</p>
      </div>

      {showSuggestions && (
        <div className="welcome-message">
          <h3>Xin chào! Tôi có thể giúp gì cho bạn?</h3>
          <p>Bạn có thể chọn một trong những câu hỏi gợi ý dưới đây hoặc tự đặt câu hỏi:</p>
          <div className="suggested-questions">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="suggested-question-btn"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="messages-container">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender}-message`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="timestamp">{message.timestamp}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onFocus={handleFocusInput}
          placeholder="Nhập câu hỏi của bạn tại đây..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
          Gửi
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
