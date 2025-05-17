import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function OTPScreen({ route }: any) {
  type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'OTP'>;

  const [otp, setOtp] = useState('');
  const navigation = useNavigation<NavigationProps>();
  const phone = route.params?.phone;

  const handleVerify = () => {
    if (otp === '1234') {
      navigation.navigate('Home',{phone});
    } else {
      alert('Code OTP invalide. Veuillez réessayer.');
    }
  };

  return (
    <Animated.View
      className="flex-1  px-6 bg-gray-100"
      entering={FadeInUp.duration(600)}
    >
      <Text className="text-2xl mt-48 font-semibold text-gray-800 mb-6 text-center">
        Vérification par SMS
      </Text>

      <Text className="text-center text-base text-gray-600 mb-8">
        Un code de vérification a été envoyé à :
        {'\n'}
        <Text className="font-bold">{phone}</Text>
      </Text>

      <TextInput
        className="w-full px-4 py-3 mb-6 text-lg bg-white border border-gray-300 rounded-lg shadow-sm text-center"
        keyboardType="number-pad"
        maxLength={4}
        value={otp}
        onChangeText={setOtp}
        placeholder="Entrez le code OTP (1234)"
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        onPress={handleVerify}
        className="bg-green-500 rounded-lg py-4"
        activeOpacity={0.85}
      >
        <Text className="text-white text-center text-lg font-semibold">Vérifier</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
