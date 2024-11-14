import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import { db } from '../services/firebaseConfig';
import { collection, query, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

interface Product {
  id: string;
  name: string;
  quantity: number;
}

type InventoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Inventory'>;

type Props = {
  navigation: InventoryScreenNavigationProp;
};

export default function InventoryScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<string>('');

  useEffect(() => {
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    });

    return unsubscribe;
  }, []);

  const addProduct = async () => {
    if (newProduct) {
      await addDoc(collection(db, 'products'), {
        name: newProduct,
        quantity: 0
      });
      setNewProduct('');
    }
  };

  const updateQuantity = async (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;

    // Cập nhật số lượng sản phẩm
    await updateDoc(doc(db, 'products', productId), { quantity: newQuantity });

    // Thêm vào lịch sử thay đổi
    await addDoc(collection(db, 'inventoryHistory'), {
      productId: productId,
      quantityChange: change,
      date: new Date()
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tồn ngày</Text>
      <TextInput
        style={styles.input}
        placeholder="Thêm sản phẩm"
        value={newProduct}
        onChangeText={setNewProduct}
      />
      <Button title="Thêm vào" onPress={addProduct} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityText}>Số lượng: {item.quantity}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Tăng" onPress={() => updateQuantity(item.id, item.quantity, 1)} />
                <Button title="Giảm" onPress={() => updateQuantity(item.id, item.quantity, -1)} />
              </View>
            </View>
            <Button
              title="Lịch sử thay đổi"
              onPress={() => navigation.navigate('History', { productId: item.id })}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  productContainer: {
    marginVertical: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityText: {
    fontSize: 16,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
});
