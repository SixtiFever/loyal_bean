import React, { useState } from 'react';
import {Text, View, Button, KeyboardAvoidingView, StyleSheet, TextInput, Pressable, Image, ScrollView} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../firebase';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import QRCode from 'react-native-qrcode-svg';
import { collection, getDoc, setDoc, doc } from 'firebase/firestore';

global.Buffer = require('buffer').Buffer;

class Shop {
    constructor(shopName, shopEmail, shopNumber, contactName, contactEmail, contactNumber, shopAddress, maxCoffees, logo = null) {
        this.shopName = shopName;
        this.shopEmail = shopEmail;
        this.shopNumber = shopNumber;
        this.contactName = contactName;
        this.contactEmail = contactEmail;
        this.contactNumber = contactNumber;
        this.shopAddress = shopAddress;
        this.maxCoffees = maxCoffees;
        this.logo = logo;
        this.qrLink = '';
        this.logoUrl = '';
    }

    setQRLink(url) {
        this.qrLink = url;
    }

    setLogoUrl(url) {
        this.logoUrl = url;
    }
}

const ShopSignup = ({navigation}) => {
    const [shopName, setShopName] = React.useState('');
    const [shopEmail, setShopEmail] = React.useState('');
    const [shopNumber, setShopNumber] = React.useState('');
    const [contactName, setContactName] = React.useState('');
    const [contactEmail, setContactEmail] = React.useState('');
    const [contactNumber, setContactNumber] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [shopAddress, setShopAddress] = React.useState('');
    const [maxCoffees, setMaxCoffees] = React.useState('');
    const [logo, setLogo] = React.useState(null);
    const [qrLink, setQRLink] = React.useState('');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        }).catch( (error) => console.log(error) );

        if ( !result.canceled ) {
            console.log(result.assets[0])
            setLogo(result.assets[0].uri);
        }
    }

    const handleRegister = async() => {
        // seng logo and qr code to firebase storage
        const shop = new Shop(shopName, shopEmail, shopNumber, contactName, contactEmail, contactNumber, shopAddress, maxCoffees, logo )
        const logoStorageRef = ref( FIREBASE_STORAGE, `${shop.shopName}/logo.png` );
        // use fetch to convert the logo image to binary data since uploadBytes only accepts binary data.
        const response = await fetch(logo);
        const blob = await response.blob();
        // upload to storage
        await uploadBytes(logoStorageRef, blob);
        await getDownloadURL( logoStorageRef ).then( url => {
            shop.setLogoUrl(url);
        })
        console.log('logo uploaded');

        // generate qr code
        const shopStorageRef = ref( FIREBASE_STORAGE, `${shop.shopName}/${shop.shopName}_QRCodeLink.txt` );
        let qrLink = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + shopName;
        shop.setQRLink(qrLink)
        const qrLinkBuffer = Buffer.from(qrLink);
        await uploadBytes(shopStorageRef, qrLinkBuffer, { contentType: 'text/plain' }).then(() => {
            alert('Your shops QR Code has been generated. View it in your profile.');
        }).catch((error) => {
            console.log('Error uploading qr link: ' + error);
        });

        console.log(shop);
        // send all data to firestore
        const collectionRef = collection( FIREBASE_DB, 'data' );
        const docRef = doc( collectionRef, shopName );
        await setDoc( docRef, {
                        'shop_name': shop.shopName,
                        'shop_email': shop.shopEmail,
                        'shop_number': shop.shopNumber,
                        'contact_name': shop.contactName,
                        'contact_email': shop.contactEmail,
                        'contact_number': shop.contactNumber,
                        'shop_address' : shop.shopAddress,
                        'max_tally': shop.maxCoffees,
                        'logo': shop.logoUrl,
                        'qr_code_bytes': shop.qrLink,
        } ).then(() => {
            console.log('Shop doc uploaded');
        }).catch((error) => {
            console.log('Error uploading shop document: ' + error);
        });




    }



    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ScrollView contentContainerStyle={{alignItems:'center'}} style={{flex: 1, width: '80%'}}>
                <KeyboardAvoidingView style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'}} behavior="padding">
                    <TextInput style={styles.textInput} placeholder="Shop name" onChangeText={text => setShopName(text)}/>
                    <TextInput style={styles.textInput} placeholder="Shop email" onChangeText={text => setShopEmail(text)}/>
                    <TextInput style={styles.textInput} placeholder="Shop phone number" onChangeText={text => setShopNumber(text)}/>
                    <TextInput style={styles.textInput} placeholder="Password" onChangeText={text => setPassword(text)}/>
                    <TextInput style={styles.textInput} placeholder="Confirm password" onChangeText={text => setConfirmPassword(text)}/>
                    <TextInput style={styles.textInput} placeholder="Contact name" onChangeText={text => setContactName(text)}/>
                    <TextInput style={styles.textInput} placeholder="Contact email" onChangeText={text => setContactEmail(text)}/>
                    <TextInput style={styles.textInput} placeholder="Contact number" onChangeText={text => setContactNumber(text)}/>
                    <TextInput style={styles.textInput} placeholder="Shop address" onChangeText={text => setShopAddress(text)}/>
                    <NumericInput
                    minValue={0}
                    onChange={value => setMaxCoffees(value)} 
                    valueType='integer'
                    />
                    <Button title="Upload shop logo" onPress={pickImage} />
                    {logo && <Image source={{ uri: logo }} style={{ width: 200, height: 200 }} />}
                    <Button title="Clear" onPress={() => { setLogo(null) }} />
                    <Pressable style={styles.pressableButton} onPress={handleRegister}>
                        <Text>Register shop</Text>
                    </Pressable>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

/*  - Send the data to the QR Code api to generate the QR code. 
    - Store the link to the QR Code in firebase storage 
    -Make link saveable to phone. */
// const renderQrCode = (data) => {
//     let qrLink = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + data;
//     const shopStorageRef = ref( FIREBASE_STORAGE, `${data}/qr_code_link` );
//    // await uploadString(shopStorageRef, qrLink);

//     if ( data ) {
//         //  send link to firebase storage of the shop
//         // connect to firebase
//         return (
//                 <Image source={{uri: qrLink}} style={{ height: 100, width: 100 }} />
//         )
//     }
// }


const styles = StyleSheet.create({
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
        backgroundColor: '#FF5E36',
    },
})

export default ShopSignup;