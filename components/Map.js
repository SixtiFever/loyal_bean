import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase';
import * as Location from 'expo-location';

const Map = ( {navigation} ) => {

    const [cafeLocations, setCafeLocations] = useState(null);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        getCafeLocations().then((docSnap) => {
            setCafeLocations(docSnap.data());
        });

        ( async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
            console.log('Permission granted');
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();

    }, [])

    if ( cafeLocations ) {
        return (
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{ latitude:  location ? location['coords']['latitude'] :  50.72626830150681, longitude: location ? location['coords']['longitude'] :  -3.5253928152082454, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    provider='google'
                    >
                    { Object.entries(cafeLocations).map((cafe) => {
                        return (
                            Object.entries(cafe[1]['coordinates']).map((geoCord) => {
                            return (
                                <Marker 
                                key={Number(geoCord[1]['lat'])} 
                                tappable={true} 
                                coordinate={{latitude: Number(geoCord[1]['lat']), longitude: Number(geoCord[1]['lng'])}}
                                onPress={() => alert('Cafe name\n' + cafe[0])}>
                                    <Ionicons name="md-cafe" size={24} color="#EB6424" />
                                </Marker>
                        )
                        })
                        )
                        
                        return;
                    })}
                </MapView>
            </View>
        )
    } else {
        {
            getCafeLocations().then((docSnap) => {
                setCafeLocations(docSnap.data());
                console.log('Set locations array');
                return null;
            });
        }
        return (
            <View style={styles.mapContainer}>
                { console.log('Rendering default') }
            <MapView
                style={styles.map}
                initialRegion={{ latitude: locations.exeterRegion.latitude, longitude: locations.exeterUni.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                showsUserLocation={true}
                followsUserLocation={true}
                >
            </MapView>
            </View>
        )
        
    }
}

/* get cafe location data from firestore */
const getCafeLocations = async () => {
    // retrieve all cafe co-ordinates from firestore
    const collectionRef = collection( FIREBASE_DB, 'data' );
    const cafeLoctationDocumentRef = doc( collectionRef, 'shop_locations' );
    const cafeLocationsDocSnap = await getDoc(cafeLoctationDocumentRef);
    return cafeLocationsDocSnap;
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
    },
    map : {
        height: '100%',
        width: '100%',
    },
})

const locations = {
    exeterUni: {
        latitude: 50.73565389177803,
        longitude: -3.534142928128477,
    },
    exeterRegion : {
        latitude: 50.72626830150681,
        longitude: -3.5253928152082454
    },
}

export default Map;