import axios from 'axios';
import AuthService from '../Services/AuthServiceAxios';
import AuthServiceHelpers from "../Services/AuthServiceHelpers";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './confing';

let refreshTokenInterval = null;

const TokenRefresh = {
    start: () => {
        if (!refreshTokenInterval) {
            console.log('Starting token refresh');
            refreshTokenInterval = setInterval(async () => {
                try {
                    if (AuthService.getRefreshToken()) {
                        console.log('Checking if access token is expired');
                        if (await AuthServiceHelpers.isTokenExpired(await AuthServiceHelpers.getAccessToken())) {
                            console.log('Access token is expired, refreshing token...');
                            const response = await axios.post(`${API_URL}/refresh_token`, {
                                refreshToken: AuthService.getRefreshToken(),
                            });
                            if (response.data.accessToken) {
                                await AuthServiceHelpers.setTokens(
                                    response.data.accessToken,
                                    response.data.refreshToken
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.log('Error refreshing token:', error);
                }
            }, 10000);
        }
    },

    stop: () => {
        if (refreshTokenInterval) {
            clearInterval(refreshTokenInterval);
            refreshTokenInterval = null;
        }
    },
};

export default TokenRefresh;
