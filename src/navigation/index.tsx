import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/Login'
import HomeScreen from '../screens/Home'
import OTPScreen from  '../screens/OTP'
import PaymentMethodsScreen from  '../screens/paiments'
import { RootStackParamList } from './types'; // adapte le chemin
import Map from '../screens/Map'
import Profile from '../screens/profile'

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="Home" component={HomeScreen}   options={{ headerShown: false }} />
        <Stack.Screen name="OTP" component={OTPScreen} options={{ headerShown: false }}/>
<Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ headerShown: false }}/>
<Stack.Screen
  name="Map"
  component={Map}
  options={{ headerShown: false }}
  initialParams={{ place: { place_name: '', center: [0, 0], id: '' } }} // Valeurs par défaut si nécessaire
/>
<Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}
