import React, { useState } from 'react';
import {Text, View, Button, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Image} from 'react-native';
import ShopProfile from './ShopProfile';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const logo = require('../assets/lb_logo.png');


const ShopSignin = ({navigation}) => {
    const auth = getAuth();
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');

    function handleSignin() {
        console.log('email: ' + email);
        console.log('password: ' + password);

        signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    return navigation.navigate(ShopProfile);
    // ...
  })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage);
  });
    }

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFEF9'}}>
            <View style={styles.logoContainer}>
                    <Image source={logo} style={{height: 100, width: 100}} />
                </View>
            <KeyboardAvoidingView style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'}} behavior="padding">
                <TextInput style={styles.textInput} placeholder="Email" onChangeText={text => setEmail(text)}/>
                <TextInput style={styles.textInput} placeholder="Password" onChangeText={text => setPassword(text)}/>
                <Pressable style={styles.pressableButton} onPress={handleSignin}>
                    <Text style={{color: 'white'}}>Sign in</Text>
                </Pressable>
                <Pressable onPress={() => { navigation.navigate('ShopSignup') }}>
                    <Text>Shop not registered? Register here!</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ShopSignin;

const styles = StyleSheet.create({
    textInput: {
        width: '80%',
        height: 60,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 6,
        color: 'black',
        paddingStart: 15,
        marginBottom: 40,
    },
    pressableButton: {
        width: '80%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#F70084',
        marginBottom: 20,
    },
    logoContainer : {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '40%',
        position: 'absolute',
        top: 0,
    }
})