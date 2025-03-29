import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'trainer' | 'learner';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setUser(JSON.parse(token) as User);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const router = useRouter();

  const signIn = async (email: string, password: string, role: string) => {
    const token = {
      id: Math.random().toString(),
      name: email,
      email: email,
      role: role,
      password: password,
    };
    await AsyncStorage.setItem('token', JSON.stringify(token));
    setUser(token as User);
    router.push('/(tabs)');
  };

  const signOut = async () => {
    console.log('Requesting sign out');
    await AsyncStorage.removeItem('token');
    setUser(null);
    router.push('/(auth)/Login');
  };

  return {
    user,
    loading,
    signOut,
    signIn,
    setUser,
  };
}
