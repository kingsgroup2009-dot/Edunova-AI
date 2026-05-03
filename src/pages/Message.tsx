import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/Layout";
import EmojiPicker from "emoji-picker-react";
import {
  Search,
  Image,
  Mic,
  Send,
  Smile,
  Users,
  BookOpen,
  CircleDot,
  X,
  ChevronLeft
} from "lucide-react";

type ContactRole = "friend" | "teacher";

type Contact = {
  id: string;
  name: string;
  role: ContactRole;
  avatar: string;
  online: boolean;
  subject: string;
};

type MessageType = "text" | "image" | "voice";

type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: Date;
  type: MessageType;
  imageUrl?: string;
};

const CONTACTS: Contact[] = [
  { id: "c1", name: "Aanya Patel", role: "friend", avatar: "AP", online: true, subject: "Math Buddy" },
  { id: "c2", name: "Rohan Desai", role: "friend", avatar: "RD", online: false, subject: "Science Club" },
  { id: "c3", name: "Ms. Nisha Rao", role: "teacher", avatar: "NR", online: true, subject: "English Teacher" },
  { id: "c4", name: "Mr. Sanjay Kumar", role: "teacher", avatar: "SK", online: true, subject: "Physics Mentor" },
  { id: "c5", name: "Tina Mehta", role: "friend", avatar: "TM", online: true, subject: "History Crew" }
];

const buildMessage = (text: string, sender: "me" | "them", type: MessageType, imageUrl?: string): Message => ({
  id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  text,
  sender,
  type,
  imageUrl,
  timestamp: new Date(),
});

export default function Message() {
  const [selectedContactId, setSelectedContactId] = useState(CONTACTS[0].id);
  const [search, setSearch] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [conversations, setConversations] = useState<Record<string, Message[]>>(() => {
    const initial: Record<string, Message[]> = {};
    CONTACTS.forEach((contact) => {
      initial[contact.id] = [
        buildMessage(
          `Hi, I'm ${contact.role === "teacher" ? "your teacher" : "your study buddy"}. How can I help today?`,
          "them",
          "text"
        ),
      ];
    });
    return initial;
  });
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedContact = useMemo(
    () => CONTACTS.find((contact) => contact.id === selectedContactId) ?? CONTACTS[0],
    [selectedContactId]
  );

  const filteredContacts = useMemo(
    () =>
      CONTACTS.filter((contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.subject.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const messages = conversations[selectedContactId] ?? [];

  useEffect(() => {
    if (!showEmoji) return;
    const close = () => setShowEmoji(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [showEmoji]);

  const handleSend = () => {
    if (!typedMessage.trim() && !imageFile) return;

    const nextMessages = [...messages];
    if (imageFile) {
      nextMessages.push(buildMessage("Sent an image.", "me", "image", URL.createObjectURL(imageFile)));
      setImageFile(null);
    }
    if (typedMessage.trim()) {
      nextMessages.push(buildMessage(typedMessage.trim(), "me", "text"));
      setTypedMessage("");
    }

    setConversations((prev) => ({
      ...prev,
      [selectedContactId]: nextMessages,
    }));

    setTimeout(() => {
      const replyText = selectedContact.role === "teacher"
        ? "Thanks for sending that. Let me review it and get back to you!"
        : "Great! Let's study together soon. 😊";
      setConversations((prev) => ({
        ...prev,
        [selectedContactId]: [
          ...nextMessages,
          buildMessage(replyText, "them", "text"),
        ],
      }));
    }, 900);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  };

  const handleVoiceNote = () => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      alert("Voice notes are supported in Chrome/Edge only.");
      return;
    }
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTypedMessage((current) => `${current} ${transcript}`.trim());
      setRecording(false);
    };
    recognition.onerror = () => setRecording(false);
    recognition.start();
  };

  const addEmoji = (emojiData: { emoji: string }) => {
    setTypedMessage((current) => `${current}${emojiData.emoji}`);
    setShowEmoji(false);
  };

  const clearImage = () => setImageFile(null);

  return (
    <Layout>
      <div className="messages-page">
        <aside className="contacts-panel">
          <div className="contacts-header">
            <div>
              <h2>EduNova Messages</h2>
              <p>Chat with friends and teachers</p>
            </div>
            <button className="status-pill">
              <CircleDot size={12} /> Online
            </button>
          </div>

          <div className="search-wrapper">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users, subjects..."
            />
          </div>

          <div className="contact-categories">
            <button className="category-btn active">
              <Users size={16} /> Friends
            </button>
            <button className="category-btn">
              <BookOpen size={16} /> Teachers
            </button>
          </div>

          <div className="contact-list">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                className={`contact-card ${contact.id === selectedContactId ? "active" : ""}`}
                onClick={() => setSelectedContactId(contact.id)}
              >
                <div className="avatar-badge">
                  <span>{contact.avatar}</span>
                  <span className={`presence ${contact.online ? "online" : "offline"}`} />
                </div>
                <div className="contact-details">
                  <h3>{contact.name}</h3>
                  <p>{contact.subject}</p>
                </div>
                <span className={`contact-role ${contact.role}`}>{contact.role}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="chat-panel">
          <div className="chat-topbar">
            <button className="back-btn">
              <ChevronLeft size={18} /> Back
            </button>
            <div className="chat-contact-info">
              <div className="avatar-large">{selectedContact.avatar}</div>
              <div>
                <h2>{selectedContact.name}</h2>
                <p>{selectedContact.subject}</p>
              </div>
            </div>
            <div className="contact-status-row">
              <CircleDot className={selectedContact.online ? "online" : "offline"} size={12} />
              <span>{selectedContact.online ? "Online" : "Offline"}</span>
            </div>
          </div>

          <section className="chat-window">
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.sender === "me" ? "outgoing" : "incoming"}`}
                >
                  <div className="message-bubble">
                    {message.type === "image" && message.imageUrl ? (
                      <img src={message.imageUrl} alt="Shared" />
                    ) : null}
                    {message.type === "voice" ? (
                      <div className="voice-card">
                        <Mic size={16} />
                        <span>{message.text}</span>
                      </div>
                    ) : (
                      <p>{message.text}</p>
                    )}
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="composer-panel">
            {imageFile && (
              <div className="image-preview-card">
                <img src={URL.createObjectURL(imageFile)} alt="Preview" />
                <button className="remove-image" onClick={clearImage}>
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="composer-actions">
              <button
                className={`icon-btn ${recording ? "recording" : ""}`}
                onClick={handleVoiceNote}
                title="Voice note"
              >
                <Mic size={18} />
              </button>

              <button className="icon-btn" onClick={() => fileInputRef.current?.click()} title="Upload image">
                <Image size={18} />
              </button>

              <button className="icon-btn" onClick={(event) => { event.stopPropagation(); setShowEmoji((prev) => !prev); }} title="Emoji picker">
                <Smile size={18} />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              <div className="message-input-wrapper">
                <textarea
                  value={typedMessage}
                  onChange={(event) => setTypedMessage(event.target.value)}
                  placeholder="Write a message..."
                  rows={1}
                />
                {showEmoji && (
                  <div className="emoji-picker-wrapper" onClick={(event) => event.stopPropagation()}>
                    <EmojiPicker onEmojiClick={addEmoji} />
                  </div>
                )}
              </div>

              <button className="send-btn" onClick={handleSend}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
