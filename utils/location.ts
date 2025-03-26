import { getDistance } from 'geolib';

export function verifyLocation(
  userLocation: { latitude: number; longitude: number },
  targetLocation: { latitude: number; longitude: number; radius: number }
) {
  const distance = getDistance(
    { latitude: userLocation.latitude, longitude: userLocation.longitude },
    { latitude: targetLocation.latitude, longitude: targetLocation.longitude }
  );

  return distance <= targetLocation.radius;
}