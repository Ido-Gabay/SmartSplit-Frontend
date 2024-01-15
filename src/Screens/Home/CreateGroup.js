import React from "react";
import { StyleSheet, Text, Image } from 'react-native';
import Background from "../../Components/BackGround";

export default function Profile() {
    return (
        <Background>
            <Image
            source={require('../../../assets/logo.png')}
            style={{ width: 120, height: 120, top :35, left :20 }}
            />
            <Text style ={styles.Text}>POST</Text>
        </Background>
    );
}
const styles = StyleSheet.create({
    Text:{
        textAlign: "center",
        fontSize : 40,
        top :70
    }
});