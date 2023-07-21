import app, { FIREBASE_AUTH } from './firebase';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Login from './components/login';
import Signup from './components/signup';
import Home from './components/Home';
import Map  from "./components/Map";
import QRScanner from './components/QRScanner';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  return (
    <NavigationContainer>
        <ScreenStack />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

const ScreenStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Signup' component={Signup} />
            <Stack.Screen options={{title: 'Your loyalty cards', headerRight: () => { return <LocationPressable /> } }} name='Home' component={Home} />
            <Stack.Screen name='QRScanner' component={QRScanner} />
            <Stack.Screen name='Map' component={Map} />
            <Stack.Screen name='LocationPressable' component={LocationPressable} />
        </Stack.Navigator>
    )
}



const LocationPressable = () => {
    const navigation = useNavigation();
    return (
        <Pressable style={styles.locationIcon} onPress={() => { navigation.navigate('Map')}}>
            <Ionicons name="ios-location-outline" size={28} color="black" />
        </Pressable>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    marginEnd: 25,
  }
});
