import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'teacher' | 'student';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock authentication - replace with actual authentication
    setUser({
      id: '1',
      name: 'John Doe',
      role: 'student',
    });
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    signIn: () => {},
    signOut: () => {},
  };
}
