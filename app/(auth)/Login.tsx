import { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  SegmentedButtons,
  IconButton,
  Surface,
} from 'react-native-paper';
import { Link, router, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
// import { AuthService } from '@/services/auth';

type Role = 'learner' | 'trainer' | 'admin';

export default function LoginScreen() {
  const [email, setEmail] = useState('abc@example.com');
  const [password, setPassword] = useState('abc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<Role>('learner');
  const [showPassword, setShowPassword] = useState(false);
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
      <StatusBar barStyle="light-content" backgroundColor="#0A2463" />
      
      {/* Decorative top elements */}
      <View style={styles.topDecoration}>
        <LinearGradient
          colors={['#0A2463', '#3E92CC']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      <Surface style={styles.card}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to continue your journey
          </Text>
        </View>

        <View style={styles.roleContainer}>
          <Text variant="labelLarge" style={styles.roleLabel}>Select your role</Text>
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
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text variant="labelLarge" style={styles.inputLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={loading}
              error={!!error}
              outlineColor="#D8E1E9"
              activeOutlineColor="#3E92CC"
              theme={{ colors: { primary: '#3E92CC' } }}
              left={<TextInput.Icon icon="email-outline" color="#0A2463" />}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text variant="labelLarge" style={styles.inputLabel}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              disabled={loading}
              error={!!error}
              outlineColor="#D8E1E9"
              activeOutlineColor="#3E92CC"
              theme={{ colors: { primary: '#3E92CC' } }}
              left={<TextInput.Icon icon="lock-outline" color="#0A2463" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  color="#0A2463"
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
          </View>

          {error && (
            <HelperText type="error" visible={!!error} style={styles.errorText}>
              {error}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            contentStyle={styles.buttonContent}
            loading={loading}
            disabled={loading || !email || !password}
            buttonColor="#0A2463"
            textColor="#FFFFFF"
          >
            Sign In
          </Button>

          {/* <View style={styles.links}>
            <Button 
              mode="text" 
              textColor="#3E92CC"
              style={styles.forgotPasswordBtn}
              icon="help-circle-outline"
            >
              Forgot Password?
            </Button>
          </View> */}
        </View>

        {/* <View style={styles.footer}>
          <Text variant="bodyMedium" style={styles.footerText}>
            Don't have an account?
          </Text>
          <Button 
            mode="text" 
            textColor="#0A2463"
            style={styles.signUpBtn}
          >
            Create Account
          </Button>
        </View> */}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
  topDecoration: {
    height: Dimensions.get('window').height * 0.3,
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  gradient: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  card: {
    marginTop: Dimensions.get('window').height * 0.15,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontWeight: 'bold',
    color: '#0A2463',
    textAlign: 'center',
  },
  subtitle: {
    color: '#5C5F6B',
    marginTop: 8,
    textAlign: 'center',
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleLabel: {
    color: '#0A2463',
    marginBottom: 8,
    fontWeight: '500',
  },
  roleSelector: {
    backgroundColor: '#F5F9FC',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#0A2463',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 56,
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
  links: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  forgotPasswordBtn: {
    borderRadius: 8,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#5C5F6B',
  },
  signUpBtn: {
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
});