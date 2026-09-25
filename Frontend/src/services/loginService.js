const API_URL = `${import.meta.env.VITE_API_URL}/login`;

export const submitLogin = async (data) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}