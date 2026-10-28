
import { useState } from "react";
import { apiRequest } from "./api";
import { BriefcaseBusiness, Mail, LockKeyhole, UserRound } from "lucide-react";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await apiRequest(
        mode === "signup"
          ? "/api/auth/register"
          : "/api/auth/login",
        {
          method: "POST",
          body: {
            ...(mode === "signup" ? { name: name.trim() } : {}),
            email: email.trim(),
            password,
          },
        }
      );

      onLogin({
        token: data.token,
        user: data.user,
      });
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.logo}>
          <BriefcaseBusiness size={27} />
        </div>

        <h1 style={styles.title}>
          Staff<span style={{ color: "#7660e8" }}>Sync</span>
        </h1>

        <p style={styles.subtitle}>
          {mode === "login"
            ? "Welcome back! Sign in to your workspace."
            : "Create your account to get started."}
        </p>

        {mode === "signup" && (
          <>
            <label style={styles.label}>Full name</label>
            <div style={styles.inputWrap}>
              <UserRound size={18} color="#9292a5" />
              <input
                style={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>
          </>
        )}

        <label style={styles.label}>Email address</label>
        <div style={styles.inputWrap}>
          <Mail size={18} color="#9292a5" />
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <label style={styles.label}>Password</label>
        <div style={styles.inputWrap}>
          <LockKeyhole size={18} color="#9292a5" />
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            minLength={8}
            required
          />
        </div>

        {message && (
          <p role="alert" style={styles.message}>
            {message}
          </p>
        )}

        <button style={styles.button} disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Sign In"
              : "Create Account"}
        </button>

        <p style={styles.switchText}>
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            style={styles.switchButton}
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "#f6f5fb",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
    padding: "36px",
    border: "1px solid #eeedf4",
    borderRadius: "20px",
    background: "#ffffff",
    boxShadow: "0 15px 50px rgba(40, 30, 80, 0.08)",
  },
  logo: {
    width: "52px",
    height: "52px",
    display: "grid",
    placeItems: "center",
    borderRadius: "15px",
    background: "#eeeaff",
    color: "#7660e8",
  },
  title: {
    margin: "22px 0 8px",
    fontSize: "30px",
    color: "#25243a",
  },
  subtitle: {
    margin: "0 0 28px",
    color: "#77768b",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  label: {
    display: "block",
    margin: "18px 0 8px",
    color: "#38374d",
    fontSize: "13px",
    fontWeight: 600,
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 13px",
    border: "1px solid #e4e2ed",
    borderRadius: "10px",
  },
  input: {
    width: "100%",
    minWidth: 0,
    padding: "13px 0",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#25243a",
    fontSize: "14px",
  },
  message: {
    padding: "12px",
    borderRadius: "8px",
    background: "#f1efff",
    color: "#51429b",
    fontSize: "13px",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },
  button: {
    width: "100%",
    marginTop: "24px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#7660e8",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  switchText: {
    margin: "22px 0 0",
    textAlign: "center",
    color: "#77768b",
    fontSize: "13px",
  },
  switchButton: {
    border: "none",
    background: "transparent",
    color: "#7660e8",
    fontWeight: 700,
    cursor: "pointer",
  },
};
