import React, { useState, useRef, useEffect } from 'react';
import '@styles/Chatbox.css';
import { queryContent, sendChatMessage } from '@services/ChatboxService';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showSuggestionsBox, setShowSuggestionsBox] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [usedQuestions, setUsedQuestions] = useState(new Set());
  const [chatHistory, setChatHistory] = useState([]);

  const fetchSuggestedQuestions = async () => {
    try {
      const response = await queryContent(
        "Hãy tạo cho tôi 5 câu gợi ý dưới góc nhìn của người dùng để người dùng chọn sao cho họ có thể tìm tour du lịch thích hợp. Hãy tạo các câu ví dụ như: Tôi muốn tìm tour du lịch phù hợp với ngân sách 5 triệu đồng, Có tour du lịch nào phù hợp cho gia đình có trẻ nhỏ không?, Tour du lịch biển nào đang được ưa chuộng nhất?, Tôi muốn tìm tour du lịch 3 ngày 2 đêm ở miền Bắc,... Lưu ý rằng các câu chỉ liên quan đến du lịch trong nội địa Việt Nam"
      );
      const responseText = response.text || response;
      const questions = responseText
        .split('\n')
        .filter(line => line.match(/^\d+\./))
        .map(line => {
          const mainQuestion = line
            .split('(')[0]          
            .replace(/\*\*/g, '')    
            .replace(/^\d+\.\s*/, '') 
            .trim();                 
          return mainQuestion;
        });

      setSuggestedQuestions(questions);
    } catch (error) {
      console.error('Error fetching suggested questions:', error);
      setSuggestedQuestions([]);
    }
  };

  useEffect(() => {
    fetchSuggestedQuestions();
  }, []);

  useEffect(() => {
    if (isFirstVisit) {
      setShowSuggestions(true);
      setIsFirstVisit(false);
    }
  }, [isFirstVisit]);

  const handleSuggestedQuestion = async (question) => {
    setInputMessage(question);
    setShowSuggestions(false);
    setShowSuggestionsBox(false);
    
    const newUsedQuestions = new Set(usedQuestions);
    newUsedQuestions.add(question);
    setUsedQuestions(newUsedQuestions);

    if (newUsedQuestions.size >= suggestedQuestions.length) {
      setUsedQuestions(new Set());
      fetchSuggestedQuestions();
    }

    const updatedHistory = [
      ...chatHistory,
      { isUser: true, text: question }
    ];
    
    const userMessage = {
      text: question,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(updatedHistory);
      
      const aiMessage = {
        text: response.text || response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      setChatHistory([
        ...updatedHistory,
        { isUser: false, text: response.text || response }
      ]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };

  const toggleSuggestions = () => {
    setShowSuggestionsBox(!showSuggestionsBox);
    setShowSuggestions(!showSuggestions);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    setShowSuggestions(false);
    setShowSuggestionsBox(false);
    
    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    const updatedHistory = [
      ...chatHistory,
      { isUser: true, text: inputMessage }
    ];
    setChatHistory(updatedHistory);
    
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(updatedHistory);
      
      const aiMessage = {
        text: response.text || response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      setChatHistory([
        ...updatedHistory,
        { isUser: false, text: response.text || response }
      ]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAIResponse = (text) => {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="emphasis">$1</span>');
    formattedText = formattedText.split('\n').map(line => {
      if (line.trim().startsWith('*')) {
        return `<li>${line.substring(1).trim()}</li>`;
      }
      if (line.includes(':')) {
        return `<div class="section">${line}</div>`;
      }
      return `<p>${line}</p>`;
    }).join('');
    
    formattedText = formattedText.replace(/<li>.*?<\/li>/g, match => {
      return `<ul>${match}</ul>`;
    });
    
    return formattedText;
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h2>Tư Vấn Tour Du Lịch</h2>
        <p className="header-description">Hãy để AI của chúng tôi giúp bạn tìm tour du lịch phù hợp nhất</p>
      </div>

      {!isFirstVisit && !showSuggestions && (
        <button className="suggestion-toggle-btn" onClick={toggleSuggestions}>
          Gợi ý câu hỏi
        </button>
      )}

      {showSuggestions && (
        <div className="welcome-message">
          {isFirstVisit && <h3>Xin chào! Tôi có thể giúp gì cho bạn?</h3>}
          <div className="suggestions-header">
            <p>Bạn có thể chọn một trong những câu hỏi gợi ý dưới đây hoặc tự đặt câu hỏi:</p>
            {!isFirstVisit && (
              <button className="close-suggestions-btn" onClick={() => {
                setShowSuggestions(false);
                setShowSuggestionsBox(false);
              }}> × </button>
            )}
          </div>
          <div className="suggested-questions">
            {suggestedQuestions.map((question, index) => (
              <button key={index} className="suggested-question-btn" onClick={() => handleSuggestedQuestion(question)}>
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}-message`}>
            <div className="message-content">
              {message.sender === 'ai' ? (
                <p dangerouslySetInnerHTML={{ __html: formatAIResponse(message.text) }} />
              ) : (
                <p>{message.text}</p>
              )}
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
        <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} 
        placeholder="Nhập câu hỏi của bạn tại đây..." disabled={isLoading} />
        <button type="submit" disabled={isLoading || !inputMessage.trim()}>Gửi</button>
      </form>
    </div>
  );
};

export default Chatbox;
