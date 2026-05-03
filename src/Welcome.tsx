import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>🚀 EduNova AI</h1>
        <p style={subtitle}>Your Smart Study Assistant</p>

        <button style={btn} onClick={() => navigate("/login")}>
          Start Learning →
        </button>
      </div>
    </div>
  );
}

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b)"
};

const card = {
  textAlign: "center" as const,
  padding: 40,
  borderRadius: 20,
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 0 50px rgba(59,130,246,0.4)",
  animation: "fadeIn 1s ease-in-out"
};

const title = {
  fontSize: 32,
  marginBottom: 10
};

const subtitle = {
  color: "#94a3b8",
  marginBottom: 20
};

const btn = {
  padding: "12px 25px",
  background: "#3b82f6",
  border: "none",
  borderRadius: 10,
  color: "white",
  fontSize: 16,
  cursor: "pointer"
};