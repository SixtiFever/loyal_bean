import { StyleSheet, View, TextInput, Pressable, Text, Image, KeyboardAvoidingView } from "react-native";
import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, sendEmailVerification } from "firebase/auth";
import { useState } from 'react';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from "../firebase";
import { collection, setDoc, doc } from "firebase/firestore";

const logo = require('/Users/JDSwift/Desktop/react-native/login-portal/assets/lb_logo.png');


const Signup = ({navigation}) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")

    async function handleSignup() {

        if ((!username || !password || !confirmPassword) || (password != confirmPassword)) {
            alert('Signup error. Ensure a university email is used, and all fields are correctly filled.');
        } else {

            try {
                let userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, username, password);
                await sendEmailVerification(userCredential.user);
                alert('Email verified. You may now sign in.');

            } catch (error) {
                console.log(error);
            }

            // createUserWithEmailAndPassword(FIREBASE_AUTH, username, password).then((userCredential) => {
            //     const user = userCredential.user;
            //     return userCredential
            // }).then( (userCredential) => {
            //     sendEmailVerification(userCredential.user).then(() => {
            //         console.log('In email verification function');
            //     }).catch((error) => {
            //         console.log(error);
            //     }) 
            //     console.log('After sendEmailVerfification');
            // }).catch((error) => {
            //     alert(error.message);
            // });
        }
    }

    async function handleVerifyEmail(verificationCode) {
        
    }

    return (
        <View style={styles.mainContainer}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                <View style={styles.logoContainer}>
                    <Image source={logo} style={{height: 100, width: 100}} />
                </View>
                <View style={styles.inputContainer}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <TextInput style={styles.textInput} placeholder="Email" onChangeText={text => setUsername(text)} />
                        <TextInput style={[styles.textInput]} placeholder="Password" onChangeText={password => setPassword(password)} />
                        <TextInput style={[styles.textInput]} placeholder="Confirm password" onChangeText={password => setConfirmPassword(password)} />
                        <Pressable style={styles.pressableButton} onPress={handleSignup}>
                            <Text style={{color: 'white'}}>Create Account</Text>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.pressableText}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}


const hasEmailFormat = (email) => {
    let uniEmailFormat = ".ac.uk"
    if ( email.includes(uniEmailFormat) ) {
        console.log('Correct uni formatted email');
        return true;
    }
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
        backgroundColor: '#4b371c',
    },
    pressableText: {
        color: 'blue',
    }
})

export default Signup;