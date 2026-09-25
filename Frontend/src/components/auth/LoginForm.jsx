import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import styles from './login.module.css'
import { Link } from 'react-router-dom'

function LoginForm({ onSubmit, loading, apiError, clearApiError }) {
    const [formData, setFormData] = useState({ email: '', password: '' }); 
    const [show, setShow] = useState(false);
    const [shake, setShake] = useState(false);
    const [formError, setFormError] = useState('');
    const [capsLock, setCapsLock] = useState(false);

    const resetForm = () => {
        setFormData({ email: '', password: '' });
        setFormError('');
        setCapsLock(false);
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

        if (!formData.email.trim() || !formData.password.trim()) {
            setFormError('Email and password are required');
            triggerShake();
            return;
        }

        setFormError('');
        onSubmit(formData, resetForm);
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className={`${styles.loginForm} ${shake ? styles.shake : ''}`}
            aria-label="Login form"
        >
            <h1>Login</h1>

            {(formError || apiError) && (
                <div className={styles.loginNotice} role="alert">
                    {formError || apiError}
                </div>
            )}

            <div className={styles.inputField}>
                <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input 
                        name="email"
                        id="email"
                        type="text" 
                        placeholder="example@gmail.com"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, email: e.target.value }));
                            formError && setFormError('');
                            apiError && clearApiError();
                        }}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="password" className={styles.label}>Password</label>

                    <input 
                        type={show ? 'text' : 'password'}
                        id="password"
                        name="password"
                        autoComplete="current-password" 
                        value={formData.password}
                        onKeyUp={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, password: e.target.value }));
                            formError && setFormError('');
                            apiError && clearApiError();
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
                </div>

                {capsLock && (
                    <p id="caps-warning" className={styles.capsWarning}>
                        ⚠️ Caps Lock is ON
                    </p>
                )}
            </div>

            <div className={styles.helperLinks}>
                <Link to='/forgot-password'>Forgot password?</Link>
            </div>

            <button 
                type="submit" 
                disabled={loading || !!apiError} 
                className={styles.submitBtn}
                aria-busy={loading}
            >  
                {loading ? <span className={styles.spinner} aria-hidden /> : 'Login'}
            </button>

            <p className={styles.signupText}>
                Don't have an account? <Link to='/signup'>Sign up</Link>
            </p>

            <p className={styles.privacyText}>
                By logging in, you agree to our <Link to='/privacy-policy'>Privacy Policy</Link>
            </p>
        </form>
    )
}

export default LoginForm;