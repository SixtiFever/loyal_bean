import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ShopProfile = ({navigation}) => {

    const [shopEmail, setShopEmail] = React.useState('');
    const [shopObject, setShopObject] = React.useState(null);
    const [stateCustomerArray, setStateCustomerArray] = React.useState(null);
    let customerArray = [];

    onAuthStateChanged(FIREBASE_AUTH, (shop) => {
        if ( shop ) {
            setShopEmail(shop.email);
            // find shop document and retrieve all field data

        } else {
            // user is signed out
        }
    })

    React.useEffect(() => {

        (async () => {

            if ( shopEmail ) {

                const collectionRef = collection( FIREBASE_DB, 'data' );
                try {
                    const snap = await getDocs(collectionRef);
                    snap.forEach( doc => {
                        if ( doc.data()['shop_email'] ) {
                            // find the shop document via querying the collection with shop_email
                            if ( doc.data()['shop_email'].toLowerCase() == shopEmail.toLowerCase() ) {
                                // assign shop object to variable
                                setShopObject(doc.data());
                                for ( let customer of Object.entries(doc.data()['customers']) ) {
                                    customerArray.push(customer);
                                }
                                setStateCustomerArray(customerArray);
                                return;
                            }
                        }
                    } )
                } catch ( err ) {
                    console.log(err);
                }
            }

        })();

        
    }, [shopEmail]);

    return (
        <View>
            <View style={styles.textContainer}>
                <Text style={styles.key}>Shop name</Text>
                <Text style={styles.value}>{ shopObject ? shopObject['shop_name'] : 'Issue showing name' }</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.key}>Shop email</Text>
                <Text style={styles.value}>{ shopEmail ? shopEmail : 'Issue showing email' }</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.key}>Shop number</Text>
                <Text style={styles.value}>{ shopObject ? shopObject['shop_number'] : 'Issue showing number' }</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.key}>Shop address</Text>
                <Text style={styles.value}>{ shopObject ? shopObject['shop_address'] : 'Issue showing address' }</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.key}>Shop password</Text>
                <Text style={styles.value}>{ shopObject ? shopObject['shop_password'] : 'Issue showing address' }</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.key}>Contact name</Text>
                <Text style={styles.value}>{ shopObject ? shopObject.contact_name : 'Issue retrieving shop contact name' }</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.key}>Contact email</Text>
                <Text style={styles.value}>{ shopObject ? shopObject.contact_email : 'Issue retrieving shop contact email' }</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.key}>Contact number</Text>
                <Text style={styles.value}>{ shopObject ? shopObject.contact_number : 'Issue retrieving shop contact number' }</Text>
            </View>
            <View style={[styles.textContainer, { marginLeft: 15 }]}>
            <Text style={styles.key}>Customer stats:</Text>

                {/* { shopObject ==  null ? <Text>No customer states</Text> : Object.entries(shopObject['customers']).map( customer => {
                    return (
                        <Text style={[styles.value, { marginLeft: 10 }]} key={customer[0]}>{ customer[0] } : { customer[1]['scans'] }</Text>
                    )
                }) }     */}
            </View>

            <View style={{ marginTop: 25 }}>
            <Button title='Logout' onPress={() => {
                FIREBASE_AUTH.signOut();
                navigation.pop();
            }} />
            </View>
            
        </View>
    )
}



const styles = StyleSheet.create({
    textContainer: {
        display: 'flex',
        height: 75,
        justifyContent: 'center',
        marginLeft: 15,
    },
    key: {
        fontSize: 14,
        color: '#1B0229',
        fontWeight: 900,
    },
    value: {
        fontSize: 22,
        color: '#1B0229',
        fontWeight: 300,
    },
})

export default ShopProfile;