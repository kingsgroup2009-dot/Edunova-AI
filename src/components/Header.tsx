export default function Header() {
  return (
    <div
      style={{
        height: 60,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "#020617",
        color: "white"
      }}
    >
      <h3 style={{ fontSize: 16 }}>EduNova AI</h3>

      <div style={{ fontSize: 14, color: "#94a3b8" }}>
        Student Panel
      </div>
    </div>
  );
}