import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // fake login
    if (email && password) {
      navigate("/dashboard");
    } else {
      alert("Enter details");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginBottom: 20 }}>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button style={btn} onClick={handleLogin}>
          Login
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
  padding: 30,
  borderRadius: 20,
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  width: 300
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  borderRadius: 8,
  border: "none"
};

const btn = {
  width: "100%",
  padding: 10,
  background: "#3b82f6",
  border: "none",
  borderRadius: 8,
  color: "white",
  cursor: "pointer"
};
