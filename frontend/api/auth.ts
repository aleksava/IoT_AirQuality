import axios from 'axios';

interface SignInResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

export const AuthService = {
    signIn: async (email: string, password: string) =>
        await axios
            .post<SignInResponse>(`${process.env.AUTH_API_URL}/oauth/token`, {
                client_id: process.env.AUTH_API_CLIENT_ID,
                client_secret: process.env.AUTH_API_CLIENT_SECRET,
                audience: process.env.AUTH_API_AUDIENCE,
                username: email,
                password: password,
                grant_type: 'password'
            })
            .then((response) => response.data)
};
