import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

const Map = ( {navigation} ) => {
    return (
        <View style={styles.mapContainer}>
            <MapView style={styles.map} initialRegion={{ latitude: 50.72626830150681, longitude: -3.5253928152082454, latitudeDelta: 0.05, longitudeDelta: 0.05 }}  />
        </View>
    )
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
    },
    map : {
        height: '100%',
        width: '100%',
    }
})

export default Map;