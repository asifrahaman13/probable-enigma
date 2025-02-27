'use client';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { backendSocket, backendUrl } from '../../constants/creds';
import { MessageState } from '../../types/documents';

export default function ChatMode() {
  const dispath = useDispatch();
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageState[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    const webSocket = new WebSocket(`${backendSocket}/ws/2280605800`);

    wsRef.current = webSocket;

    webSocket.onopen = () => console.log('Connected to WebSocket');

    webSocket.onmessage = (event) => {
      console.log('Message received:', event.data);
      try {
        const receivedMessage: MessageState = JSON.parse(event.data);

        if (receivedMessage.finished) {
          setIsFinished(true);
        }
        receivedMessage.timestamp = new Date().toLocaleTimeString();
        receivedMessage.sender = 'AI';

        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    webSocket.onerror = (error) => console.error('WebSocket error:', error);

    webSocket.onclose = () => {
      console.log('WebSocket closed');
    };
  }, []);

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: MessageState = {
        message: userMessage,
        sender: 'User',
        timestamp: new Date().toLocaleTimeString(),
        finished: false,
      };
      wsRef.current.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setUserMessage('');
    } else {
      console.error(
        'WebSocket is not open. ReadyState:',
        wsRef.current?.readyState
      );
    }
  };

  async function dumpResponse() {
    try {
      if (messages === undefined) {
        return;
      }
      console.log(messages?.at(-1)?.message ?? '');
      const response = await axios.post(`${backendUrl}/api/update-details`, {
        message: messages?.at(-1)?.message ?? '',
      });

      if (response.status === 200) {
        console.log(response.data.message);
        dispath({
          type: 'detailsSelection/setDetails',
          payload: response.data.message,
        });
        dispath({ type: 'pageSelection/setPage', payload: 'COMPLETE' });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  return (
    <div className="flex flex-col justify-center h-screen items-center">
      <div className="shadow-xl flex flex-col gap-4 w-full lg:w-1/4 h-full lg:h-3/4 max-h-1/2 p-4 rounded-lg">
        <div className="w-full flex justify-center">
          <div className="text-xl font-semibold text-gray-900">CarePay</div>
        </div>

        <div className="mt-4 flex-grow overflow-auto border p-2">
          {messages?.map((msg, index) => (
            <div
              key={index}
              className={`p-2 ${
                msg.sender === 'User'
                  ? 'text-blue-600 bg-blue-50 text-end'
                  : 'text-green-600'
              }`}
            >
              <strong>{msg.sender}: </strong>
              {msg.message}{' '}
              <span className="text-gray-500 text-xs">({msg.timestamp})</span>
            </div>
          ))}
        </div>

        {isFinished ? (
          <div className="flex w-full gap-2">
            <button
              className="bg-blue-800 text-white w-1/2 text-center rounded-md py-2"
              onClick={dumpResponse}
            >
              Yes
            </button>
            <button
              className="bg-blue-800 text-white w-1/2 text-center rounded-md py-2"
              onClick={() => setIsFinished(false)}
            >
              NO
            </button>
          </div>
        ) : (
          <div className="flex-shrink-0">
            <div className="border-1 flex">
              <input
                type="text"
                value={userMessage}
                className="border flex-grow"
                onChange={(e) => setUserMessage(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="bg-black text-white p-2 rounded-md"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
