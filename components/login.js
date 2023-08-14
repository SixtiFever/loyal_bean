import { StyleSheet, View, TextInput, Pressable, Text, Image, KeyboardAvoidingView } from "react-native";
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebase";

const logo = require('/Users/JDSwift/Desktop/react-native/login-portal/assets/lb_logo.png');


const Login = ({navigation}) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {

        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, username, password);
            if ( FIREBASE_AUTH.currentUser && FIREBASE_AUTH.currentUser.emailVerified ) {
                navigation.navigate('StackHome');
                return;
            } else {
                alert('Email not verified');
            }
        } catch (error) {
            console.log('Signin error: ' + error);
        }

    }


    return (
        <View style={styles.mainContainer}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                <View style={styles.logoContainer}>
                    <Image source={logo} style={{height: 100, width: 100}} />
                </View>
                <View style={styles.inputContainer}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <TextInput style={styles.textInput} placeholder="Email" onChangeText={text => setUsername(text)}/>
                        <TextInput secureTextEntry={true} style={[styles.textInput]} placeholder="Password" onChangeText={text => setPassword(text)} />
                        <Pressable style={styles.pressableButton} onPress={handleLogin}>
                            <Text style={{color: 'white'}}>Login</Text>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.pressableText}>Create account</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        flex: 2,
    },
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
    pressableText: {
        color: 'blue',
    }
})

export default Login;