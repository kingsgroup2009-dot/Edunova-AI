import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import EmojiPicker from "emoji-picker-react";
import { Mic, MicOff, Image, Smile, Send, Users, GraduationCap } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "image";
  imageUrl?: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  role: "friend" | "teacher";
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello 👋 I am Nova AI, your educational assistant!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [activeTab, setActiveTab] = useState<"friends" | "teachers">("friends");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts: Contact[] = [
    { id: "1", name: "Alice Johnson", avatar: "👩‍🎓", status: "online", role: "friend" },
    { id: "2", name: "Bob Smith", avatar: "👨‍🎓", status: "offline", role: "friend" },
    { id: "3", name: "Dr. Sarah Wilson", avatar: "👩‍🏫", status: "online", role: "teacher" },
    { id: "4", name: "Prof. Michael Chen", avatar: "👨‍🏫", status: "online", role: "teacher" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      // You can add image preview or upload logic here
    }
  };

  const sendMessage = () => {
    if (!input.trim() && !selectedImage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      type: selectedImage ? "image" : "text",
      imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput("");
    setSelectedImage(null);

    // Fake AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: selectedImage
          ? "I received your image! How can I help you with it? 📸"
          : "This is a simulated AI response 🤖. In a real implementation, this would connect to an AI service.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setInput((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const filteredContacts = contacts.filter((contact) => contact.role === activeTab.slice(0, -1));

  return (
    <Layout>
      <div className="chat-container">
        {/* Contacts Sidebar */}
        <div className={`contacts-sidebar ${showContacts ? "open" : ""}`}>
          <div className="contacts-header">
            <button
              className={`tab-btn ${activeTab === "friends" ? "active" : ""}`}
              onClick={() => setActiveTab("friends")}
            >
              <Users size={16} />
              Friends
            </button>
            <button
              className={`tab-btn ${activeTab === "teachers" ? "active" : ""}`}
              onClick={() => setActiveTab("teachers")}
            >
              <GraduationCap size={16} />
              Teachers
            </button>
          </div>
          <div className="contacts-list">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="contact-item">
                <div className="contact-avatar">{contact.avatar}</div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className={`contact-status ${contact.status}`}>
                    {contact.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          <div className="chat-header">
            <button
              className="toggle-contacts-btn"
              onClick={() => setShowContacts(!showContacts)}
            >
              <Users size={20} />
            </button>
            <h1>Nova AI Chat</h1>
            <p>Ask doubts, summaries, and topic explanations instantly.</p>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === "user" ? "user" : "ai"}`}
              >
                <div className="message-bubble">
                  {msg.type === "image" && msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="Uploaded"
                      className="message-image"
                    />
                  )}
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Area */}
          <div className="chat-input-area">
            {selectedImage && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="preview-image"
                />
                <button
                  className="remove-image-btn"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </button>
              </div>
            )}

            <div className="input-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: "none" }}
              />

              <div className="input-actions">
                <button
                  className="action-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Image"
                >
                  <Image size={20} />
                </button>

                <button
                  className={`action-btn ${isRecording ? "recording" : ""}`}
                  onClick={isRecording ? stopRecording : startRecording}
                  title={isRecording ? "Stop Recording" : "Start Voice Input"}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button
                  className="action-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Add Emoji"
                >
                  <Smile size={20} />
                </button>
              </div>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="chat-input"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button
                onClick={sendMessage}
                className="send-btn"
                disabled={!input.trim() && !selectedImage}
              >
                <Send size={20} />
              </button>
            </div>

            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;