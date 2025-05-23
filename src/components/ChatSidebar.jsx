import { useNavigate } from "react-router-dom";
import "./chatSidebar.css";

export default function ChatSidebar({
  list,
  selectedChatId,
  onSelect,
  currentLatestChatId,
}) {
  const navigate = useNavigate();

  if (!list) return null;
  if (list.length === 0) return <div>채팅이 없습니다</div>;

  const handleSelect = (chatId) => {
    onSelect(chatId);
    chatId === currentLatestChatId
      ? navigate("/chat")
      : navigate(`/chat?chatId=${chatId}`);
  };
  return (
    <div>
      <ul className="sidebar_list">
        {list.map((chat) => (
          <li
            key={chat.chatId}
            onClick={() => handleSelect(chat.chatId)}
            className={`sidebar_item ${
              selectedChatId === chat.chatId ? "selected" : ""
            }`}
          >
            <div className="sidebar_title_wrapper">
              <p className="sidebar_title">{chat.summaryTitle}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
