import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Image, View, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Background from "../../Components/BackGround";
import axios from 'axios';
import authServiceInstance from "../../Services/AuthServiceHelpers";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { API_URL } from '../../Utils/confing'

export default function Home({ navigation }) {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const getCurrentUser = async () => {
        try {
            const currentUser = await authServiceInstance.getCurrentUser();
    
            if (currentUser?.email) {
                const response = await axios.get(`${API_URL}/users/email/${currentUser.email}`);
                const userId = response.data; // Assuming the response is the user ID
    
                // Save userId to AsyncStorage (stringify the value)
                await AsyncStorage.setItem('userId', JSON.stringify(userId));
    
                // Now you can use userId in your logic, for example, fetching user groups
                const groupResponse = await axios.get(`${API_URL}/groups/user/${userId}`);
                setGroups(groupResponse.data);
    
                // Remove the following line to prevent automatic navigation to Wallet
                // navigation.navigate('Wallet', { userId });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchData = async () => {
        try {
            // Fetch user details
            const currentUser = await authServiceInstance.getCurrentUser();
            if (currentUser?.email) {
                const response = await axios.get(`${API_URL}/users/email/${currentUser.email}`);
                const userId = response.data;

                await AsyncStorage.setItem('userId', JSON.stringify(userId));

                const groupResponse = await axios.get(`${API_URL}/groups/user/${userId}`);
                setGroups(groupResponse.data);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    // Use useFocusEffect to refresh data when the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const handleGroupPress = async (group) => {
        // Save the selected group ID to AsyncStorage
        await AsyncStorage.setItem('selectedGroupId', group.id.toString());

        // Navigate to Group screen
        navigation.navigate('Group');
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedGroup(null);
    };

    return (
        <Background>
            <Image
                source={require('../../../assets/logo.png')}
                style={{ width: 120, height: 120, top: 35, left: 20 }}
            />
            <ScrollView contentContainerStyle={styles.groupContainer}>
                {groups.map((group) => (
                    <TouchableOpacity key={group.id} onPress={() => handleGroupPress(group)}>
                        <View style={styles.individualGroupContainer}>
                            <Text style={styles.groupName}>{group.name}</Text>
                            <Text style={styles.groupMoney}>{`Money: ${group.moneyAmount} ₪`}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>{selectedGroup?.name}</Text>
                            <Text style={styles.modalText}>{`Money: ${selectedGroup?.moneyAmount}`}</Text>
                            {/* Add more details as needed */}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </Background>
    );
}

const styles = StyleSheet.create({
    groupContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 10,
        top : 70,
        opacity :0.9,
    },
    individualGroupContainer: {
        width: 170, // Adjust the width as needed
        height: 150,
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: '#fff',
        elevation: 3, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        padding: 15,
    },
    groupName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    groupMoney: {
        fontSize: 16,
        color: '#666',
        top: 10,
        textAlign: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        width: '80%', // Adjust the width as needed
    },
    modalText: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});
