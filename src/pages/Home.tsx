import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <main className="landing-page">
      <section className="landing-hero premium-card">
        <div className="landing-copy">
          <p className="eyebrow">EduNova AI</p>
          <h1>Next-generation learning with real authentication.</h1>
          <p>
            Secure login, persistent progress, and premium dark UI built for modern students.
          </p>
          <div className="landing-actions">
            <Link className="primary-btn" to="/signup">
              Create account
            </Link>
            <Link className="secondary-btn" to="/login">
              Login
            </Link>
          </div>
        </div>
        <div className="landing-card">
          <p className="eyebrow">Premium features</p>
          <ul>
            <li>Persistent user session</li>
            <li>Protected dashboard and learning modules</li>
            <li>Responsive mobile-first dark design</li>
            <li>Supabase email + Google auth</li>
          </ul>
        </div>
      </section>

      <section className="landing-features">
        <article className="feature-card premium-card">
          <h2>Protected routes</h2>
          <p>Only authenticated learners can reach the dashboard, chat, quiz, and profile pages.</p>
        </article>
        <article className="feature-card premium-card">
          <h2>Keep sessions alive</h2>
          <p>Your login remains active even after closing the browser.</p>
        </article>
        <article className="feature-card premium-card">
          <h2>Dashboard redirect</h2>
          <p>After login, you land immediately on your personalized dashboard.</p>
        </article>
      </section>
    </main>
  );
}
