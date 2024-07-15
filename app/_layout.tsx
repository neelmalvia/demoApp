import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{
      statusBarColor: Platform.OS === "android" ? "#143c6d" : undefined,
      statusBarStyle: Platform.OS === "android" ? 'light' : undefined,
      headerStyle: { backgroundColor: '#143c6d' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen name='(tabs)' options={{ headerTitle: "My Recordings" }} />
      <Stack.Screen name='RecordingScreen' options={{ headerBackTitle: "Back", headerTitle: 'Recording' }} />
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})