import React from "react";
import "./input.css";
const Input = ({ message, sendMessage, setMessage }) => {
  return (
    <form action="" className="form">
      <input
        className="input"
        placeholder="type a message"
        value={message}
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
      />
      <button className="sendButton" onClick={(e) => sendMessage(e)}>
        send
      </button>
    </form>
  );
};

export default Input;
