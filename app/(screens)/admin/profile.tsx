import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import MyProfile from '../profile';

const AdminProfile = () => {
  const { signOut } = useAuth();
  return <MyProfile />;
};

export default AdminProfile;
