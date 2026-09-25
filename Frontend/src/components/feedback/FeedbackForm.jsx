import styles from './feedback.module.css';
import { useState } from 'react';

function FeedbackForm({ onSubmit, loading, apiError, apiSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        comment: '',
        rating: 0
    })

    const [errors, setErrors] = useState({
        name: "",
        comment: "",
        rating: ""
    });

    const resetForm = () => {
        setFormData({ name: '', comment: '', rating: 0})
        setErrors({ name: "", comment: "", rating: "" });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = { name: "", comment: "", rating: "" };
        let isValid = true;

        if (formData.name.trim() === "") {
            newErrors.name = "Name is required";
            isValid = false;
        } 

        if (formData.comment.trim() === "") {
            newErrors.comment = "Give us your opinion";
            isValid = false;
        } 

        if (formData.rating === 0) {
            newErrors.rating = "Please select a rating";
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) return;

        onSubmit(formData, resetForm);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.feedbackForm}>
            <h1>FEEDBACK FORM</h1>

            <div className={styles.inputFields}>
                <div className={styles.field}>
                    <label htmlFor="name" className={styles.srOnly}>Full Name</label>

                    <input
                        name="name"
                        id='name'
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, name: e.target.value }));
                            errors.name && setErrors(prev => ({ ...prev, name: '' }));
                        }}
                    />
                    <p className={`${styles.error} ${errors.name ? styles.show : ""}`}>
                        {errors.name}
                    </p>
                </div>

                <div className={styles.field}>
                    <label htmlFor="comment" className={styles.srOnly}>Comment</label>

                    <textarea
                        name='comment'
                        id='comment'
                        placeholder="Share your thoughts..."
                        value={formData.comment}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, comment: e.target.value }));
                            errors.comment && setErrors(prev => ({ ...prev, comment: '' }));
                        }}
                    ></textarea>
                    <p className={`${styles.error} ${errors.comment ? styles.show : ""}`}>
                        {errors.comment}
                    </p>
                </div>

                <div className={styles.field}>
                    <label className={styles.ratingLabel}>Rate Us</label>

                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, rating: star }));
                                    errors.rating && setErrors(prev => ({ ...prev, rating: '' }))
                                }}
                                className={`${styles.star} ${formData.rating >= star ? styles.active : ""}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <p className={`${styles.error} ${errors.rating ? styles.show : ""}`}>
                        {errors.rating}
                    </p>
                </div>
            </div>

            {apiSuccess && <p className={`${styles.successMsg} ${styles.apiMsg}`}>{apiSuccess}</p>}
            {apiError && <p className={`${styles.errorMsg} ${styles.apiMsg}`}>{apiError}</p>}

            <button type='submit' disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>
        </form>
    )
}

export default FeedbackForm;