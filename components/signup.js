import { StyleSheet, View, TextInput, Pressable, Text, Image, KeyboardAvoidingView } from "react-native";
import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, sendEmailVerification } from "firebase/auth";
import { useState } from 'react';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from "../firebase";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";

const logo = require('/Users/JDSwift/Desktop/react-native/login-portal/assets/lb_logo.png');


const Signup = ({navigation}) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")

    async function handleSignup() {

        if ((!username || !password || !confirmPassword) || (password != confirmPassword)) {
            alert('Signup error.');
        } else {

            const collectionRef = collection(FIREBASE_DB, 'data');

            try {
                let userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, username, password);
                const docRef = doc(collectionRef, userCredential.user.email);
                    setDoc(docRef, { 'total_score' : 0 }, {merge: true});
                // await sendEmailVerification(userCredential.user).then( () => {
                //     const docRef = doc(collectionRef, userCredential.user.email);
                //     setDoc(docRef, { 'total_score' : 0 }, {merge: true});
                // });

            } catch (error) {
                console.log(error);
            }
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
                        <TextInput style={styles.textInput} placeholder="Email" onChangeText={text => setUsername(text)} />
                        <TextInput style={[styles.textInput]} placeholder="Password" onChangeText={password => setPassword(password)} />
                        <TextInput style={[styles.textInput]} placeholder="Confirm password" onChangeText={password => setConfirmPassword(password)} />
                        <Pressable style={styles.pressableButton} onPress={handleSignup}>
                            <Text style={{color: 'white'}}>Create Account</Text>
                        </Pressable>
                        <View style={styles.horizontalLine}>
                        </View>
                        <Pressable onPress={() => navigation.navigate('Login')}>          
                            <Text style={styles.pressableText}>Already have an account? Login</Text>
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
        backgroundColor: '#FFFEF9'
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
        borderRadius: 6,
        color: '#1B0229',
        paddingStart: 15,
        backgroundColor: '#E3E3E3',
    },
    pressableButton: {
        width: '80%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#F70084',
    },
    pressableText: {
        color: 'blue',
    },
    horizontalLine: {
        height: 1,
        backgroundColor: '#D8D8D8',
        width: '100%',
    }
})

export default Signup;