import app, { FIREBASE_AUTH } from './firebase';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './components/login';
import Signup from './components/signup';
import Home from './components/Home'
import QRScanner from './components/QRScanner';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
            <Stack.Screen options={{title: 'Your loyalty cards'}} name='Home' component={Home} />
            <Stack.Screen name='QRScanner' component={QRScanner} />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
