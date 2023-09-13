import { BarCodeScanner } from 'expo-barcode-scanner';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../firebase';
import { Audio } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';


const QRScanner = ({navigation}) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [maxCoffees, setMaxCoffees] = useState(0);
    const [logoURI, setLogoURI] = useState("");
    const [userDoc, setUserDoc] = useState(null);
    const [userDocSize, setUserDocSize] = useState(0);

    /* on initial render get permissions and put all user data */
    useEffect(() => {

        // get permissions
        const getBarCodeScannerPermissions = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();

        // get user document
        const collectionRef = collection(FIREBASE_DB, 'data');
        const userDocRef = doc( collectionRef, FIREBASE_AUTH.currentUser.email );
        getDoc(userDocRef).then( (userDoc) => {
            if ( userDoc ) {
                return setUserDoc(userDoc);
            } else {
                return setUserDoc(undefined);
            }
        }).catch((error) => {
            console.log(error + 'Error......');
        });
      }, []);

    async function handleBarcodeScanned( {data} ) {

        setScanned(true);

        // temp object to make local copy of user document snapshot
        let tempDoc = {  }

        // copy field values from doc snap into a temp object
        for ( let prop in userDoc.data()[data] ) {
            tempDoc[prop] = userDoc.data()[data][prop];
        }

        const sound = new Audio.Sound();
        // conditions for updating loyalty card data
        if ( Number(tempDoc['current']) >= Number(tempDoc['max']) ) {
            tempDoc['current'] = 0;
            tempDoc['most_recent'] = new Date().getTime();
            tempDoc['user_shop_score'] += 1;
            playSound(sound, require('../assets/sounds/scanSound.mp3'));
        } else if ( Number(tempDoc['current']) < Number(tempDoc['max']) ) {
            tempDoc['current'] += 1;
            tempDoc['most_recent'] = new Date().getTime();
            tempDoc['user_shop_score'] += 1;
            if ( Number(tempDoc['current']) == Number(tempDoc['max']) ) {
                playSound(sound, require('../assets/sounds/dingLofi.mp3'));
            } else {
                playSound(sound, require('../assets/sounds/scanSound.mp3'));
            }
        } else if ( tempDoc['current'] === undefined ) { // if the tempDoc is undefined due to not being a shop field in user document,
            // then get the shop document data, and input the data needed for a loyalty card instance creation. Then set the document
            // to create the loyalty card in the user document.
            // get shop document
            const collectionRef = collection( FIREBASE_DB, 'data' );
            // get shop data needed to create loyalty card for user ( name, logo, current, max )
            await getShopData(collectionRef, data).then( (shopSnap) => {
                tempDoc['max'] = shopSnap.data()['max_tally'];
                tempDoc['logo'] = shopSnap.data()['logo'];
                tempDoc['current'] = 1;
                tempDoc['most_recent'] = new Date().getTime();
                tempDoc['user_shop_score'] = 1;
                playSound(sound, require('../assets/sounds/scanSound.mp3'));
            }).catch((error) => console.log(error));
        }

        let newObj = { [data] : tempDoc }

        //
        const collectionRef = collection(FIREBASE_DB, 'data');

        // retrieve shop document and store in local object, update customers field
        // in the local object, and merge the local object to the shops document.
        const shopDocRef = doc(collectionRef, data);
        let tempShopObj = {};
        await getDoc(shopDocRef).then( snap => {
            tempShopObj = snap.data()['customers'];
            // if the customer hasnt visited the shop before
            if ( !tempShopObj[FIREBASE_AUTH.currentUser.email] ) {
                tempShopObj[FIREBASE_AUTH.currentUser.email]['scans'] = Number(1);
            } else {
                let count = tempShopObj[FIREBASE_AUTH.currentUser.email]['scans'] + 1;
                tempShopObj[FIREBASE_AUTH.currentUser.email]['scans'] = Number(count);
            }
        }).catch( error => {
            console.log('Error getting shop data (QRScanner.js/98): ' + error);
        });
        
        await setDoc( shopDocRef, { 'customers': { [FIREBASE_AUTH.currentUser.email] :  tempShopObj[FIREBASE_AUTH.currentUser.email]  } }, {merge: true} );

        // set / merge the user document document
        const userDocRef = doc(collectionRef, FIREBASE_AUTH.currentUser.email);
        await setDoc( userDocRef , newObj , {merge: true} ).then(() => {
            return navigation.goBack();
        }).catch((error) => {
            console.log('Set doc error ' + error.message);
        });
    }
      

    return (
        <View style={styles.container}>
            <BarCodeScanner onBarCodeScanned={ !scanned ? handleBarcodeScanned : undefined } style={{height: 400, width: 400}} />
        </View>
    )
}


async function getTallyData(shopName, docRef) {
    const docSnap = await getDoc(docRef);
    let data = await docSnap.get(shopName);
    return data;
}

async function getShopData(collectionRef, shopName) {
    const shopDocRef = doc(collectionRef, shopName);
    const docSnap = await getDoc(shopDocRef);
    const snapData = docSnap;
    return snapData;
}

async function playSound(sound, path) {
    
    await Audio.setAudioModeAsync( { playsInSilentModeIOS: true } );
    try {
        await sound.loadAsync(path, {
            volume: 0.50,
            shouldPlay: true,
            isMuted: false,
        });
        await sound.setPositionAsync(0);
        await sound.playAsync();
    } catch (error) {
        console.log('Error playing success sound: ' + error);
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

});


export default QRScanner;