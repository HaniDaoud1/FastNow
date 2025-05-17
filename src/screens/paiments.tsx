import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';

const paymentMethods = [
  {
    id: '1',
    type: 'Visa',
    last4: '1234',
    holder: 'Ali Menaa',
    expiry: '12/26',
  },
  {
    id: '2',
    type: 'Mastercard',
    last4: '5678',
    holder: 'Ali Menaa',
    expiry: '08/25',
  },
  {
    id: '3',
    type: 'CIB',
    last4: '9012',
    holder: 'Ali Menaa',
    expiry: '01/27',
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'Visa':
      return require('../../assets/visa.png'); // ajoute une image visa dans assets
    case 'Mastercard':
      return require('../../assets/mastercard.png'); // idem
      case 'CIB':
      return require('../../assets/CIB.png'); // idem
    
  }
};

export default function PaymentMethodsScreen() {
  const handleDelete = (id: string) => {
    Alert.alert('Suppression', 'Voulez-vous supprimer cette carte ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', onPress: () => console.log(`Carte ${id} supprimée`) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Méthodes de paiement</Text>

        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <View style={styles.iconContainer}>
                  <Image
  source={getIcon(item.type)}
  style={{ width: 40, height: 24, resizeMode: 'contain' }}
/>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardType}>{item.type}</Text>
                  <Text style={styles.cardDetails}>
                    **** **** **** {item.last4}
                  </Text>
                  <Text style={styles.cardSub}>
                    Titulaire: <Text style={styles.cardSubText}>{item.holder}</Text>
                  </Text>
                  <Text style={styles.cardSub}>
                    Expire: <Text style={styles.cardSubText}>{item.expiry}</Text>
                  </Text>
                </View>
              </View>

              <TouchableOpacity className='mt-6' onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Ajouter une carte</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  cardDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cardSubText: {
    color: '#111827',
    fontWeight: '600',
  },
  addButton: {
    marginTop: 30,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
