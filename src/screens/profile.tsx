import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

const DriverProfileScreen = ({ route }: { route: ProfileScreenRouteProp }) => {
  const { type, trjet, prix } = route.params;

  const [tip, setTip] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitFeedback = () => {
    Alert.alert('Merci !', 'Votre avis a été enregistré.');
    setRating(0);
    setComment('');
  };

  const sendTip = () => {
    Alert.alert('Merci pour le pourboire', `${tip} DA envoyés au conducteur.`);
    setTip('');
  };

  // Infos conditionnelles selon le type
  const driverName = type === 'standard' ? 'Nabil Z.' : 'Kamel B.';
  const driverNote = type === 'standard' ? 4.3 : 4.7;
  const vehicleImage =
    type === 'standard'
      ? 'https://mediacloud.carbuyer.co.uk/image/private/s---Udbb08F--/v1579646868/carbuyer/2019/06/hyundai_i10_play_front_driving.jpg' // Voiture simple
      : 'https://th.bing.com/th/id/R.6f72e9bd4aa28de07ba57d1dc15df53b?rik=ywacda5FAfoFVA&pid=ImgRaw&r=0';
  const vehicleModel = type === 'standard' ? 'Hyundai i10' : 'Mercedes Classe C';
  const vehicleColor = type === 'standard' ? 'Gris' : 'Noir';
  const vehiclePlate = type === 'standard' ? '1212-150-16' : '1234-115-16';

  return (
    <SafeAreaView className="flex-1 bg-gray-200 p-5">
      <ScrollView>

       

        {/* Infos conducteur */}
        <View className="flex flex-row  justify-between p-2 mx-4 mt-5 items-center">
          <Image
            source={{
              uri:
                type === 'standard'
                  ? 'https://wallpapercrafter.com/desktop7/1789886-photo-4k-Domhnall-Gleeson-portrait-headshot-one.jpg'
                  : 'https://media.licdn.com/dms/image/D4E03AQGZfW843KKNIA/profile-displayphoto-shrink_800_800/0/1676809168792?e=2147483647&v=beta&t=WQ0hslM5CSTyToMTlAIrNO6vVQMFgDrOmsNCv7OIy58',
            }}
            className="w-36 h-36 rounded-full border-4 border-white shadow"
          />
          <View className="ml-4">
            <Text className="text-2xl font-semibold text-gray-800">{driverName}</Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-base text-gray-700 mr-1">Note :</Text>
              <Text className="text-yellow-500 text-base">⭐</Text>
              <Text className="text-base text-gray-700 ml-1">
                <Text className="font-bold">{driverNote}</Text> / 5
              </Text>
            </View>
            <Text className="text-sm text-gray-500 mt-1">
              Courses réalisées :{' '}
              <Text className="font-medium text-gray-700">{type === 'standard' ? '210' : '320'}</Text>
            </Text>
          </View>
        </View>

 {/* Prix & Trajet */}
        <View className=" rounded-2xl  mt-2 ">
          <Text className="text-center text-xl font-semibold text-gray-800 mb-1">
            🚗 Tepms éstimer : <Text className="font-medium text-gray-700">{trjet} mn</Text>
          </Text>
          <Text className="text-center text-lg text-gray-700 mt-1">
            Prix estimé : <Text className="font-bold">{prix} DA</Text>
          </Text>
        </View>

        {/* Infos véhicule */}
        <View className="mb-4 mt-2">
          <Text className="text-lg font-semibold mb-2 text-gray-800">🚘 Véhicule</Text>
          <Image
            source={{ uri: vehicleImage }}
            className="w-full h-44 rounded-xl mb-2"
          />
          <Text className="text-sm text-gray-700">Modèle : {vehicleModel}</Text>
          <Text className="text-sm text-gray-700">Couleur : {vehicleColor}</Text>
          <Text className="text-sm text-gray-700">Immatriculation : {vehiclePlate}</Text>
        </View>

 {/* Bouton de confirmation */}
        <View className="mb-5 mt-1 px-4">
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Course confirmée', 'Votre course est en cours de traitement.')
            }
            className="bg-indigo-600 py-3 rounded-xl shadow active:opacity-90"
          >
            <Text className="text-white text-center font-bold text-base">
              ✅ Confirmer la course
            </Text>
          </TouchableOpacity>
        </View>
        {/* Pourboire */}
        <View className="bg-gray-100 rounded-2xl shadow-md p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">💰 Lui laisser un pourboire</Text>
          <TextInput
            value={tip}
            onChangeText={setTip}
            placeholder="Montant en DA"
            keyboardType="numeric"
            className="border border-gray-300 rounded-xl p-3 text-base mb-4"
          />
          <TouchableOpacity onPress={sendTip} className="bg-green-500 py-3 rounded-xl shadow-sm active:opacity-90">
            <Text className="text-white text-center font-bold text-base">Envoyer le pourboire</Text>
          </TouchableOpacity>
        </View>

        {/* Évaluation du conducteur */}
        <View className="bg-gray-100 rounded-2xl shadow-md p-6 mb-10">
          <Text className="text-lg font-semibold text-gray-800 mb-4">⭐ Noter le conducteur</Text>
          <View className="flex-row justify-center mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setRating(n)} activeOpacity={0.7}>
                <Text className={`text-4xl mx-1 ${n <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Votre commentaire"
            multiline
            className="border border-gray-300 rounded-xl p-3 text-base h-16 mb-4"
          />
          <TouchableOpacity onPress={submitFeedback} className="bg-blue-600 py-3 rounded-xl shadow-sm active:opacity-90">
            <Text className="text-white text-center font-bold text-base">Envoyer l'évaluation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverProfileScreen;
