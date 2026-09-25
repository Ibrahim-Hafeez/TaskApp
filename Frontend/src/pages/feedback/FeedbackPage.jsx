import { useState } from "react";
import FeedbackForm from '@/components/feedback/FeedbackForm'
import { submitFeedback } from '@/services/feedbackService';
import styles from '@/components/feedback/feedback.module.css'

function FeedbackPage() {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleFeedbackSubmit  = async (data, resetForm) => {
        try {
            setLoading(true);
            setErrorMsg('');
            setSuccessMsg('');

            const response = await submitFeedback(data);

            setSuccessMsg(response.message);
            
            resetForm();

            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.feedbackPage}>
            <FeedbackForm 
                onSubmit={handleFeedbackSubmit}
                loading={loading}
                apiError={errorMsg}
                apiSuccess={successMsg}
            />
        </div>
    )
}

export default FeedbackPage;