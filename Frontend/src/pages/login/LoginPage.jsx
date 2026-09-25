import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { submitLogin } from '@/services/loginService'
import styles from '@/components/auth/login.module.css'

function LoginPage() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLoginSubmit = async (data, resetForm) => {
        try {
            setLoading(true);
            setErrorMsg('');

            const response = await submitLogin(data);

            resetForm();
            navigate('/feedback');
        } catch (err) {
            setErrorMsg(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.loginPage}>
            <LoginForm 
                onSubmit={handleLoginSubmit} 
                loading={loading}
                apiError={errorMsg}
                clearApiError={() => setErrorMsg('')}
            />
        </div>
    )
}

export default LoginPage;