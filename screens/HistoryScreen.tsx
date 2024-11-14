// screens/HistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from '../services/firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'; // Import các phương thức đúng từ Firestore
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

// Định nghĩa kiểu route cho HistoryScreen
type HistoryScreenRouteProp = RouteProp<RootStackParamList, 'History'>;

type Props = {
  route: HistoryScreenRouteProp;
};

export default function HistoryScreen({ route }: Props) {
  const { productId } = route.params;
  const [history, setHistory] = useState<any[]>([]); // Sử dụng kiểu dữ liệu phù hợp cho history

  useEffect(() => {
    // Cấu hình query Firestore theo kiểu mới của Firebase SDK v9+
    const historyCollection = collection(db, 'inventoryHistory');
    const q = query(
      historyCollection,
      where('productId', '==', productId),
      orderBy('date', 'desc')
    );

    // Sử dụng onSnapshot thay vì .onSnapshot() để lắng nghe sự thay đổi
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setHistory(data);
    });

    return unsubscribe; // Đảm bảo hủy đăng ký khi component bị unmount
  }, [productId]);

  return (
    <View>
      <Text>History for Product: {productId}</Text>
      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>Change: {item.quantityChange}</Text>
            <Text>Date: {item.date.toDate().toString()}</Text> {/* Nếu 'date' là Timestamp, bạn cần chuyển đổi bằng .toDate() */}
          </View>
        )}
      />
    </View>
  );
}
