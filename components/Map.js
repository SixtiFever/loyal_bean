import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase';

const Map = ( {navigation} ) => {

    const [cafeLocations, setCafeLocations] = useState(null);

    useEffect(() => {
        console.log('{Map} rendered map component');
        getCafeLocations().then((docSnap) => {
            setCafeLocations(docSnap.data());
            console.log('Set locations array');
        });
    }, [])

    if ( cafeLocations ) {
        return (
            <View style={styles.mapContainer}>
            <MapView
                style={styles.map}
                initialRegion={{ latitude: locations.exeterRegion.latitude, longitude: locations.exeterUni.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                showsUserLocation={true}
                >
                { Object.entries(cafeLocations).map((cafe) => {
                    return (
                        Object.entries(cafe[1]['coordinates']).map((geoCord) => {
                        console.log('Lat: ' + geoCord[1]['lat']);
                        console.log('Long: ' + geoCord[1]['lng']);
                        return (
                            <Marker 
                            key={Number(geoCord[1]['lat'])} 
                            tappable={true} 
                            coordinate={{latitude: Number(geoCord[1]['lat']), longitude: Number(geoCord[1]['lng'])}}
                            onPress={() => alert('Cafe name\n' + cafe[0])}>
                                <Ionicons name="md-cafe" size={24} color="#C20114" />
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


// const CafeLocations = ({props}) => {

//     const collectionRef = collection( FIREBASE_DB, 'data' );
//     const cafeLoctationDocumentRef = doc( collectionRef, 'shop_locations' );
//     getDoc(cafeLoctationDocumentRef).then((docSnap) => {
//         let cafeLocationArray = [];
//         for ( let cafe of Object.entries(docSnap.data()) ) {
//             cafeLocationArray.push(cafe);
//         }
//         console.log('{Map} Retrieved from CafeLocations')
//         return cafeLocationArray;
//     }).catch((error) => {
//         console.log('{Map} Error getting shop locations: ' + error);
//     });
//     return (
//         <View>
//             { console.log('{Map} Returning from CafeLocations') }
//             <Marker tappable={true} onPress={() => { alert('Exeter region'); }} coordinate={locations.exeterUni}>
//                 <Ionicons name="md-cafe" size={24} color="black" />
//             </Marker>
//         </View>
//     )
// }

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
    },
    map : {
        height: '100%',
        width: '100%',
    }
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