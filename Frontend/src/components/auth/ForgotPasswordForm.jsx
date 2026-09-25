import { useState, useEffect } from "react";
import styles from '@/components/auth/login.module.css'

function ForgotPasswordForm({ onSubmit, loading, apiError, clearApiError, sent }) {
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [shake, setShake] = useState(false);

    const resetForm = () => {
        setEmail('');
        setFormError('');
    }

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 400);
    }

    useEffect(() => {
        if (apiError) triggerShake();
    }, [apiError]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            setFormError('Email is required');
            triggerShake();
            return;
        }

        if (!emailRegex.test(email)) {
            setFormError('Please enter a valid email address');
            triggerShake();
            return;
        }
        
        onSubmit({ email }, resetForm);
    }

    return (
        <form onSubmit={handleSubmit} className={`${styles.loginForm} ${shake ? styles.shake : ''}`}>
            <h1>Forgot Password</h1>

            {sent ? (
                <p style={{ textAlign: 'center', fontSize: '15px' }}>
                    If the email exists, a reset link has been sent.
                </p>
            ) : (
                <>
                    {(formError || apiError) && (
                        <div className={styles.loginNotice} role="alert">
                            {formError || apiError}
                        </div>
                    )}

                    <div className={styles.inputField}>
                        <div className={styles.field}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                                id="email"
                                type="text"
                                placeholder="example@gmail.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    formError && setFormError('');
                                    apiError && clearApiError();
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!apiError}
                        className={styles.submitBtn}
                    >
                        {loading ? <span className={styles.spinner} aria-hidden /> : 'Send Reset Link'}
                    </button>
                </>
            )}
        </form>
    )
}

export default ForgotPasswordForm;