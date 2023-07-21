import { getAuth, onAuthStateChanged } from "firebase/auth";
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import QRScanner from './QRScanner';
import { collection, addDoc, doc, getDoc, FieldValue } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import db, { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const shopLogo = require('../assets/logos/grow_logo.png')

const Home = ({navigation}) => {

    const [username, setUsername] = useState("")
    const [cardArray, setCardArray] = useState([]);
    const isFocused = useIsFocused();
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
        if ( !isFocused ) return;

        console.log('{Home}: useEffect called: ' + isFocused);

        /* REWRITE THIS FUNCTION */

        (async () => {
            console.log('{Home}: async entered');
            await getUserDocument().then( userDocSnap => {
                console.log('{Home - async}: Retrieved user document snapshot: ' + userDocSnap.id);
                let coffeeShopObjects = [];
                console.log('String docSnap: ' + JSON.stringify(userDocSnap.data()))
                // iterates coffee shops in the users document
                Object.entries( userDocSnap.data() ).forEach( ([coffeeShop, coffeeShopData]) => {
                    coffeeShopObjects.push({ 'name' : coffeeShop, 'current' : coffeeShopData.current, 'max' : coffeeShopData.max, 'timestamp' : coffeeShopData.most_recent, 'logo' : coffeeShopData.logo });
                    console.log('{Home} Pushing ' + coffeeShop + ' to CoffeeShop array.')
                });
                return coffeeShopObjects;
            }).then( coffeeShopObjects => {
                coffeeShopObjects.sort((a,b) => {
                    if ( a.timestamp < b.timestamp ) {
                        return 1;
                    } else if ( a.timestamp > b.timestamp ) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                setCardArray(coffeeShopObjects);
            }).catch( (error) => { console.log('{Home}: Error retrieving user coffeeShop document: ' + error) });
        })();

    }, [isFocused]);

    if (username) {
        console.log("{Home}: Return")
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
                                        logo={item.logo}
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
    let logo = props.logo ? props.logo : shopLogo;
    return (
        <View style={styles.cardBackground}>
            <View style={styles.cardLogoBackground}>
                <Image  source={{ uri : logo }} style={{height: 100, width: 100}} />
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
    const logo = props.logo ? props.logo : shopLogo;
    return (
        <View style={styles.freeCardBackground}>
            <View style={styles.cardLogoBackground}>
                <Image source={{ uri: logo }} style={{height: 100, width: 100}} />
            </View>
            <View style={styles.cardDetailsBackground}>
                <View style={styles.titleContainer}>
                    <Text>{props.name}</Text>
                </View>
                <View style={styles.tallyContainer}>
                    <View style={{height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 30, color: 'black'}}>Redeem Coffee</Text>
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