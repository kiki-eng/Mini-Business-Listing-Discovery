import * as Location from 'expo-location';

export async function getCurrentLocationString(): Promise<string> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return 'Location unavailable';
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const addresses = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    const address = addresses[0];
    if (address) {
      const parts = [address.city, address.region].filter(Boolean);
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }

    return `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
  } catch {
    return 'Location unavailable';
  }
}
