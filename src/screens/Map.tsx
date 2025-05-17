import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as Location from 'expo-location';
import {
  KeyboardAvoidingView,
  Platform,
  // ... les autres imports
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { Marker as ReanimatedMarker } from 'react-native-maps';



interface LocationType {
  latitude: number;
  longitude: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [query, setQuery] = useState<string>('');
  const [location, setLocation] = useState<LocationType>({ latitude: 36.75, longitude: 3.05 });
  const [stops, setStops] = useState<LocationType[]>([]);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const [departure, setDeparture] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<'standard' | 'premium'>('standard');
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(5);
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [isSearchingDriver, setIsSearchingDriver] = useState<boolean>(false);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [departureCoords, setDepartureCoords] = useState<{ latitude: number; longitude: number } | null>(null);
const [destinationCoords, setDestinationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
const [estimatedTime,setEstimatedTime]=useState<number>(0);
const [suggestions, setSuggestions] = useState<any[]>([]);

 const MAPBOX_TOKEN='pk.eyJ1IjoiaGFuaS1kYW91ZDciLCJhIjoiY21ha3JudmcyMDB4YzJqc2w2bnpyeHNlaSJ9.OoE3ZYbLqjrK274IW4ZgDQ';

  const driverLat = useSharedValue(36.75);
  const driverLng = useSharedValue(3.05);

  const mapRef = useRef<MapView | null>(null);

  const animatedProps = useAnimatedProps(() => ({
    coordinate: {
      latitude: driverLat.value,
      longitude: driverLng.value,
    },
  }));

  useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Accès à la localisation refusé.');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    
    setLocation(coords);
    setDepartureCoords(coords); // 👈 définir le départ automatiquement
    setDeparture('Votre position actuelle');

    mapRef.current?.animateToRegion({
      ...coords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  })();
}, []);


 const searchLocation = async (type: 'departure' | 'destination') => {
  if (type === 'destination' && query) {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&language=fr&limit=1&country=dz`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features?.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const coords = { latitude, longitude };

        setDestinationCoords(coords);
        setDestination(query);

        mapRef.current?.animateToRegion({
          ...coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        Alert.alert('Adresse non trouvée.');
      }
    } catch {
      Alert.alert('Erreur lors de la recherche.');
    }
  }
};

useEffect(() => {
  const fetchSuggestions = async () => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?autocomplete=true&language=fr&access_token=${MAPBOX_TOKEN}&country=dz&limit=5`;
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Erreur autocomplete Mapbox:', error);
    }
  };

  const timeoutId = setTimeout(fetchSuggestions, 300); // debounce
  return () => clearTimeout(timeoutId);
}, [query]);


