import { BarCodeScanner } from 'expo-barcode-scanner';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from '../firebase';

const QRScanner = ({navigation}) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    /* on initial render get permissions */
    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        };
    
        getBarCodeScannerPermissions();
      }, []);

      /* update the users tally for that specific coffee shop */
      function handleBarcodeScanned({ data }) {

        // create / update the users coffee bought tally for the specified coffee shop
        const collectionRef = collection(FIREBASE_DB, 'data');

        const docRef = doc(collectionRef, FIREBASE_AUTH.currentUser.email);
        let docSnap = getTallyData(data, docRef).then( (docSnap) => {
            if ( docSnap === undefined ) {
                setDoc(docRef, { [data] : { 'current' : 1, 'max' : 4, 'most_recent' : new Date().getTime() } }, {merge: true} );
            } else if ( Number(docSnap.current) >= Number(docSnap.max) ) {
                // set current to 0, time since epoch
                setDoc(docRef, { [data] : { 'current' : 0, 'max' : 4, 'most_recent' : new Date().getTime() } }, {merge: true} );
            } else if ( Number(docSnap.current) < Number(docSnap.max) ) {
                // increment current by 1, time since epoch
                let count = Number(docSnap.current) + 1;
                setDoc(docRef, { [data] : { 'current' : count, 'max' : 4, 'most_recent' : new Date().getTime() } }, {merge: true} );
            }
        }).catch(() => { console.error(docSnap) });
        setScanned(true);
        navigation.navigate('Home');
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