import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import axios from "axios";
import axiosInstance from "../apis/instance";
import ChatErrorBanner from "./ChatErrorBanner";
import "./chatWindow.css";

export default function ChatWindow({ chatId }) {
  const [chatMessageData, setChatMessageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!chatId) return;
    const fetchChat = async () => {
      try {
        const res = await axiosInstance.get(`/chat/list/${chatId}`);
        setChatMessageData(res.data);
        // console.log(`채팅방 대화 ${chatId}: 오픈`, res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          alert("접근할 수 없는 채팅입니다.");
          navigate("/");
        } else {
          console.error(`${chatId}의 채팅 불러오기 실패`, err);
        }
      }
    };

    fetchChat();
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [chatMessageData]);

  const onSubmit = async (questionText) => {
    console.log("부모 요청 :", questionText);
    if (!questionText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: questionText,
      timestamp: new Date().toISOString(),
    };

    setChatMessageData((prev) => ({
      ...prev,
      messageList: [...prev.messageList, userMessage],
    }));
    setLoading(true);
    setErrorMessage("");

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseUrl}/chat/ask`,
        {
          chatId,
          question: questionText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const assistantMessage = response.data;
      setChatMessageData((prev) => ({
        ...prev,
        messageList: [...prev.messageList, assistantMessage],
      }));
    } catch (error) {
      console.error("GPT 요청 실패", error);

      const msg =
        error.response?.data?.message ||
        "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

      setErrorMessage(msg);
      setChatMessageData((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="chat_window">
      <div className="scroll_container">
        <ChatMessageList messages={chatMessageData.messageList} />
        <div ref={bottomRef} />
      </div>
      {errorMessage && <ChatErrorBanner errorMessage={errorMessage} />}
      {chatMessageData.writable && (
        <ChatInput onSubmit={onSubmit} disabled={loading} />
      )}
    </div>
  );
}
