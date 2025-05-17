import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import Navigation from './src/navigation';
import * as Updates from 'expo-updates';
import { I18nManager } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./global.css"
import { View, Text } from 'react-native';


export default function App() {


  return (
      <SafeAreaProvider>
        
        <Navigation />
      </SafeAreaProvider>
  );
}
