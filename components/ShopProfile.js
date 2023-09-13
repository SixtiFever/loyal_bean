import React from 'react';
import { View, Text, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

const ShopProfile = ({navigation}) => {

    const [shopEmail, setShopEmail] = React.useState('');
    const [shopObject, setShopObject] = React.useState(null);

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
                                console.log(shopObject);
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
            <Text>Shop name: { shopObject ? shopObject['shop_name'] : 'Issue showing name' }</Text>
            <Text>Shop email: { shopEmail ? shopEmail : 'Issue showing email' }</Text>
            <Text>Shop number: { shopObject ? shopObject['shop_number'] : 'Issue showing number' }</Text>
            <Text>Shop address: { shopObject ? shopObject['shop_address'] : 'Issue showing address' }</Text>
            <Text>Shop password: { shopObject ? shopObject['shop_password'] : 'Issue showing address' }</Text>
            <Text>Contact name: { shopObject ? shopObject.contact_name : 'Issue retrieving shop contact name' }</Text>
            <Text>Contact name: { shopObject ? shopObject.contact_email : 'Issue retrieving shop contact email' }</Text>
            <Text>Contact name: { shopObject ? shopObject.contact_number : 'Issue retrieving shop contact number' }</Text>
            <Image source={shopObject['logo']} style={{width: 100, height: 100}} />
        </View>
    )
}

export default ShopProfile;