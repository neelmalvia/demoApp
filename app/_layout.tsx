import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Icon } from 'react-native-paper'
import { store } from './redux/store'
import { Provider as ReduxProvider } from 'react-redux'
import Layout from './(top-tabs)/_layout'


const _layout = () => {

  return (
    <ReduxProvider store={store}>
      <Stack
        initialRouteName='(top-tabs)'
        screenOptions={{
          statusBarColor: Platform.OS === "android" ? "#143c6d" : undefined,
          statusBarStyle: Platform.OS === "android" ? 'light' : undefined,
          headerStyle: { backgroundColor: '#143c6d' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
        <Stack.Screen name='(top-tabs)'
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
          }}
        />
        <Stack.Screen name='RecordingScreen' options={{ headerTitle: 'Recording Screen' }} />
        <Stack.Screen name='AudioRecorderPlayer' options={{ headerTitle: 'Audio Recording Screen' }} />
      </Stack>
      {/* <Layout /> */}

    </ReduxProvider>
  )
}

export default _layout

const styles = StyleSheet.create({})