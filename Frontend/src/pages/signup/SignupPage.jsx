import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import styles from "../../components/auth/login.module.css";
import { submitSignup } from "../../services/signupService";

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(false);
  const [formError, setFormError] = useState("");
  const [apiError, setApiError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
    });

    setFormError("");
    setApiError("");
    setMessage("");
    setCapsLock(false);
    setShow(false);
  };

  const triggerShake = () => {
    setShake(true);

    setTimeout(() => {
      setShake(false);
    }, 400);
  };

  useEffect(() => {
    if (apiError) {
      triggerShake();
    }
  }, [apiError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setApiError("");
    setMessage("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setFormError("Email and password are required");
      triggerShake();
      return;
    }

    const validPassword =
      formData.password.length >= 8 && /[0-9]/.test(formData.password);

    if (!validPassword) {
      setFormError(
        "Password must be at least 8 characters and include a number.",
      );
      triggerShake();
      return;
    }

    try {
      setLoading(true);

      const response = await submitSignup(formData);

      setMessage(response.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setApiError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <form
        onSubmit={handleSubmit}
        className={`${styles.loginForm} ${shake ? styles.shake : ""}`}
        aria-label="Signup form"
      >
        <h1>Create Account</h1>

        {(formError || apiError) && (
          <div className={styles.loginNotice} role="alert">
            {formError || apiError}
          </div>
        )}

        {message && (
          <div
            role="status"
            style={{
              marginBottom: "16px",
              padding: "8px 12px",
              background: "#ecfdf5",
              color: "#166534",
              borderRadius: "6px",
              fontSize: "15px",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <div className={styles.inputField}>
          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>

            <input
              name="email"
              id="email"
              type="text"
              placeholder="example@gmail.com"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));

                setFormError("");
                setApiError("");
                setMessage("");
              }}
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>

            <input
              type={show ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              placeholder="Enter your password"
              onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));

                setFormError("");
                setApiError("");
                setMessage("");
              }}
              aria-describedby="caps-warning"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className={styles.eyeToggle}
              aria-label={show ? "Hide password" : "Show password"}
            >
              <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
            </button>

            <p
              style={{
                margin: "0",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              Use at least 8 characters and include a number.
            </p>
          </div>

          {/* Caps Lock */}
          {capsLock && (
            <p id="caps-warning" className={styles.capsWarning}>
              ⚠️ Caps Lock is ON
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !!apiError}
          className={styles.submitBtn}
          aria-busy={loading}
        >
          {loading ? (
            <span className={styles.spinner} aria-hidden />
          ) : (
            "Create Account"
          )}
        </button>

        <p className={styles.signupText}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              border: "none",
              padding: 0,
              background: "none",
              color: "#4f46e5",
              fontWeight: "500",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
