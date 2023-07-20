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
        console.log('{QRScanner}: useEffect called');
        const getBarCodeScannerPermissions = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        };
    
        getBarCodeScannerPermissions();
      }, []);

    /* update the users tally for that specific coffee shop */
async function handleBarcodeScanned({ data }) {
    setScanned(true);

      // create / update the users coffee bought tally for the specified coffee shop
      const collectionRef = collection(FIREBASE_DB, 'data');

      await getShopData(collectionRef, data).then( (snap) => {
          max = snap.data()['max_tally'];
          logo = snap.data()['logo'];
      });

      const docRef = doc(collectionRef, FIREBASE_AUTH.currentUser.email);
      let docSnap = getTallyData(data, docRef).then( (docSnap) => {
        console.log('{QRScanner}: Scanned - ' + data);
          // on initial scan
          if ( docSnap === undefined ) {
            console.log('Clause 1');
              // create a new vendor field for the user document
              setDoc(docRef, { [data] : { 'current' : 1, 'max' : max, 'most_recent' : new Date().getTime(), 'logo': logo } }, {merge: true} );
              return 1;
          } else if ( Number(docSnap.current) >= Number(docSnap.max) ) {
              console.log('Clause 2');
              // set current to 0, time since epoch
              setDoc(docRef, { [data] : { 'current' : 0, 'max' : max, 'most_recent' : new Date().getTime(),'logo': logo } }, {merge: true} );
              return 0;
          } else if ( Number(docSnap.current) < Number(docSnap.max) ) {
              console.log('Clause 3');
              // increment current by 1, time since epoch
              let count = Number(docSnap.current) + 1;
              setDoc(docRef, { [data] : { 'current' : count, 'max' : max, 'most_recent' : new Date().getTime(),'logo': logo } }, {merge: true} );
              return count;
          }
      }).then((val) => {

        /* checks that firestore holds the updated current value */
        function intervalFunction() {
            getTallyData( data, docRef ).then( (docSnap) => {
                if ( docSnap['current'] == val ) return true;
            })
        }

        /* repeats interval until firestore holds the updated current value  */
        let checkCorrectCurrent = setInterval( intervalFunction, 100, data, docRef, val );
        while( !checkCorrectCurrent ) {
            console.log('Incorrect current');
            continue;
        }
        console.log( 'docSnap[\'current\'] == val ' )
        clearInterval( checkCorrectCurrent );
        getTallyData(data, docRef).then( (docSnap) => {

        }).then(() => {
            console.log('{QRScanner} returning to Home');
            return navigation.navigate('Home');
        })
        // getTallyData(data, docRef).then( (docSnap) => {
        //     do {
        //         let checkRetrievedCurrent = setInterval( () => {
        //             return docSnap['current'] == val
        //         }, 1000 );
        //         if ( checkRetrievedCurrent ) {
        //             clearInterval(checkRetrievedCurrent)
        //         }
        //         console.log(docSnap.current + ' != ' + val);
        //     } while( docSnap['current'] != val )

        //     while ( docSnap['current'] != val ) {
        //         console.log(docSnap.current + ' != ' + val);
        //         continue;
        //     }
        // }).then(() => {
        //     console.log('{QRScanner} returning to Home');
        //     return navigation.navigate('Home');
        // })
      }).catch((error) => { console.error("error assigning tally data: " + error) });
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