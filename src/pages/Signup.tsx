import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { signupPublic, continueWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [working, setWorking] = useState(false);

  const handleSignup = async () => {
    setErrorMessage("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    setWorking(true);
    const created = await signupPublic(name.trim(), email.trim(), password);
    setWorking(false);

    if (created) {
      navigate("/dashboard", { replace: true });
      return;
    }

    setErrorMessage("Unable to create account. Check your details and try again.");
  };

  const handleGoogle = async () => {
    await continueWithGoogle();
  };

  return (
    <main className="auth-page">
      <section className="auth-card premium-card">
        <div className="auth-top">
          <p className="eyebrow">Create account</p>
          <h1>Premium learning starts here.</h1>
          <p className="auth-copy">
            Secure your EduNova account and unlock premium tools designed for modern learners.
          </p>
        </div>

        <div className="auth-fields">
          <label>
            Name
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Choose a strong password"
            />
          </label>
        </div>

        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        <button className="primary-btn full-width" onClick={handleSignup} disabled={working}>
          {working ? "Creating account..." : "Create account"}
        </button>

        <button className="secondary-btn full-width" onClick={handleGoogle}>
          Continue with Google
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
