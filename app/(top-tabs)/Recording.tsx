import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { Icon, } from "react-native-paper";

const Recording = () => {

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const itemWidth = (screenWidth - 20) / 2; // Subtracting padding and dividing by 3 for three columns

  const data = [
    { id: '1', title: 'Recording 1', color: '#FF6347' },
    { id: '2', title: 'Recording 2', color: '#6A5ACD' },
    // { id: '3', title: 'Recording 3', color: '#20B2AA' },
    // { id: '4', title: 'Recording 4', color: '#FFD700' },
    // { id: '5', title: 'Recording 5', color: '#9370DB' },
    // { id: '6', title: 'Recording 6', color: '#32CD32' },
  ];

  const renderRecordingCard = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: `${item.color}33`,
          borderWidth: 1,
          borderColor: item.color,
          height: 100,
          margin: 3,
          padding: 6,
          width: itemWidth,
          paddingHorizontal: 10,
          paddingVertical: 5,
          justifyContent: "space-between",
          borderRadius: 6,
        }}>
        <Text style={{ color: "#333333", fontWeight: "600" }}>{item.title}</Text>
        <View style={{ flexDirection: 'row', justifyContent: "flex-end", marginTop: 5 }}>
          <Pressable style={{ padding: 6, backgroundColor: "#fff", borderRadius: 100, marginRight: 10 }} onPress={() => console.log("Play!")}>
            <Icon source={"play"} size={20} color="#113C6D" />
          </Pressable>
          <Pressable style={{ padding: 6, backgroundColor: "#fff", borderRadius: 100 }} onPress={() => console.log("Delete!")}>
            <Icon source={"trash-can-outline"} size={20} color="#D90000" />
          </Pressable>
        </View>
      </View>
    );
  };

  const { navigate } = useNavigation()

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      <View>
        <FlatList
          data={data}
          renderItem={renderRecordingCard}
          keyExtractor={item => item.id}
          numColumns={2}
          style={{}}
          contentContainerStyle={{
            alignItems: 'center',         // Centering the content horizontally
            paddingHorizontal: 10,        // Adjusts left and right padding
            paddingTop: 40,               // Increased top padding for spacing
            paddingBottom: 40,            // Increased bottom padding for spacing
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          alignSelf: "center",
          alignItems: "center",
          // justifyContent: "center",
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
        onPress={() => {
          navigate("RecordingScreen")
          // navigate("AudioRecorderPlayer")
        }}
      >
        <Icon source={"microphone"} size={30} color="#fff" />
      </Pressable>
      {/* <Link href={"/RecordingScreen"}>To Recording Screen</Link> */}

    </View>
  );
};

export default Recording;

const styles = StyleSheet.create({});
