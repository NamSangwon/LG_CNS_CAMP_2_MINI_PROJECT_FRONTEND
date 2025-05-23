import { useState } from "react";
import sendIcon from "../assets/icons/sendIcon.png";
import "./chatInput.css";

export default function ChatInput({ onSubmit, disabled }) {
  const [text, setText] = useState("");
  const maxLength = 500;

  const handleChange = (e) => {
    const input = e.target.value;
    if (input.length <= maxLength) {
      setText(input);
    }
  };

  const handleSubmit = () => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (trimmedText.length > maxLength) {
      alert("최대 500자까지 입력할 수 있습니다.");
      return;
    }
    console.log("자식 요청 :", trimmedText);
    onSubmit(trimmedText);
    setText("");
  };

  return (
    <>
      <div className="chat_input_counter">
        {text.length} / {maxLength}자
      </div>
      <form
        className="chat_input_form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="chat_input_box">
          <textarea
            className="chat_input_textarea"
            style={{ lineHeight: "1.4", overflowY: "auto" }}
            disabled={disabled}
            value={text}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="질문을 입력하세요"
            rows={4}
            cols={50}
          />
          <div className="chat_input_placeholder">
            {!disabled ? (
              <img
                src={sendIcon}
                className="send_icon"
                alt="send"
                width={36}
                height={36}
                type="submit"
                onClick={handleSubmit}
              />
            ) : (
              <div className="chat_spinner_container">
                <div className="chat_spinner"></div>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
