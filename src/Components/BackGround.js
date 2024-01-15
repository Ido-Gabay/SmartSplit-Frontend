import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

export default function Background({ children }) {
    const background = require("../../assets/back.png")
    return (
        <ImageBackground
            source = {background}
            style={styles.image}
        >
            {children}
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: "cover", 
        width: '100%',
        height: '100%'
    },
});