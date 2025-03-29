import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProfileScreen from '@/components/Profile';

const AdminProfile = () => {
  const { signOut } = useAuth();
  return <ProfileScreen />;
};

export default AdminProfile;
