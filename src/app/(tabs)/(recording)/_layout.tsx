import { Stack } from 'expo-router';

export default function RecordingLayout() {
  return (
    <Stack
      screenOptions={{
        // headerShown: false,
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Recording" />
      <Stack.Screen name="Expo_AV_Screen" />
      <Stack.Screen name="AudioRecorderPlayerScreen" />
      {/* <Stack.Screen name="ExpoAudio" /> */}
    </Stack>
  );
}
