import { useState } from "react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { submitSendResetLink } from '@/services/forgotPasswordService'
import styles from '@/components/auth/login.module.css'

function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [sent, setSent] = useState(false);

    const handleForgotPasswordSubmit = async (data, resetForm) => {
        try {
            setLoading(true);
            setErrorMsg('');

            const response = await submitSendResetLink(data);

            resetForm();
            setSent(true);
        } catch (err) {
            setErrorMsg('Unable to process request. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.loginPage}>
            <ForgotPasswordForm
                onSubmit={handleForgotPasswordSubmit}
                loading={loading}
                apiError={errorMsg}
                clearApiError={() => setErrorMsg('')}
                sent={sent}
            />
        </div>
    )
}

export default ForgotPasswordPage;