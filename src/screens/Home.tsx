import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileScreen({ navigation }: any) {
  const userData = {
    name: 'Ali Menaa',
    history: [
      { id: 1, from: 'Alger', to: 'Bab Ezzouar', date: '2024-05-01', price: '500 DA', tarif: 'Exellente' },
      { id: 2, from: 'El Harrach', to: 'Bir Mourad Raïs', date: '2024-05-03', price: '600 DA', tarif: 'Bonne' },
      { id: 3, from: 'Hydra', to: 'Bab El Oued', date: '2024-05-06', price: '450 DA', tarif: 'Bonne' },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea} className="bg-gray-100">
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue, {userData.name}</Text>
        
        <View className="flex-row justify-between items-center  my-4">
  <View className="h-32 w-32 overflow-hidden rounded-full border-2 mr-5 border-green-500">
    <Animated.Image
      source={{
        uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      }}
      className="w-full h-full"
      resizeMode="cover"
      entering={FadeInRight.duration(800)}
    />
  </View>

  <View className="flex-1">
    <Text className="text-xl font-bold text-gray-800">Ali Menaa</Text>
    <View className="flex-row items-center mt-1">
      <Ionicons name="star" size={16} color="#FACC15" />
      <Text className="ml-2 text-sm text-yellow-500 font-semibold">Utilisateur Premium</Text>
    </View>
    <View className="flex-row items-center mt-1">
      <Ionicons name="call" size={16} color="#3B82F6" />
      <Text className="ml-2 text-sm text-gray-600">+213 555 55 55 55</Text>
    </View>
  </View>
</View>
<TouchableOpacity 
onPress={()=>navigation.navigate('Map')} className="flex-row items-center justify-center space-x-2 rounded-xl bg-green-600 p-4 shadow-md active:opacity-80">
  <Ionicons name="car-outline" className='mr-5' size={20} color="white" />
  <Text className="text-white font-bold text-lg">Commencer un déplacement</Text>
</TouchableOpacity>


        <Text style={styles.subtitle}>Historique des courses</Text>

       <FlatList
  data={userData.history}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item, index }) => (
    <Animated.View
  entering={FadeInRight.delay(index * 100)}
  className="bg-white rounded-xl p-3 my-2 shadow-sm border border-gray-100"
>   
 <View className='flex flex-row justify-between items-center'>

      <View className="flex-row items-center mb-1">
        <Ionicons name="navigate" size={16} color="#6B7280" />
        <Text className="ml-2 text-sm font-bold text-gray-700">{item.from} → {item.to}</Text>
      </View>

      <View className="flex-row items-center mb-1">
        <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
        <Text className="ml-2 text-xs text-gray-500">{item.date}</Text>
      </View></View>

      <View className='flex flex-row justify-between items-center'>
      <View className="flex-row items-center ">
       <Ionicons name="cash-outline" size={16} color="#1D4ED8" />
        <Text className="ml-2 text-sm font-semibold text-gray-700">
          Montant: <Text className="text-blue-600 font-bold">{item.price}</Text>
        </Text>
      </View>

      <View className="flex-row items-center space-x-2">
  <Ionicons name="walk-outline" size={18} color="#10B981" />
  <Text className="text-sm text-gray-700 font-semibold">
    Expérience : <Text className="text-green-600 font-bold">{item.tarif}</Text>
  </Text>
</View></View>
    </Animated.View>
  )}
/>



        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PaymentMethods')}
        >
          <Text style={styles.buttonText}>Gérer les méthodes de paiement</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#111827' },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 20, marginBottom: 10, color: '#374151' },
  historyItem: { fontSize: 16, marginVertical: 4, color: '#4b5563' },
  profileImage: {
    height: '100%',
    width: '100%',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginHorizontal: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceText: {
    fontSize: 16,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  tarifText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 12,
  marginVertical: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
},

cardRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},

cardText: {
  fontSize: 14,
  marginLeft: 6,
  color: '#374151',
},

cardSubText: {
  fontSize: 12,
  marginLeft: 6,
  color: '#9CA3AF',
},
});
