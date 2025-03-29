import { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  SegmentedButtons,
} from 'react-native-paper';
import { Link, router, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
// import { AuthService } from '@/services/auth';

type Role = 'learner' | 'trainer' | 'admin';

export default function LoginScreen() {
  const [email, setEmail] = useState('abc@example.com');
  const [password, setPassword] = useState('abc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<Role>('learner');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signIn(email, password, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="displaySmall" style={styles.title}>
          Welcome Back
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Sign in to continue
        </Text>
      </View>

      <SegmentedButtons
        value={role}
        onValueChange={(value: Role) => setRole(value as Role)}
        buttons={[
          { value: 'learner', label: 'Learner' },
          { value: 'trainer', label: 'Trainer' },
          { value: 'admin', label: 'Admin' },
        ]}
        style={styles.roleSelector}
      />

      <View style={styles.form}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={loading}
          error={!!error}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          disabled={loading}
          error={!!error}
        />

        {error && (
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          disabled={loading || !email || !password}
        >
          Sign In
        </Button>

        <View style={styles.links}>
          {/* <Link href="/forgot-password" asChild> */}
          <Button mode="text">Forgot Password?</Button>
          {/* </Link> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    color: '#666',
    marginTop: 8,
    marginBottom: 18,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  roleSelector: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
  links: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  hint: {
    color: '#666',
  },
});
