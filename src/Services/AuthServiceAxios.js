import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // Correct import statement
import "core-js/stable/atob";
import authServiceHelpers from "./AuthServiceHelpers";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Utils/confing'

class AuthServiceAxios {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            if (response.data.accessToken) {
                const decodedToken = jwtDecode(response.data.accessToken);
                const user = {
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    roles: decodedToken.roles
                };
                await AsyncStorage.setItem('user', JSON.stringify(user));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async getRefreshToken() {
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            return user ? user.refreshToken : null;
        } catch (error) {
            console.error('Error getting refresh token:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            if (user && user.accessToken && user.refreshToken) {
                await AsyncStorage.removeItem('user');
                // Dispatch custom event to stop token refresh (Note: Adjust for React Native)
                // const event = new Event('refresh-token');
                // window.dispatchEvent(event);
                await axios.get(`${API_URL}/logout`, {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                });
                console.log('Logged out successfully');
            }
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    async fetchUsers() {
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            if (user && user.accessToken && user.refreshToken) {
                const response = await axios.get(`${API_URL}/users`, {
                    headers: authServiceHelpers.getAuthHeaders()
                });
                return response.data;
            }
            throw new Error('No access token or refresh token found');
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async fetchUserInfo(email) {
        try {
            const response = await axios.get(`${API_URL}/user-info/${email}`, {
                headers: authServiceHelpers.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    }
}

const authServiceInstance = new AuthServiceAxios();
export default authServiceInstance;
