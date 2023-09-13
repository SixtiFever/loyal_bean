import React from 'react'
import { View, Text, Button } from 'react-native';
import { FIREBASE_AUTH } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Settings = ({navigation}) => {

    onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          console.log(user.email)
          // ...
        } else {
          // User is signed out
          // ...
        }
      });

      function handleLogout() {

        try {
            FIREBASE_AUTH.signOut();
            return navigation.navigate('Login');
        } catch ( error ) {
            console.log('Error ( Settings.js / 26 ): ' + error);
        }

      }

    return (
        <View style={ { flex: 1, justifyContent: 'center' } }>
            <Button title='Logout' onPress={handleLogout}/>
        </View>
    )
}

export default Settings;