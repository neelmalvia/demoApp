import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const Layout = () => {
  return (
    <MaterialTopTabs
      initialRouteName="Recording"
      screenOptions={{
        tabBarStyle: {},
        tabBarIndicatorStyle: { backgroundColor: "#143c6d", width: "30%", marginLeft: '10%', },
        tabBarIndicatorContainerStyle: {},
        tabBarInactiveTintColor: "grey",
        tabBarActiveTintColor: "#143c6d",
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        tabBarAndroidRipple: { color: 'transparent' }
      }}
    >
      <MaterialTopTabs.Screen name="Recording" options={{ title: "Recording" }} />
      <MaterialTopTabs.Screen name="Employee" options={{ title: "Employee" }} />
      <MaterialTopTabs.Screen name="AudioRecorderPlayerScreen" options={{ title: "Audio Recorder" }} />
    </MaterialTopTabs>
  );
};

export default Layout;

const styles = StyleSheet.create({});


// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { Tabs } from 'expo-router';

// const _layout = () => {
//   return (
//     <Tabs>
//       <Tabs.Screen name="Recording" options={{}} />
//       <Tabs.Screen name="Employee" options={{}} />
//     </Tabs>
//   )
// }

// export default _layout

// const styles = StyleSheet.create({})