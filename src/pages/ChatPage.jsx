import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./chatPage.css";

import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import axiosInstance from "../apis/instance";

export default function ChatPage() {
  const [chatHistoryList, setChatHistoryList] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [latestChatId, setLatestChatId] = useState(null);
  const [searchParams] = useSearchParams();
  const paramChatId = searchParams.get("chatId");

  // 채팅 목록 불러오기
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const res = await axiosInstance.get("/chat/list");
        setChatHistoryList(res.data);
        if (res.data.length > 0) {
          setLatestChatId(res.data[0].chatId);
        }
      } catch (error) {
        console.error("채팅 목록 불러오기 실패", error);
      }
    };

    fetchChatList();
  }, []);
  useEffect(() => {}, [paramChatId, selectedChatId]);

  const activeChatId = paramChatId || selectedChatId || latestChatId;

  return (
    <div className="chat_container">
      <nav aria-label="지난 기록">
        <ChatSidebar
          list={chatHistoryList}
          selectedChatId={activeChatId}
          onSelect={setSelectedChatId}
          currentLatestChatId={latestChatId}
        />
      </nav>
      <section className="chat_window">
        <ChatWindow chatId={activeChatId} />
      </section>
    </div>
  );
}
