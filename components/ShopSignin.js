import React, { useState } from 'react';
import {Text, View, Button, Pressable, StyleSheet, TextInput, KeyboardAvoidingView} from 'react-native';
import ShopProfile from './ShopProfile';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


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
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <KeyboardAvoidingView style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'}} behavior="padding">
                <TextInput style={styles.textInput} placeholder="Email" onChangeText={text => setEmail(text)}/>
                <TextInput style={styles.textInput} placeholder="Password" onChangeText={text => setPassword(text)}/>
                <Pressable style={styles.pressableButton} onPress={handleSignin}>
                    <Text>Sign in</Text>
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
    },
    pressableButton: {
        width: '80%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#FF5E36',
    },
})