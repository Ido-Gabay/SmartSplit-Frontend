import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthServiceHelpers {
    // helper method, Get current user from local storage
    async getCurrentUser() {
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            if (user && user.accessToken) {
                const decodedToken = jwtDecode(user.accessToken);

                // Add the email to the decoded token
                const email = decodedToken.sub;
                decodedToken.email = email;

                return decodedToken;
            }
            return null;
        } catch (error) {
            console.error('Error retrieving user from AsyncStorage:', error);
            return null;
        }
    }

    // helper method, Get user role from token
    async getUserRole() {
        const currentUser = await this.getCurrentUser();
        console.log(currentUser);
        console.log('Decoded JWT:', currentUser);

        if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
            console.log('User role:', currentUser.roles[0]);
            return currentUser.roles[0];
        }

        console.warn('User role not found.');
        return null;
    }

    // helper method, Check if user is authenticated
    async isAuthenticated() {
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            return user && user.accessToken;
        } catch (error) {
            console.error('Error checking authentication status:', error);
            return false;
        }
    }

    // helper method, Get access token
    async getAccessToken() {
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            return user ? user.accessToken : null;
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    }

    // helper method, Check if token is expired
    isTokenExpired(token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp < Date.now() / 1000; // Check if the token has expired
        } catch (err) {
            console.log('Expired check failed');
            return true;
        }
    }

    // helper method, Set tokens in local storage
    async setTokens(accessToken, refreshToken) {
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString) || {};
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Error setting tokens in AsyncStorage:', error);
        }
    }

    // Get common headers for requests, we use this to add the Authorization header with the JWT token to each request
    async getAuthHeaders() {
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            if (user && user.accessToken) {
                return {
                    Authorization: `Bearer ${user.accessToken}`
                };
            } else {
                return {};
            }
        } catch (error) {
            console.error('Error getting authentication headers:', error);
            return {};
        }
    }
}

const authServiceInstance = new AuthServiceHelpers(); // Create an instance of AuthServiceAxios
export default authServiceInstance;  // Export the instance as the default export
