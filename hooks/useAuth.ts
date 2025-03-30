import { Api } from '@/constants/ApiConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'trainer' | 'learner';
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      let token = await AsyncStorage.getItem('user');
      if (token) {
        const parsedToken = JSON.parse(token);
        let userdata: any = await AsyncStorage.getItem('user.info');
        if (userdata !== null && userdata !== undefined) {
          userdata = JSON.parse(userdata);
          setUser(userdata);
        } else {
          userdata = await Api.get(Api.GET_INFO(parsedToken.role));
          if (userdata.responseJson.error) {
            setUser(null);
            return;
          }
          let userInfo = userdata.responseJson;
          if (parsedToken.role === 'admin') {
            userInfo = userInfo.adminInfo;
          }
          if (parsedToken.role === 'trainer') {
            userInfo = userInfo.trainerInfo;
          }
          if (parsedToken.role === 'learner') {
            userInfo = userInfo.info;
          }
          await AsyncStorage.setItem(
            'user.info',
            JSON.stringify(userInfo)
          );
          setUser(userInfo);
        }
        console.log(userdata);
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

  useEffect(() => {
    fetchUser();
  }, []); // Empty dependency array means this runs once on mount

  const signIn = async (email: string, password: string, role: string) => {
    try {
      const data = await Api.post(Api.GET_LOGIN_URL(role), { email, password });
      const token = data.responseJson.token;
      if (token) {
        await AsyncStorage.setItem('user', JSON.stringify({ token, role }));
        fetchUser();
        setUser(token as User);
        router.push('/(tabs)');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('user.info');
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
