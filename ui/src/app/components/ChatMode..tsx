'use client';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { backendSocket, backendUrl } from '../../constants/creds';
import { MessageState } from '../../types/documents';
import { RootState } from '@/lib/store';

export default function ChatMode() {
  const dispath = useDispatch();
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageState[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const otp = useSelector((state: RootState) => state.otpSelection);

  useEffect(() => {
    const webSocket = new WebSocket(`${backendSocket}/ws/${otp.phone_number}`);
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
        setIsThinking(false);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    webSocket.onerror = (error) => console.error('WebSocket error:', error);
    webSocket.onclose = () => {
      console.log('WebSocket closed');
    };
  }, [otp.phone_number]);

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
      setIsThinking(true);
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
      const response = await axios.post(
        `${backendUrl}/api/update-details/${otp.phone_number}`,
        {
          message: messages?.at(-1)?.message ?? '',
        }
      );

      if (response.status === 200) {
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

        <div className="mt-4 flex-grow overflow-scroll no-scrollbar border p-2">
          {messages?.map((msg, index) => (
            <div key={index} className="flex flex-col gap-4">
              {msg.sender === 'AI' && (
                <>
                  <div className="p-2 w-4/5 bg-green-50 text-green-600">
                    <strong>AI: </strong>
                    <span
                      dangerouslySetInnerHTML={{ __html: msg.message }}
                      className="whitespace-pre-wrap"
                    />
                  </div>
                  <span className="text-gray-500 text-xs self-start">
                    ({msg.timestamp})
                  </span>
                </>
              )}

              {msg.sender === 'User' && (
                <div className="p-2 flex flex-col items-end text-blue-600">
                  <div className="max-w-4/5 text-end px-2 bg-blue-50 flex justify-end items-center text-blue-600">
                    <span
                      dangerouslySetInnerHTML={{ __html: msg.message }}
                      className="whitespace-pre-wrap"
                    />
                  </div>
                  <span className="text-gray-500 text-xs">
                    ({msg.timestamp})
                  </span>
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="p-2 text-gray-500 text-center">
              AI is thinking...
            </div>
          )}
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
              <textarea
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
