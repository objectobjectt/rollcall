import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'teacher' | 'student';
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const signIn = async (email, password, role) => {
    const token = {
      id: Math.random().toString(),
      name: email,
      role: role,
      password: password,
    };

    console.log('Token', token);

    await AsyncStorage.setItem('token', JSON.stringify(token));
    setUser(token);
    console.log('User', user);
    return token;
  };

  const getUserInfo = async () => {
    // try {
    //   const token = await AsyncStorage.getItem('token');
    //   console.log(token);
    //   setUser(token);
    //   console.log('User', user);
    //   if (user == null) {
    //     router.push('/(auth)/Login');
    //   } else {
    //     router.push('/(tabs)');
    //   }
    // } catch (err: any) {
    //   await AsyncStorage.removeItem('token');
    //   return null;
    // }
  };

  return {
    user,
    loading,
    signOut: () => {},
    signIn,
    getUserInfo,
  };
}
