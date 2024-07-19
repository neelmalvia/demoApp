import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { Icon, } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { useIsFocused } from "@react-navigation/native";

const Recording = () => {
  const { navigate } = useNavigation()
  const focusedScreen = useIsFocused()

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 20) / 2; // Subtracting padding and dividing by 3 for three columns
  const [allRecordings, setAllRecordings] = useState([])

  console.log("-----------> ", allRecordings.length);

  useEffect(() => {
    const getRecordings = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('recordings');
        if (jsonValue !== null) {
          const parsedValue = JSON.parse(jsonValue);
          setAllRecordings(parsedValue);
          // console.log("VALUE:: ", parsedValue);
        } else {
          setAllRecordings([]);
          //console.log('No recordings found.');
        }
      } catch (e) {
        // Error handling
        console.error('Failed to fetch recordings:', e);
        setAllRecordings([]);
      }
    }
    getRecordings()
  }, [focusedScreen])

  useEffect(() => {
    console.log("ALL Recordings: ", allRecordings.length);
  }, [focusedScreen]);

  useEffect(() => {
    const initializeAudioObjects = async () => {
      const audioPromises = allRecordings.map(async (item) => {
        const { sound } = await Audio.Sound.createAsync({ uri: item?.file });
        item.sound = sound;
      });
      await Promise.all(audioPromises);
      setAllRecordings(allRecordings);
    };
    initializeAudioObjects();
  }, [allRecordings]);

  const handlePlay = async (item: any) => {
    if (item.sound) {
      try {
        await item?.sound?.replayAsync();
        //console.log('Playback started for', item.name);
      }
      catch (err) {
        //console.log(err);
      }
    }
  };

  const deleteRecording = async (recordingId) => {
    try {
      let recordings = await AsyncStorage.getItem('recordings');
      recordings = recordings ? JSON.parse(recordings) : [];

      const index = recordings?.findIndex(recording => recording.id === recordingId);
      if (index !== -1) {
        recordings?.splice(index, 1);

        await AsyncStorage.setItem('recordings', JSON.stringify(recordings));
        //console.log('Recording deleted successfully.');

        setAllRecordings(recordings);
      }
    } catch (e) {
      console.error('Failed to delete recording:', e);
    }
  }

  const renderRecordingCard = ({ item, index }: any) => {
    //console.log('thisss', item);
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
        <Text style={{ color: "#333333", fontWeight: "600" }}>{item.name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: "flex-end", marginTop: 5 }}>
          <Pressable style={{ padding: 6, backgroundColor: "#fff", borderRadius: 100, marginRight: 10 }} onPress={() => {
            //console.log("Play!!");
            // item?.sound?.replayAsync()
            handlePlay(item)
            //console.log('payyyyyy ', item?.sound);
          }}>
            <Icon source={"play"} size={20} color="#113C6D" />
          </Pressable>
          <Pressable
            style={{ padding: 6, backgroundColor: "#fff", borderRadius: 100 }}
            onPress={() => {
              //console.log("Delete!")
              deleteRecording(item.id);
            }}>
            <Icon source={"trash-can-outline"} size={20} color="#D90000" />
          </Pressable>
        </View>
      </View >
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {(allRecordings.length > 0 ?
        <View style={{}}>
          <FlatList
            data={allRecordings}
            renderItem={renderRecordingCard}
            keyExtractor={(item, i) => i.toString()}
            numColumns={2}
            style={{}}
            contentContainerStyle={{
              alignItems: 'flex-start',
              alignSelf: "center",
              paddingHorizontal: 10,
              paddingTop: 40,
              paddingBottom: 40,
            }}
          />
        </View>
        :
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
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
              fontWeight: '700',
              color: "#113C6D",
              marginBottom: 6,
            }}
          >
            No Recording Found!!
          </Text>
          <Text style={{ textAlign: "center" }}>
            There's nothing here yet. Hit the record button to capture something amazing!
          </Text>
        </View>
      )}

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
