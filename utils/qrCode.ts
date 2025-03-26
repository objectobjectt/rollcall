export function generateQRCode() {
  const data = {
    sessionId: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    coordinates: {
      latitude: 0, // Replace with actual coordinates
      longitude: 0,
      radius: 50, // 50 meters radius
    },
  };

  return JSON.stringify(data);
}