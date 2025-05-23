import ChatMessageItem from "./ChatMessageItem";

export default function ChatMessageList({ messages }) {
  if (!messages || messages.length === 0) return null;
  return (
    <>
      {messages.map((message, idx) => (
        <ChatMessageItem
          key={idx}
          role={message.role}
          content={message.content}
        />
      ))}
    </>
  );
}
