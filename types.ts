// types.ts
export type RootStackParamList = {
  Login: undefined;
  Register: undefined; // Đảm bảo Register được khai báo ở đây
  Dashboard: undefined;
  Inventory: undefined;
  History: { productId: string };
};
