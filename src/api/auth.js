import { apiClient } from './config';

// Google Sign In API
export const googleSignIn = async (token) => {
  try {
    const response = await apiClient.post('/auth/signin', {
      token: token,
      provider: 'google'
    });
    return response.data;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

// Regular Sign In API
export const signIn = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/signin', {
      email: email,
      password: password
    });
    return response.data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

