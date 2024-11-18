import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, TextField, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBox from "@pages/homepage/chatbox/ChatBox";

const ChatBoxPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { text: message, sender: 'user' }]);
      setMessage('');
      // Add your chat logic here
    }
  };

  return (
    <>
      {/* Chat Button - moved to right */}
      <IconButton
        onClick={handleToggle}
        sx={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          backgroundColor: '#3572EF',
          color: 'white',
          borderRadius: 4,
          '&:hover': {
            backgroundColor: '#2954b0',
            borderRadius: 4,
          },
          width: 56,
          height: 56,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
        }}
      >
        <ChatIcon />
      </IconButton>

      {/* Chat Box - moved to right */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 10,
          right: 80,
          width: 750,
          height: 530,
          display: 'flex',
          flexDirection: 'column', borderRadius: 10,
          transform: isOpen ? 'translateX(0)' : 'translateX(850px)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 1000,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <ChatBox/>
      </Paper>
    </>
  );
};

export default ChatBoxPopup;
