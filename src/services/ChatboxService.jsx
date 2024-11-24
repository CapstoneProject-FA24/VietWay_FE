const baseURL = import.meta.env.VITE_API_URL;
import axios from 'axios';
import { getCookie } from '@services/AuthenService';

// Function to send a chat message
export const sendChatMessage = async (chatHistory) => {
    const customerToken = getCookie('customerToken');
    try {
        const headers = {};
        if (customerToken) {
            headers['Authorization'] = `Bearer ${customerToken}`;
        }

        const response = await axios.post(`${baseURL}/api/gemini-ai/chat`, chatHistory, { headers });

        return response.data;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};

// Function to query with content
export const queryContent = async (content) => {
    const customerToken = getCookie('customerToken');
    try {
        const headers = {};
        if (customerToken) {
            headers['Authorization'] = `Bearer ${customerToken}`;
        }

        const response = await axios.get(`${baseURL}/api/gemini-ai/query`, {
            headers,
            params: {
                content: content
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error querying content:', error);
        throw error;
    }
};
