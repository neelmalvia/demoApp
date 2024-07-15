import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Icon, IconButton } from 'react-native-paper'

const _layout = () => {
  return (
    <Stack screenOptions={{
      statusBarColor: Platform.OS === "android" ? "#143c6d" : undefined,
      statusBarStyle: Platform.OS === "android" ? 'light' : undefined,
      headerStyle: { backgroundColor: '#143c6d' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen name='(tabs)'
        options={{
          headerTitle: "My Recordings",
          headerLeft: () => (
            <View style={{ marginRight: Platform.OS == "android" ? 10 : 0 }}>
              <Icon
                source={"menu"}
                size={28}
                color='#fff'
              />
            </View>
          )
        }} />
      <Stack.Screen name='RecordingScreen' options={{ headerTitle: 'Recording' }} />
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})