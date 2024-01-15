import { StyleSheet, ImageBackground, Image, View, Dimensions, } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const {width} = Dimensions.get('screen');

const CustomDrawer = props => {
    return (
        <DrawerContentScrollView{...props}>
            <ImageBackground source={require('../../assets/drawer-cover.png')} style={{ height: 140 }}>
                <Image source={require('../../assets/user.png')} style={styles.userImg} />
            </ImageBackground>
            <View style={styles.drawerListWrapper}>
                <DrawerItemList {...props} />
            </View>
        </DrawerContentScrollView>
    )
}

export default CustomDrawer

const styles = StyleSheet.create({
    userImg: {
        width: 110,
        height: 110,
        borderRadius: 110 / 2,
        position: 'absolute',
        left: width / 2 - 125,
        bottom: -110 / 2,
        borderWidth: 4,
        borderColor: 'white',
    },
    drawerListWrapper: {
        marginTop: 65,
      },
})