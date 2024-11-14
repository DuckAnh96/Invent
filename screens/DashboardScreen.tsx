// screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

export default function DashboardScreen({ navigation }: Props) {
  // Hàm đăng xuất
  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.replace('Login'); // Quay về màn hình đăng nhập sau khi đăng xuất
    }).catch((error: any) => {
      console.error("Logout error: ", error);
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}> Chào mừng đến với Bếp The Salt </Text>
      <Button
        title="Quản lý hàng tồn"
        onPress={() => navigation.navigate('Inventory')}
      />
      <Button
        title="Đăng xuất"
        onPress={handleLogout}
        color="red"
      />
    </View>
  );
}
