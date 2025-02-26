"use client";
import React, { useEffect, useRef, useState } from "react";

type MessageState = {
  message: string;
  sender: string;
  timestamp: string;
  finished: boolean;
};

export default function ChatMode() {
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageState[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8000/ws/2280605800");

    wsRef.current = webSocket;

    webSocket.onopen = () => console.log("Connected to WebSocket");

    webSocket.onmessage = (event) => {
      console.log("Message received:", event.data);
      try {
        const receivedMessage: MessageState = JSON.parse(event.data);
        receivedMessage.timestamp = new Date().toLocaleTimeString();
        receivedMessage.sender = "AI";

        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    webSocket.onerror = (error) => console.error("WebSocket error:", error);

    webSocket.onclose = () => {
      console.log("WebSocket closed");
    };
  }, []);

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: MessageState = {
        message: userMessage,
        sender: "User",
        timestamp: new Date().toLocaleTimeString(),
        finished: false,
      };
      wsRef.current.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setUserMessage("");
    } else {
      console.error(
        "WebSocket is not open. ReadyState:",
        wsRef.current?.readyState
      );
    }
  };

  return (
    <div className="flex flex-col justify-center h-screen items-center">
      <div className="shadow-xl flex flex-col gap-4 w-full lg:w-1/4 h-full lg:h-3/4 max-h-1/2 p-4 rounded-lg">
        <div className="w-full flex justify-center">
          <div className="text-xl font-semibold text-gray-900">CarePay</div>
        </div>

        <div className="mt-4 h-64 overflow-auto border p-2">
          {messages?.map((msg, index) => (
            <div
              key={index}
              className={`p-2 ${
                msg.sender === "User"
                  ? "text-blue-600 text-end"
                  : "text-green-600"
              }`}
            >
              <strong>{msg.sender}: </strong>
              {msg.message}{" "}
              <span className="text-gray-500 text-xs">({msg.timestamp})</span>
            </div>
          ))}
        </div>
        <div>
          <div className="border-1 flex">
            <input
              type="text"
              value={userMessage}
              className="border"
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="bg-black text-white  p-2 rounded-md font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
