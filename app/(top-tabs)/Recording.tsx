import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { Icon, } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { Audio } from "expo-av";

const Recording = () => {
  const { navigate } = useNavigation()

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const itemWidth = (screenWidth - 20) / 2; // Subtracting padding and dividing by 3 for three columns
  const [allRecordings, setAllRecordings] = useState([])
  const ifFocused = useIsFocused()

  // useEffect(() => {
  //   getRecordings()
  // }, [ifFocused])

  // useFocusEffect(
  //   useCallback(() => {
  //     getRecordings()
  //   }, [])
  // )

  useEffect(() => {
    console.log("ALL Recordings: ", allRecordings.length);
    // getRecordings()
  }, [])

  useFocusEffect(() => {
    getRecordings()
  })

  useEffect(() => {
    // Simulate loading or initialization of audio objects
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

  const getRecordings = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('recordings');
      if (jsonValue !== null) {
        // AsyncStorage has a valid value
        const parsedValue = JSON.parse(jsonValue);
        setAllRecordings(parsedValue);
        //console.log("VALUE:: ", parsedValue);
      } else {
        // AsyncStorage returned null (key not found)
        setAllRecordings([]);
        //console.log('No recordings found.');
      }
    } catch (e) {
      // Error handling
      console.error('Failed to fetch recordings:', e);
      setAllRecordings([]);
    }
  };

  // const deleteRecording = async () => {
  //   try {
  //     // Get the current recordings from AsyncStorage
  //     let recordings = await AsyncStorage.getItem('recordings');
  //     recordings = recordings ? JSON.parse(recordings) : [];

  //     // Logic to delete all recordings
  //     await AsyncStorage.removeItem('recordings');
  //     setPrevRecordings([]); // Clear state to update UI
  //     //console.log('Recordings deleted successfully.');
  //   } catch (e) {
  //     console.error('Failed to delete recordings:', e);
  //   }
  // }

  const deleteRecording = async (recordingId) => {
    try {
      // Get the current recordings from AsyncStorage
      let recordings = await AsyncStorage.getItem('recordings');
      recordings = recordings ? JSON.parse(recordings) : [];

      // Find the index of the recording with the given ID
      const index = recordings?.findIndex(recording => recording.id === recordingId);
      if (index !== -1) {
        // Remove the recording from the array
        recordings?.splice(index, 1);

        // Update AsyncStorage with the modified recordings array
        await AsyncStorage.setItem('recordings', JSON.stringify(recordings));
        //console.log('Recording deleted successfully.');

        // Update state to trigger UI update
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
          width: (Dimensions.get('window').width - 20) / 2,
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
        <View>
          <FlatList
            data={allRecordings}
            renderItem={renderRecordingCard}
            keyExtractor={(item, i) => i.toString()}
            numColumns={2}
            style={{}}
            contentContainerStyle={{
              alignItems: 'center',
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
