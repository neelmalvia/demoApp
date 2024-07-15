import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button, Icon, IconButton } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

const Recording = () => {
  const { navigate } = useNavigation()
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      <View
        style={{
          flex: 1,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          width: "80%",
        }}
      >
        <Image
          source={require("../../assets/images/Search.png")}
          style={{ marginBottom: 6 }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#113C6D",
            marginBottom: 6,
          }}
        >
          No Recoding Found!!
        </Text>
        <Text style={{ textAlign: "center" }}>
          There's nothing here yet. Hit the record button to capture something
          amazing!
        </Text>
      </View>


      <Pressable
        style={{
          position: "absolute",
          bottom: 40,
          right: 20,
          elevation: 5,
          backgroundColor: "#143c6d",
          width: 60,
          height: 60,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => navigate("RecordingScreen")}
      >
        <Icon source={"microphone"} size={30} color="#fff" />
      </Pressable>
      {/* <Link href={"/RecordingScreen"}>To Recording Screen</Link> */}

    </View>
  );
};

export default Recording;

const styles = StyleSheet.create({});
