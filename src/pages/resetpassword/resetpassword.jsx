import React, { useState } from "react";
import { resetPasswordReq } from "./../../api/resetPasswordApi/resetPassword";

const ResetPasswordForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isHover, setIsHover] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await resetPasswordReq(username, password);
      setMessage(response.message);
    } catch (err) {
      setError(err.errorMsg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reset Password</h2>
      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
            placeholder="Please Enter Your Username Here"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="Please Enter Your New Password Here"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: isHover ? "#ffb300" : "#ffc107",
          }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && <p style={{ ...styles.message, color: "green" }}>{message}</p>}
        {error && <p style={{ ...styles.message, color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  title: {
    background: "#f8f8f8",
    fontWeight: "bold",
    
    fontSize: "25px",
    textAlign: "left",
    marginBottom: "15px",
    padding: "8px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // aligns children to left
  },
  inputGroup: {
    marginBottom: "15px",
    width: "100%",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold",
  },
  input: {
    width: "100%", // inputs full width
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  button: {
    color: "#000",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    alignSelf: "flex-end", // button aligned left but sized by content
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "bold",
  },
};

export default ResetPasswordForm;
