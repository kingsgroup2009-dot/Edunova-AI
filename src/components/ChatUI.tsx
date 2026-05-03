type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatUIProps = {
  messages: ChatMessage[];
};

export default function ChatUI({ messages }: ChatUIProps) {
  return (
    <div style={{ padding: 20 }}>
      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              background: msg.role === "user" ? "#3B82F6" : "#1F2937",
              padding: 10,
              borderRadius: 10,
              color: "white",
            }}
          >
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
}
