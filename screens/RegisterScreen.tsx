// screens/RegisterScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { auth } from '../services/firebaseConfig'; // Firebase Auth
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth'; // Cập nhật từ Firebase SDK v9+
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Cấu hình Google Auth với client ID từ Firebase
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Thay thế bằng client ID của bạn
  });

  // Xử lý đăng ký bằng email và mật khẩu
  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password) // Cập nhật theo Firebase v9+
      .then(() => {
        Alert.alert('Registration Successful');
        navigation.navigate('Login');
      })
      .catch((error: { message: string }) => {
        Alert.alert('Registration Error', error.message);
      });
  };

  // Xử lý đăng nhập Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token); // Sử dụng đúng phương thức từ Firebase Auth
      signInWithCredential(auth, credential) // Đăng nhập bằng Google
        .catch((error: { message: string }) => {
          Alert.alert('Google Sign-In Error', error.message);
        });
    }
  }, [response]);

  return (
    <View>
      <Text>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
      <Button title="Register with Email" onPress={handleRegister} />

      <Button
        title="Register with Google"
        disabled={!request} // Disabled if request is not available
        onPress={() => promptAsync()} // Triggers Google sign-in
      />

      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
