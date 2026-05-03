import { Link, useLocation } from "react-router-dom";
import { Video, Star } from "lucide-react";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/chat", label: "AI Chat" },
    {
      to: "/video-call",
      label: "AI Video Call",
      premium: true,
      icon: <Video size={16} />,
    },
    { to: "/message", label: "Messages" },
    { to: "/quiz", label: "Quiz" },
    { to: "/progress", label: "Progress" },
    { to: "/profile", label: "Profile" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="sidebar-logo">EduNova AI</h2>
      <nav className="sidebar-nav">
        {navLinks.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${active ? "active" : ""} ${item.premium ? "premium-link" : ""}`}
              onClick={() => onClose?.()}
            >
              <span className="sidebar-link-content">
                {item.icon && <span className="sidebar-item-icon">{item.icon}</span>}
                {item.label}
              </span>
              {item.premium && (
                <span className="sidebar-premium-flag">
                  <Star size={12} />
                  PRO
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}