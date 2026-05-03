import { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello 👋 I am Nova AI", sender: "ai" },
  ]);
  const [input, setInput] = useState("");

  const container = {
    background: "#0a0a0a",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
  };

  const chatBox = {
    flex: 1,
    padding: 20,
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
    overflowY: "auto" as const,
  };

  const inputBox = {
    display: "flex",
    padding: 15,
    borderTop: "1px solid #222",
    background: "#0a0a0a",
  };

  const inputStyle = {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#111",
    color: "white",
    outline: "none",
  };

  const button = {
    marginLeft: 10,
    padding: "10px 18px",
    borderRadius: 10,
    border: "none",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
  };

  const sendMessage = () => {
    if (!input) return;

    const newMessages = [
      ...messages,
      { text: input, sender: "user" },
      { text: "This is AI response 🤖", sender: "ai" },
    ];

    setMessages(newMessages);
    setInput("");
  };

  return (
    <div style={container}>
      {/* HEADER */}
      <div style={{ padding: 20, borderBottom: "1px solid #222" }}>
        <h2>Nova AI Chat</h2>
      </div>

      {/* CHAT AREA */}
      <div style={chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#fff" : "#111",
              color: msg.sender === "user" ? "#000" : "#fff",
              padding: "10px 15px",
              borderRadius: 12,
              maxWidth: "60%",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={inputBox}>
        <input
          style={inputStyle}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
        />
        <button style={button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;