const handleSuggestionPress = (item: any) => {
  const [longitude, latitude] = item.center;
  const coords = { latitude, longitude };

  setQuery(item.place_name); // Remplit le champ
  setDestination(item.place_name); // Enregistre pour la recherche
  setDestinationCoords(coords); // Mémorise les coordonnées
  setSuggestions([]); // Cache la liste immédiatement

  mapRef.current?.animateToRegion({
    ...coords,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
};





const getRoute = async (
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
) => {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const routeCoordinates = route.geometry.coordinates;

      // Coordonnées pour le tracé
      const coords = routeCoordinates.map(([longitude, latitude]: [number, number]) => ({
        latitude,
        longitude,
      }));
      setRouteCoords(coords);

      // 🔥 Distance en kilomètres
      const distanceInKm = route.distance / 1000;

      // 💰 Calcul du tarif selon la distance
      let perKmRate =
        distanceInKm < 30
          ? 100
          : distanceInKm <= 50
          ? 70
          : 50;

      let calculatedPrice = distanceInKm * perKmRate;
      if (calculatedPrice < 250) calculatedPrice = 250;

      if (vehicleType === 'premium') {
        calculatedPrice = calculatedPrice * 1.3;
      }

      setEstimatedPrice(Math.round(calculatedPrice));

      // 🕓 Durée estimée en minutes
      const durationInSeconds = route.duration;
      const durationInMinutes = Math.ceil(durationInSeconds / 60);
      setEstimatedTime(durationInMinutes);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l’itinéraire :", error);
  }
};

useEffect(() => {
  if (departureCoords && destinationCoords) {
    getRoute(departureCoords, destinationCoords);
  }
}, [departureCoords, destinationCoords, vehicleType]);

useEffect(() => {
  if (departureCoords && destinationCoords) {
    getRoute(departureCoords, destinationCoords);
  }
}, [departureCoords, destinationCoords]);
  

  const openDatePicker = () => setIsDatePickerVisible(true);
  const handleConfirm = (date: Date) => {
    setScheduledDate(date);
    setIsDatePickerVisible(false);
  };
  const handleCancel = () => setIsDatePickerVisible(false);
  const contactDriver = () => Alert.alert('Appel en cours...');
  const generateShareLink = () => Alert.alert('Lien partagé !');
  const toggleEmergencyMode = () => setEmergencyMode(!emergencyMode);

  const region: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

 const startDriverSearch = () => {
  setIsSearchingDriver(true);
  setTimeout(() => {
    setIsSearchingDriver(false);
    Alert.alert(
      'Conducteur trouvé !',
      'Un chauffeur est en route.',
      [
        {
          text: 'OK',
onPress: () => navigation.navigate('Profile', {
  type: vehicleType,
  trjet: estimatedTime,
  prix: estimatedPrice,
})        },
      ],
      { cancelable: false }
    );
  }, 3000);
};


  // Animation de la position du conducteur
  useEffect(() => {
    const interval = setInterval(() => {
      driverLat.value = withTiming(driverLat.value + 0.0002, { duration: 1000 });
      driverLng.value = withTiming(driverLng.value + 0.0002, { duration: 1000 });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
  <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
  style={{flex:1}}
>
  <View style={{flex:1}}>
    <MapView
      ref={mapRef}
      style={{flex:1}}
      initialRegion={{
        latitude: 36.75,
        longitude: 3.05,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {departureCoords && <Marker coordinate={departureCoords} title="Départ" />}
      {destinationCoords && <Marker coordinate={destinationCoords} title="Destination" />}
      {routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeColor="#2563eb" strokeWidth={4} />
      )}
    </MapView>

    <View className="absolute bottom-2 left-0 right-0 mx-[10px]">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="bg-gray-200 rounded-2xl p-4"
        contentContainerStyle={{ paddingBottom: 16,
          paddingTop: 0,
         }}
      >
        <Text className="text-lg font-bold mb-2">Planifier un trajet</Text>

       <View className="flex-row mb-3">
  <View className='flex flex-col flex-1'>
    <TextInput
      value={query}
      onChangeText={(text) => {
        setQuery(text);
        setDestination(text);
      }}
      placeholder="Entrez une adresse..."
      className="flex-1 bg-gray-100 px-3 py-2 rounded-xl mr-2"
    />
    
    {suggestions.length > 0 && (
  <View className="bg-white rounded-xl border border-gray-300 mt-1 max-h-24">
    <ScrollView>
      {suggestions.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSuggestionPress(item)}
          className="px-3 py-2 border-b border-gray-200"
        >
          <Text className="text-gray-700">{item.place_name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}
  </View>

  <TouchableOpacity
    onPress={() => searchLocation('destination')}
    className="bg-blue-900 px-3 py-2.5 rounded-xl max-h-12"
  >
    <Text className="text-white">Rechercher</Text>
  </TouchableOpacity>
</View>

        <View className="flex-row justify-around mb-4">
          {['standard', 'premium'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setVehicleType(type as 'standard' | 'premium')}
              className={`px-5 py-2 rounded-full border ${
                vehicleType === type
                  ? 'bg-blue-800 border-blue-600'
                  : 'bg-white border-blue-400'
              }`}
            >
              <Text
                className={`${
                  vehicleType === type ? 'text-white' : 'text-blue-600'
                } font-semibold`}
              >
                {type === 'standard' ? 'Standard' : 'Premium'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-4">
          <Text className="text-center text-xl font-semibold text-gray-800">
            Prix estimé : <Text className="text-primary font-extrabold"> {estimatedPrice} DA</Text>
          </Text>
          <Text className="text-center text-sm text-gray-600 mt-1">
            Temps estimé : <Text className="font-medium">{estimatedTime} min</Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsScheduled(!isScheduled)}
          className={`py-3 rounded-full mb-4 ${
            isScheduled ? 'bg-amber-500' : 'bg-green-800'
          }`}
        >
          <Text className="text-white text-center font-medium text-base">
            {isScheduled ? 'Planifiée' : 'Réservation immédiate'}
          </Text>
        </TouchableOpacity>

        {isScheduled && (
          <>
            <TouchableOpacity
              onPress={openDatePicker}
              className="bg-gray-100 py-3 rounded-xl mb-4"
            >
              <Text className="text-center text-gray-700">
                Date : {scheduledDate.toLocaleString()}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              date={scheduledDate}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          </>
        )}

        <View className="flex-row justify-between space-x-2 mb-4">
          <TouchableOpacity className="flex-1 bg-blue-800 p-3 rounded-xl" onPress={contactDriver}>
            <Text className="text-white text-center font-medium">Contacter</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 mx-2 bg-blue-800 p-3 rounded-xl" onPress={generateShareLink}>
            <Text className="text-white text-center font-medium">Partager</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-red-800 p-3 rounded-xl" onPress={toggleEmergencyMode}>
            <Text className="text-white text-center font-medium">
              {emergencyMode ? 'Urgence Off' : 'Urgence'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={startDriverSearch}
          className="bg-blue-800 py-3 rounded-full"
        >
          {isSearchingDriver ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold">
              Rechercher un conducteur
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  </View>
</KeyboardAvoidingView>





  );
};

export default MapScreen;
