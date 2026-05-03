import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type Step = "splash" | "role" | "public" | "school";

export default function Home() {
  const navigate = useNavigate();
  const { loginPublic, signupPublic, continueWithGoogle, signupSchool } =
    useAuth();
  const [step, setStep] = useState<Step>("splash");
  const [publicTab, setPublicTab] = useState<"login" | "signup">("login");
  const [publicName, setPublicName] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [publicPassword, setPublicPassword] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolPassword, setSchoolPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setStep("role"), 2000);
    return () => window.clearTimeout(t);
  }, []);

  const submitPublic = () => {
    if (publicTab === "signup") {
      if (!signupPublic(publicName, publicEmail, publicPassword)) {
        window.alert("Could not create account. Check your details or try logging in.");
        return;
      }
    } else {
      if (!loginPublic(publicEmail, publicPassword)) {
        window.alert("Email or password does not match.");
        return;
      }
    }
    navigate("/chat");
  };

  const onGoogle = () => {
    continueWithGoogle();
    navigate("/chat");
  };

  const submitSchool = () => {
    if (
      !signupSchool(schoolEmail, schoolPassword, studentName, rollNumber)
    ) {
      window.alert(
        "School sign-in failed. For returning students, use the same email, password, and roll number."
      );
      return;
    }
    navigate("/chat");
  };

  return (
    <div className="onboarding-app">
      {step === "splash" && (
        <section className="onboarding-screen splash-screen" aria-label="EduNova AI">
          <div className="splash-stack">
            <div className="splash-logo-glow">
              <img
                src="/edunova-logo.png"
                alt=""
                className="splash-logo"
                decoding="async"
              />
            </div>
            <h1 className="splash-brand-title">EduNova AI</h1>
            <p className="splash-brand-tagline">Learn Smarter. Rise Faster.</p>
          </div>
        </section>
      )}

      {step === "role" && (
        <section className="onboarding-screen">
          <div className="onboarding-card premium-card">
            <p className="onboarding-kicker">Get started</p>
            <h2 className="onboarding-heading">How do you use EduNova?</h2>
            <button
              type="button"
              className="onboarding-tile"
              onClick={() => setStep("public")}
            >
              <span className="onboarding-tile-title">Public User</span>
              <span className="onboarding-tile-desc">
                Personal account for home and self-paced learning
              </span>
            </button>
            <button
              type="button"
              className="onboarding-tile"
              onClick={() => setStep("school")}
            >
              <span className="onboarding-tile-title">School User</span>
              <span className="onboarding-tile-desc">
                Sign in with your school credentials
              </span>
            </button>
          </div>
        </section>
      )}

      {step === "public" && (
        <section className="onboarding-screen">
          <div className="onboarding-card premium-card">
            <div className="plan-segment">
              <button
                type="button"
                className={publicTab === "login" ? "segment active" : "segment"}
                onClick={() => setPublicTab("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={
                  publicTab === "signup" ? "segment active" : "segment"
                }
                onClick={() => setPublicTab("signup")}
              >
                Signup
              </button>
            </div>
            <h2 className="onboarding-heading">
              {publicTab === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <div className="onboarding-fields">
              {publicTab === "signup" && (
                <label className="onboarding-label">
                  Name
                  <input
                    className="premium-input onboarding-input"
                    value={publicName}
                    onChange={(e) => setPublicName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>
              )}
              <label className="onboarding-label">
                Email
                <input
                  className="premium-input onboarding-input"
                  type="email"
                  value={publicEmail}
                  onChange={(e) => setPublicEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </label>
              <label className="onboarding-label">
                Password
                <input
                  className="premium-input onboarding-input"
                  type="password"
                  value={publicPassword}
                  onChange={(e) => setPublicPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete={
                    publicTab === "login" ? "current-password" : "new-password"
                  }
                />
              </label>
            </div>
            <button
              type="button"
              className="primary-btn onboarding-primary"
              onClick={submitPublic}
            >
              Continue
            </button>
            <button
              type="button"
              className="secondary-btn onboarding-google"
              onClick={onGoogle}
            >
              Continue with Google
            </button>
            <button
              type="button"
              className="onboarding-back"
              onClick={() => setStep("role")}
            >
              Back
            </button>
          </div>
        </section>
      )}

      {step === "school" && (
        <section className="onboarding-screen">
          <div className="onboarding-card premium-card">
            <h2 className="onboarding-heading">School sign in</h2>
            <p className="onboarding-hint">
              Use your school email and the details from your school. If you
              already signed up, use the same email, password, and roll number.
            </p>
            <div className="onboarding-fields">
              <label className="onboarding-label">
                School email
                <input
                  className="premium-input onboarding-input"
                  type="email"
                  value={schoolEmail}
                  onChange={(e) => setSchoolEmail(e.target.value)}
                  placeholder="you@school.edu"
                  autoComplete="email"
                />
              </label>
              <label className="onboarding-label">
                School password
                <input
                  className="premium-input onboarding-input"
                  type="password"
                  value={schoolPassword}
                  onChange={(e) => setSchoolPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </label>
              <label className="onboarding-label">
                Student name
                <input
                  className="premium-input onboarding-input"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Full name"
                  autoComplete="name"
                />
              </label>
              <label className="onboarding-label">
                Roll number
                <input
                  className="premium-input onboarding-input"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Roll number"
                  autoComplete="off"
                />
              </label>
            </div>
            <button
              type="button"
              className="primary-btn onboarding-primary"
              onClick={submitSchool}
            >
              Continue
            </button>
            <button
              type="button"
              className="onboarding-back"
              onClick={() => setStep("role")}
            >
              Back
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
