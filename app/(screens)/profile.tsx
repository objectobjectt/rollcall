import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const MyProfile = () => {
    const { signOut, user } = useAuth();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>My Profile</Text>
            <Text>I am {user?.role}</Text>
            <TouchableOpacity onPress={() => signOut()}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MyProfile;