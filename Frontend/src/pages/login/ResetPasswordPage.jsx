import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { submitResetPassword } from "../../services/resetPasswordService";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setErrorMsg("");

    if (!token) {
      setErrorMsg("Invalid or missing reset token.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMsg("Please enter both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await submitResetPassword({
        token,
        newPassword,
      });

      setMessage(response.message);

      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newPassword">New Password</label>
          <br />
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <br />

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <br />
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {errorMsg && <p>{errorMsg}</p>}

      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPasswordPage;
