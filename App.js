import app, { FIREBASE_AUTH } from './firebase';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import Login from './components/login';
import Signup from './components/signup';
import Home from './components/Home';
import Map  from "./components/Map";
import Settings from './components/Settings';
import QRScanner from './components/QRScanner';
import Beans from './components/Beans';
import ShopRegister from './components/ShopRegister';
import ShopSignin from './components/ShopSignin';
import ShopSignup from './components/ShopSignup';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
        <ScreenStack />
    </NavigationContainer>
  );
}


const ScreenStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{
                headerRight: () => { return <ShopPortalPressable />},
            }} name='Login' component={Login} />
            <Stack.Screen name='Signup' component={Signup} />
            <Stack.Screen 
            options={{ headerShown: false }}
            name='StackHome' component={TabNavigation} />
            <Stack.Screen options={{ headerBackTitle: 'Loyalty cards' }} name='Map' component={Map} />
            <Stack.Screen name='LocationPressable' component={LocationPressable} />
            <Stack.Screen options={{ headerBackTitle: 'Loyalty cards' }} name='Settings' component={Settings} />
            <Stack.Screen options={{
                title: 'Shop Signin'
            }} name='ShopSignin' component={ShopSignin} />
            <Stack.Screen options={{
                title: 'Shop Registration'
            }} name='ShopSignup' component={ShopSignup} />
        </Stack.Navigator>
    )
}

const TabNavigation = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarStyle: {
                height: '10%'
            }
        }}>
            <Tab.Screen options={{title: 'Loyalty cards', unmountOnBlur: true, tabBarIcon: () => {
                return ( <MaterialCommunityIcons style={{textAlignVertical: 'center'}} name="card-multiple-outline" size={32} color="black" /> )
            },
                headerRight: () => { return <LocationPressable /> },
                headerLeft: () => { return <Logout /> },
                }}  name='TabHome' component={Home} />
            <Tab.Screen options={{unmountOnBlur: true, tabBarIcon: () => { 
                return <Ionicons name="scan" size={32} color="black" /> },
                }} name='Scan' component={QRScanner} />
            <Tab.Screen options={{unmountOnBlur: true, tabBarIcon: () => {
                return (<MaterialCommunityIcons name="progress-star" size={32} color="black" />)
            }, title: 'Points'}} name='Beans' component={Beans} />
        </Tab.Navigator>
    )
}


const Logout = () => {
    const navigation = useNavigation();
    return (
        <Pressable style={styles.settingsIcon} onPress={() => { navigation.navigate('Settings') }}>
            <Ionicons name="settings-outline" size={28} color="black" />
        </Pressable>
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

const ShopPortalPressable = () => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => { navigation.navigate('ShopSignin') }}>
            <Entypo name="shop" size={24} color="black" />
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
  },
  settingsIcon: {
    marginStart: 25,
  }
});
