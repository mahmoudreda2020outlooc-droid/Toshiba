export default function handler(request, response) {
    // Only allow POST requests
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    const { password } = request.body;
    const CORRECT_PASSWORD = '153248';

    if (password === CORRECT_PASSWORD) {
        return response.status(200).json({ success: true });
    } else {
        return response.status(401).json({ success: false });
    }
}
