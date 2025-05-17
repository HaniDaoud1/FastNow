export type RootStackParamList = {
  Login: undefined;
  OTP: { phone: string };
  Home: { phone: string };
  PaymentMethods: undefined;
  Map: { place: Place }; // 'place' comme paramètre pour Map
Profile: {
    type: string;
    trjet: number;
    prix: number;
  };};

interface Place {
  place_name: string;
  center: [number, number]; // Longitude, Latitude
  id: string;
}
