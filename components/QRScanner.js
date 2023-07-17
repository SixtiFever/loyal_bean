import { BarCodeScanner } from 'expo-barcode-scanner';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../firebase';

const QRScanner = ({navigation}) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [maxCoffees, setMaxCoffees] = useState(0);
    const [logoURI, setLogoURI] = useState("");
    let max, logo;

    /* on initial render get permissions */
    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        };
    
        getBarCodeScannerPermissions();
      }, []);

    /* update the users tally for that specific coffee shop */
async function handleBarcodeScanned({ data }) {
    setScanned(true);

    // get reference to logo image in firebase storage
    const storagRef = ref(FIREBASE_STORAGE, `${data}/logo.png`);
    const logoRef = await getDownloadURL(storagRef);

      // create / update the users coffee bought tally for the specified coffee shop
      const collectionRef = collection(FIREBASE_DB, 'data');

      let shopDocSnap = getShopData(collectionRef, data, setMaxCoffees).then( (snap) => {
          max = snap.data()['max_tally'];
      });

      const docRef = doc(collectionRef, FIREBASE_AUTH.currentUser.email);
      let docSnap = getTallyData(data, docRef).then( (docSnap) => {
          // on initial scan
          if ( docSnap === undefined ) {
            console.log('Clause 1: ' + logoRef);
              // create a new vendor field for the user document
              setDoc(docRef, { [data] : { 'current' : 1, 'max' : max, 'most_recent' : new Date().getTime(), 'logo': logoRef } }, {merge: true} );

          } else if ( Number(docSnap.current) >= Number(docSnap.max) ) {
              console.log('Clause 2');
              // set current to 0, time since epoch
              setDoc(docRef, { [data] : { 'current' : 0, 'max' : max, 'most_recent' : new Date().getTime()} }, {merge: true} );
          } else if ( Number(docSnap.current) < Number(docSnap.max) ) {
              console.log('Clause 3');
              // increment current by 1, time since epoch
              let count = Number(docSnap.current) + 1;
              setDoc(docRef, { [data] : { 'current' : count, 'max' : max, 'most_recent' : new Date().getTime() } }, {merge: true} );
          }
      }).then(() => {
          console.log('QrScanner: 2nd then statement')
          navigation.navigate('Home')
      }).catch(() => { console.error("error assigning tally data") });
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
    const snapData = await docSnap;
    return await snapData;
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