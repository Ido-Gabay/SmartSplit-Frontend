import react from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Background from "../../Components/BackGround";

export default function Settings({ navigation }) {
    return (
        <Background>
            <Image
                source={require('../../../assets/logo.png')}
                style={{ width: 120, height: 120, top: 35, left: 20 }}
            />
            <View style={styles.container}>
                <Text style={styles.Text}> Settings </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    Text: {
        textAlign: "center",
        fontSize: 40,
        top: 70,
    },
    button: {
        width: '60%',
        backgroundColor: 'white',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 350,
        marginBottom: 10,
    },
});