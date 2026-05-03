import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Clock, Headset, Mic, MicOff, Phone, Sparkles, Video } from "lucide-react";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const VideoCall = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [muted, setMuted] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [status, setStatus] = useState("Ready to connect with Nova Tutor");

  useEffect(() => {
    let connectTimeout: number | undefined;
    let intervalId: number | undefined;

    if (isCalling) {
      setStatus("Connecting to Nova Tutor...");
      connectTimeout = window.setTimeout(() => {
        setStatus("Live with Nova Tutor");
        intervalId = window.setInterval(() => {
          setCallTime((prev) => prev + 1);
        }, 1000);
      }, 1200);
    } else {
      setStatus("Ready to connect with Nova Tutor");
      setCallTime(0);
    }

    return () => {
      if (connectTimeout) window.clearTimeout(connectTimeout);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isCalling]);

  return (
    <Layout>
      <div className="video-call-page">
        <div className="page-header">
          <h1>AI Video Call</h1>
          <p>Talk directly with Nova Tutor using a premium live classroom-style interface.</p>
        </div>

        <div className="video-call-grid">
          <section className="video-panel">
            <div className="video-panel-top">
              <span className="video-call-badge">
                <Sparkles size={14} /> Premium
              </span>
              <div className="video-status-row">
                <div className="video-status">{status}</div>
                <div className="call-timer">{formatTime(callTime)}</div>
              </div>
            </div>

            <div className={`video-screen ${isCalling ? "active" : "idle"}`}>
              <div className="video-backdrop">
                <div className="video-avatar">
                  <span>🤖</span>
                </div>
                <div className="video-avatar-label">
                  <h2>Nova Tutor</h2>
                  <p>AI Education Coach</p>
                </div>
              </div>
              <div className="call-overlay">
                <div>
                  <strong>Nova Tutor</strong>
                  <p>Adaptive learning support in real time.</p>
                </div>
                <span className="call-mode">Live Video</span>
              </div>
            </div>

            <div className="video-call-actions">
              <button
                className={`call-control-btn ${muted ? "muted" : ""}`}
                onClick={() => setMuted((prev) => !prev)}
              >
                {muted ? <MicOff size={18} /> : <Mic size={18} />}
                {muted ? "Unmute" : "Mute"}
              </button>
              <button
                className="call-control-btn primary"
                onClick={() => setIsCalling((prev) => !prev)}
              >
                {isCalling ? <Phone size={18} /> : <Video size={18} />}
                {isCalling ? "End Call" : "Start Call"}
              </button>
              <button className="call-control-btn secondary">
                <Headset size={18} />
                Tips
              </button>
            </div>
          </section>

          <aside className="video-call-summary">
            <div className="tutor-card">
              <div className="tutor-avatar">Nova</div>
              <div>
                <p className="card-label">AI Tutor</p>
                <h3>Nova</h3>
                <p className="small-text">Your avatar-based learning companion for fast explanations, examples, and instant review.</p>
              </div>
            </div>

            <div className="premium-card video-call-info">
              <h3>What you can do</h3>
              <ul>
                <li>Speak questions aloud and get step-by-step guidance.</li>
                <li>Use the built-in tutor avatar for a modern learning experience.</li>
                <li>Tap Start Call to open a secure AI session.</li>
              </ul>
            </div>

            <div className="premium-card video-call-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">✓</span>
                <div>
                  <strong>Instant explanations</strong>
                  <p>Live follow-up answers for homework and exam prep.</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">✓</span>
                <div>
                  <strong>Safe classroom mode</strong>
                  <p>Student-first environment with focused learning controls.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default VideoCall;
