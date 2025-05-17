// src/screens/PhoneLoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Courgette_400Regular } from '@expo-google-fonts/courgette'; // Importation de la police
import { useFonts } from 'expo-font'; // Chargement des polices
import Animated, { FadeInUp ,FadeInDown} from 'react-native-reanimated';

export default function LoginScreen() {

    type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

  const [phone, setPhone] = useState('');
  const navigation = useNavigation<NavigationProps>();

  const [fontsLoaded] = useFonts({
    Courgette_400Regular,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const handleNext = () => {
    if (phone.length >= 8) {
      navigation.navigate('OTP', { phone });
    } else {
      alert('Numéro invalide');
    }
  };

  return (
<Animated.View
  entering={FadeInUp.duration(800)}
  className="flex-1 px-6 bg-gray-50 "
>
  {/* Logo / Titre */}
  <Animated.View
  entering={FadeInDown.duration(800).springify()}
  className="mb-16 mt-32"
>
  <Text
    className="text-6xl text-center text-gray-800"
    style={{
      fontFamily: 'Courgette_400Regular',
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 1, height: 2 },
      textShadowRadius: 4,
      color: '#1E3A8A', // bleu foncé doux (tailwind: blue-900)
    }}
  >
    Fast Now
  </Text>
</Animated.View>

  {/* Description */}
  <Text className="text-center text-base text-gray-600 mb-10 px-2">
    Pour sécuriser votre connexion, un code de vérification vous sera envoyé par SMS après avoir entré votre numéro de téléphone.
  </Text>

  {/* Label */}
  <Text className="text-lg font-medium text-gray-700 mb-2">
    Numéro de téléphone
  </Text>

  {/* Input */}
  <TextInput
    className="w-full px-4 py-3 mb-8 text-base bg-white border border-gray-300 rounded-xl shadow-md focus:border-green-500"
    keyboardType="phone-pad"
    value={phone}
    onChangeText={setPhone}
    placeholder="Ex: 0555123456"
    placeholderTextColor="#aaa"
  />

  {/* Button animé */}
  <Animated.View entering={FadeInUp.delay(300).duration(600)}>
    <TouchableOpacity
      onPress={handleNext}
      activeOpacity={0.85}
      className="bg-green-600 rounded-xl py-4 shadow-lg"
    >
      <Text className="text-white text-center text-lg font-semibold tracking-wide">
        Suivant
      </Text>
    </TouchableOpacity>
  </Animated.View>
    <View className="absolute top-10 w-full px-4">
          
        </View>
        
</Animated.View>


  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { borderWidth: 2, marginVertical: 10, padding: 10, borderRadius: 5 },
});
