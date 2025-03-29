import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const userInfo = async () => {
    const user = await AsyncStorage.getItem('user');
    console.log(user);
  };

  useEffect(() => {
    userInfo();
  }, []);
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
