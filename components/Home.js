import { getAuth, onAuthStateChanged } from "firebase/auth";
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import QRScanner from './QRScanner';
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import db, { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react/cjs/react.production.min";

const shopLogo = require('../assets/logos/grow_logo.png')

const Home = ({navigation}) => {

    const [username, setUsername] = useState("")
    const [cardArray, setCardArray] = useState([]);
    let cards = [];
    let arr = [];

    onAuthStateChanged(FIREBASE_AUTH, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setUsername(user);
    } else {
        // User is signed out
        // ...
    }
    });

    useEffect(() => {
        console.log('called');

        // pull tallies from firestore and store in array
        let docSnap = getUserDocument().then( snap => {

            Object.entries(snap.data()).forEach(([fieldName, fieldValue]) => {
                arr.push({ name: fieldName, current: fieldValue.current, max: fieldValue.max, timestamp: fieldValue.most_recent, logo: fieldValue.logo });
            });

            arr.sort((a,b) => {
                if ( a.timestamp < b.timestamp ) {
                    return 1;
                } else if ( a.timestamp > b.timestamp ) {
                    return -1;
                } else {
                    return 0;
                }
            });
            setCardArray(arr);

        }).catch(() => alert('error'));

    }, []);


    if (username) {
        return (
            <View style={styles.mainBackground}>
                <View style={styles.cardListContainer}>
                    <ScrollView contentContainerStyle={{alignItems:'center'}} style={{flex: 1}}>
                        {cardArray.map(item => {
                            if ( item.current >= item.max ) {
                                return (
                                    <FreeCard
                                        key={item.name}
                                        name={item.name}
                                        current={item.current}
                                        max={item.max}
                                    />
                                )
                            } else {
                                return (
                                    <Card
                                        key={item.name}
                                        name={item.name}
                                        current={item.current}
                                        max={item.max}
                                        logo={item.logo}
                                    />
                                )
                            }
                        })}
                    </ScrollView>
                </View>
                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Pressable style={styles.scanButton} onPress={()=> navigation.navigate('QRScanner')}>
                        <Ionicons name="scan" size={42} color="black" />
                    </Pressable>
                </View>
            </View>
        )
    }
}


const Card = (props) => {
    return (
        <View style={styles.cardBackground}>
            <View style={styles.cardLogoBackground}>
                <Image source={shopLogo} style={{height: 100, width: 100}} />
            </View>
            <View style={styles.cardDetailsBackground}>
                <View style={styles.titleContainer}>
                    <Text>{props.name}</Text>
                </View>
                <View style={styles.tallyContainer}>
                    <View style={styles.currentTally}>
                        <Text>Current</Text>
                        <Text style={{fontSize: 28, fontWeight: '600'}}>{props.current}</Text>
                    </View>
                    <View style={styles.maxTally}>
                        <Text>Goal</Text>
                        <Text style={{fontSize: 28, fontWeight: '600'}}>{props.max}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const FreeCard = (props) => {
    return (
        <View style={styles.freeCardBackground}>
            <View style={styles.cardLogoBackground}>
                <Image source={shopLogo} style={{height: 100, width: 100}} />
            </View>
            <View style={styles.cardDetailsBackground}>
                <View style={styles.titleContainer}>
                    <Text>{props.name}</Text>
                </View>
                <View style={styles.tallyContainer}>
                    <View style={{height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 48, color: 'black'}}>Free</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}


// FUNCTIONS
async function getUserDocument() {
    const collectionRef = collection(FIREBASE_DB, 'data');
    const docRef = doc( collectionRef, FIREBASE_AUTH.currentUser.email );
    const docSnap = await getDoc(docRef);
    return docSnap;
}

const styles = StyleSheet.create({
    mainBackground: {
        backgroundColor: '#FAF7F5',
        height: '100%',
        width: '100%',
    },
    cardListContainer: {
        height: '85%',
        width: '100%',
        paddingTop: 25,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FAF7F5',
    },
    cardBackground: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 4,
        width: '92%',
        height: 120,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-between',
        marginTop: 25,
        // Shadow properties
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        }),
      },
    scanButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#B5BEC6',
        borderWidth: 1,
        // Shadow properties
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        }),
    },
    cardLogoBackground: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    },
    cardDetailsBackground: {
        width: '70%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    tallyContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: '70%',
        width: '100%',
    },
    titleContainer: {
        height: '30%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    currentTally: {
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    maxTally: {
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    freeCardBackground: {
        backgroundColor: 'gold',
        borderRadius: 8,
        padding: 4,
        width: '92%',
        height: 120,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-between',
        marginTop: 25,
        // Shadow properties
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        }),
      },
});

export default Home;