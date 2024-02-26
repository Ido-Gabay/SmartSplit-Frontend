import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../Services/AuthServiceAxios';
import AuthServiceHelpers from "../Services/AuthServiceHelpers";
import axios from "axios";

const API_URL = 'http://localhost:8080';

const logout = () => {
    AuthService.logout(); // Logout the user
    // You may need to navigate the user to the login screen here in a React Native context
    // Example: navigation.navigate('Login');
};

const AuthWrapper = ({ children }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthenticationAndNavigate = async () => {
            try {
                const user = await AuthServiceHelpers.getCurrentUser();
                console.log('User:', user);
                console.log('User role:', AuthServiceHelpers.getUserRole());
                if (!user) {
                    // Navigate to the login page if the user is not authenticated
                    // You may need to replace this with your React Native navigation logic
                    navigation.navigate('Login');
                    setIsLoading(false);
                    return;
                }

                // Check if the access token is expired
                if (AuthService.getRefreshToken()) {
                    console.log('Checking if access token is expired');
                    if (await AuthServiceHelpers.isTokenExpired(await AuthServiceHelpers.getAccessToken())) {
                        console.log('Access token is expired, refreshing token...');
                        const response = await axios.post(`${API_URL}/refresh_token`, {
                            refreshToken: AuthService.getRefreshToken(),
                        });

                        // If we got a new access token, set the new access and refresh tokens
                        if (response.data.accessToken) {
                            console.log('Access token refreshed successfully');
                            AuthServiceHelpers.setTokens(
                                response.data.accessToken,
                                response.data.refreshToken
                            );
                        } else if (response.data === "Refresh token has expired, please login again") {
                            console.error("Refresh token expired, please login again");
                            logout();
                        } else {
                            throw new Error(response.data);
                        }
                    } else {
                        console.log('Access token is not expired yet');
                    }
                }

                // Authentication check complete, set the loading state to false
                setIsLoading(false);
            } catch (error) {
                console.error("Error during authentication check:", error.message);

                // Check if the error response is available
                if (error.response || (error.response && error.response.status === 401) ||
                    (error.response && error.response.data === "Refresh token has expired, please login again")) {
                    console.error("Refresh token expired, please login again");
                }

                // Logout the user and clear tokens
                logout();
                setIsLoading(false);
            }
        };

        checkAuthenticationAndNavigate().then(() => console.log('Authentication check complete'));
    }, [navigation]);

    if (isLoading) {
        return (
            <View>
                <ActivityIndicator />
                <Text>Loading...</Text>
            </View>
        );
    }

    return <>{children}</>;
};

export default AuthWrapper;
