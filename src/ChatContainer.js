import React from "react";
import ChatsInScroll from "./ChatsInScroll";
import ChatInput from "./ChatInput";
import "./ChatContainer.css";

function ChatContainer() {
  return (
    <div className="ChatContainer">
      <ChatsInScroll />
      <ChatInput />
    </div>
  );
}

export default ChatContainer;
