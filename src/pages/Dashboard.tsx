import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { label: "Daily Streak", value: "5 Days" },
    { label: "Lessons Completed", value: "12" },
    { label: "Quiz Accuracy", value: "85%" },
    { label: "Learning Coins", value: "420" },
  ];

  const features = [
    { title: "AI Chat", desc: "Get instant help from Nova", path: "/chat" },
    {
      title: "AI Video Call",
      desc: "Start a premium tutor session with Nova",
      path: "/video-call",
      premium: true,
    },
    { title: "Quiz Arena", desc: "Timed questions with scoring", path: "/quiz" },
    { title: "Progress", desc: "Track your subject growth", path: "/progress" },
    { title: "Profile", desc: "Manage account and goals", path: "/profile" },
    { title: "Leaderboard", desc: "See top learner rankings", path: "/leaderboard" },
  ];

  return (
    <Layout>
      <div className="page-header">
        <h1>Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
        <p>
          {user?.mode === "school"
            ? `School account${user.rollNumber ? ` · Roll ${user.rollNumber}` : ""}`
            : "Keep building your streak and explore what is next."}
        </p>
      </div>
      <section className="dashboard-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="premium-card stat-card">
            <p className="card-label">{stat.label}</p>
            <h3>{stat.value}</h3>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        {features.map((feature) => (
          <article
            key={feature.title}
            className={`premium-card clickable-card ${feature.premium ? "premium-feature" : ""}`}
            onClick={() => navigate(feature.path)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                navigate(feature.path);
              }
            }}
            role="button"
            tabIndex={0}
          >
            {feature.premium && <span className="dashboard-premium-badge">Premium</span>}
            <h3>{feature.title}</h3>
            <p className="card-label">{feature.desc}</p>
          </article>
        ))}
      </section>
      <div className="premium-card">
        <h3>Today's Focus</h3>
        <p className="card-label">
          Complete 1 quiz and ask Nova AI one doubt to keep your streak active.
        </p>
      </div>
    </Layout>
  );
};

export default Dashboard;