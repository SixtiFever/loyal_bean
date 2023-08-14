import React, { useEffect } from 'react'
import { View, Text } from 'react-native';

const Beans = () => {
    useEffect(() => {
        console.log('Beans entered')
    },[]);
    return (
        <View>
            <Text>Your beans</Text>
        </View>
    )
}

export default Beans;