import { Link, useLocation, useNavigate } from "react-router-dom";
import { Video, Star, X, LogOut } from "lucide-react";
import { useAuth } from "../context/useAuth";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

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

  const handleLogout = async () => {
    await logout();
    onClose?.();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="sidebar-logo">EduNova AI</h2>
      {isOpen && (
        <button className="sidebar-close-btn" onClick={() => onClose?.()}>
          <X size={20} />
        </button>
      )}
      <div className="sidebar-user">
        <p className="sidebar-user-name">{user?.name ?? "Learner"}</p>
        <span className="sidebar-user-email">{user?.email ?? ""}</span>
      </div>
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
      <button className="sidebar-logout-btn" type="button" onClick={handleLogout}>
        <LogOut size={16} /> Sign out
      </button>
    </aside>
  );
}