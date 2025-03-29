import { Api } from '@/constants/ApiConstants';
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
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let token = await AsyncStorage.getItem('user');
        if (token) {
          const parsedToken = JSON.parse(token);
          const userdata = await Api.get(Api.GET_INFO(parsedToken.role));
          console.log(userdata);
          setUser(userdata.responseJson);
          router.push('/(tabs)');
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    console.log('Auth effect running');
    fetchUser();
  }, []); // Empty dependency array means this runs once on mount

  const signIn = async (email: string, password: string, role: string) => {
    try {
      const data = await Api.post(Api.GET_LOGIN_URL(role), { email, password });
      const token = data.responseJson.token;
      if (token) {
        await AsyncStorage.setItem('user', JSON.stringify({ token, role }));
        setUser(token as User);
        router.push('/(tabs)');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle sign-in error
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user'); // Fixed: was 'token' instead of 'user'
      setUser(null);
      router.push('/(auth)/Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    loading,
    signOut,
    signIn,
    setUser,
  };
}
