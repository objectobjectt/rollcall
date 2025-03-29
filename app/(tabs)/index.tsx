import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const Home = () => {
  const { getUserInfo, user } = useAuth();
  const userInfo = async () => {
    const user = await getUserInfo();
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
