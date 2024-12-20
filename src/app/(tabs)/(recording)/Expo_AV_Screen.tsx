import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { Audio } from "expo-av";
import { Icon } from "react-native-paper";
import RNFS from 'react-native-fs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

const Expo_AV_Screen = () => {
  const [recording, setRecording] = useState<any>(null);
  const [savedRecordings, setSavedRecordings] = useState<any>([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [recordingName, setRecordingName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#FF6347");

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [counterInterval, setCounterInterval] = useState<any>(null); // Store interval ID

  const { navigate } = useNavigation()

  console.log("Recording stopped and stored at: ", recording);
  console.log("ALL SAVED: ", savedRecordings);

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");

      // Start counter
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          let newSeconds = prevSeconds + 1;
          if (newSeconds === 60) {
            setSeconds(0);
            setMinutes((prevMinutes) => {
              let newMinutes = prevMinutes + 1;
              if (newMinutes === 60) {
                setMinutes(0);
                setHours((prevHours) => prevHours + 1);
              }
              return newMinutes;
            });
          }
          return newSeconds;
        });
      }, 1000); // Update counter every second

      setCounterInterval(intervalId);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    // setRecording(undefined);

    // Clear counter interval
    if (counterInterval) {
      clearInterval(counterInterval);
      setCounterInterval(null);
    }

    // Reset timer
    setHours(0);
    setMinutes(0);
    setSeconds(0);

    // Open Modal
    // setModalVisible(true);

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    // const uri = recording.getURI();
    // console.log("URI: " + uri);

    // const { sound, status } = await recording.createNewLoadedSoundAsync();

    // let allRecordings = [...savedRecordings];
    // allRecordings.push({
    //   name: "",
    //   color: "",
    //   sound: sound,
    //   duration: await getDuratuionFormatted(status.durationMillis),
    //   file: recording.getURI(),
    // });
    // setSavedRecordings(allRecordings);
  }

  // const saveRecordingsToLocal = async (savedFiles: any[]) => {
  //   try {
  //     const jsonValue = JSON.stringify(savedFiles);
  //     await AsyncStorage.setItem('recordings', jsonValue);
  //     console.log('Recordings saved successfully!', jsonValue);
  //   } catch (e) {
  //     console.error('Failed to save recordings:', e);
  //   }
  // };

  const saveRecordingsToLocal = async (savedFiles: any[]) => {
    try {
      const jsonValue = await AsyncStorage.getItem('recordings');
      let existingRecordings: any[] = [];

      if (jsonValue !== null) {
        existingRecordings = JSON.parse(jsonValue);
      }
      const updatedRecordings = [...existingRecordings, ...savedFiles];

      const updatedJsonValue = JSON.stringify(updatedRecordings);
      await AsyncStorage.setItem('recordings', updatedJsonValue);

      // console.log('Recordings saved successfully!', updatedJsonValue);
    } catch (e) {
      console.error('Failed to save recordings:', e);
    }
  };

  const addRecordings = async (name: string, color: string) => {
    const uri = recording.getURI();
    console.log("URI: " + uri);

    const { sound, status } = await recording.createNewLoadedSoundAsync();

    // const sourcePath = RNFS?.MainBundlePath + `/assets/${name}.mp4`;  // Adjust the path as per your project structure
    // const sourcePath = recording?.getURI()
    // const destPath = RNFS?.DocumentDirectoryPath + `/Recordings/${name}.mp4`;

    // try {
    //   await RNFS?.copyFile(sourcePath, destPath);
    //   console.log('File copied successfully.');
    // } catch (error) {
    //   console.error('Failed to copy file:', error);
    // }

    let allRecordings = [...savedRecordings];
    allRecordings.push({
      // data: recording,
      name,
      color,
      sound: sound,
      duration: await getDuratuionFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    setSavedRecordings(allRecordings);
    // console.log('savedRecordings', [...savedRecordings])
    saveRecordingsToLocal(allRecordings);
    setRecording(undefined);
  }

  async function getDuratuionFormatted(milliseconds: any) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  }

  function clearRecordings() {
    setSavedRecordings([]);
    // AsyncStorage.removeItem('savedRecordings');
  }

  const Card = ({ color }: any) => (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.cardText}>{color}</Text>
    </View>
  );

  return (
    <View style={[styles.container, {}]}>
      {/* <ScrollView>
        <Text>recording - {JSON.stringify(recording)}</Text>
        <Text>savedRecordings - {JSON.stringify(savedRecordings)}</Text>
      </ScrollView> */}

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          alignSelf: "center",
        }
        }
      >
        <Image
          source={require("../../../assets/images/Recording.png")}
          style={{ marginBottom: 6 }}
        />

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 60, fontWeight: "bold", color: "#AAAAAA" }}>
            {`${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "80%",
            justifyContent: "space-between",
          }}
        >
          {/* <Button
            title={"PopUp"}
            onPress={() => { setModalVisible(true) }}
          /> */}

          {savedRecordings?.length > 0 && (
            <View style={{}}>
              <Button title={"Clear Recordings"} onPress={clearRecordings} />
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={{
          marginBottom: 80,
          marginVertical: 10,
          // elevation: 3,
          borderWidth: 1,
          borderColor: `${"#113C6D"}33`,
          backgroundColor: "#fff",
          paddingHorizontal: 20,
          borderRadius: 10,
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        {savedRecordings.length > 0 ? (
          savedRecordings.map((item: any, index: number) => {
            // console.log('---->', item)
            return (
              <View key={index} style={{ marginVertical: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text>Recording #{index + 1} | {item.duration}</Text>
                  <Text>Name: {item.name} | Color: {item.color}</Text>
                </View>
                <Button
                  onPress={() => {
                    item.sound.replayAsync();
                  }}
                  title="Play"
                />
              </View>
            )
          })
        ) : (
          <Text style={{ textAlign: "center" }}>No recordings yet.</Text>
        )}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 10,
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
          width: "70%",
          justifyContent: "space-evenly",
        }}
      >
        <Icon source={"close"} size={34} color={recording ? "grey" : "green"} />
        {/* <Pressable onPress={recording ? stopRecording : startRecording}> */}
        <Pressable
          onPress={() => {
            if (recording) {
              setModalVisible(true);
              stopRecording();
            } else {
              startRecording();
            }
          }}
        >
          <Icon
            source={recording ? "square-rounded" : "checkbox-blank-circle"}
            size={74}
            color="red"
          />
        </Pressable>
        <Icon source={"check"} size={34} color={recording ? "grey" : "red"} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <KeyboardAvoidingView
          behavior="padding"
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Save Recording</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                value={recordingName}
                onChangeText={(text) => setRecordingName(text)}
              />
              <View style={{ alignSelf: "flex-start", marginBottom: 20 }}>
                <Text
                  style={{
                    color: "#333333",
                    fontWeight: "600",
                    marginBottom: 10,
                  }}
                >
                  Select Card Color
                </Text>
                <View style={styles.cardContainer}>
                  {[
                    "#FF6347",
                    "#6A5ACD",
                    "#20B2AA",
                    "#FFD700",
                    "#9370DB",
                    "#32CD32",
                  ].map((color, index) => (
                    <Pressable
                      key={index}
                      style={[styles.card, { backgroundColor: color }]}
                      onPress={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && (
                        <Icon source="check" size={20} color="#FFFFFF" />
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>
              <Pressable
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  backgroundColor: "#113C6D",
                }}
                onPress={() => {
                  if (recordingName == "") {
                    Alert.alert("Please give a name!")
                  } else if (selectedColor == "") {
                    Alert.alert("Please select a color!")
                  } else {
                    // handleSaveRecording()
                    // stopRecording();
                    addRecordings(recordingName, selectedColor);
                    setRecordingName("");
                    // setSelectedColor("")
                    // navigate("Recording")
                    setModalVisible(!modalVisible);
                  }
                }}
              >
                <Text style={{ color: "#fff", fontWeight: 600 }}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View >
  );
};

export default Expo_AV_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 40,
  },
  fill: {
    flex: 1,
    margin: 15,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "#DDDDDD",
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});


// import React from 'react';
// import { StyleSheet, Text, View, Button } from 'react-native';
// import { Audio } from 'expo-av';

// const Expo_AV_Screen = () => {
//   const [recording, setRecording] = React.useState<any>();
//   const [recordings, setRecordings] = React.useState<any>([]);

//   async function startRecording() {
//     try {
//       const perm = await Audio.requestPermissionsAsync();
//       if (perm.status === "granted") {
//         await Audio.setAudioModeAsync({
//           allowsRecordingIOS: true,
//           playsInSilentModeIOS: true
//         });
//         const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//         setRecording(recording);
//       }
//     } catch (err) { }
//   }

//   async function stopRecording() {
//     setRecording(undefined);

//     await recording.stopAndUnloadAsync();
//     let allRecordings = [...recordings];
//     const { sound, status } = await recording.createNewLoadedSoundAsync();
//     allRecordings.push({
//       sound: sound,
//       duration: getDurationFormatted(status.durationMillis),
//       file: recording.getURI()
//     });

//     setRecordings(allRecordings);
//   }

//   function getDurationFormatted(milliseconds) {
//     const minutes = milliseconds / 1000 / 60;
//     const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
//     return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
//   }

//   function getRecordingLines() {
//     return recordings.map((recordingLine, index) => {
//       return (
//         <View key={index} style={styles.row}>
//           <Text style={styles.fill}>
//             Recording #{index + 1} | {recordingLine.duration}
//           </Text>
//           <Button onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
//         </View>
//       );
//     });
//   }

//   function clearRecordings() {
//     setRecordings([])
//   }

//   return (
//     <View style={styles.container}>
//       <Button title={recording ? 'Stop Recording' : 'Start Recording\n\n\n'} onPress={recording ? stopRecording : startRecording} />
//       {getRecordingLines()}
//       <Button title={recordings.length > 0 ? '\n\n\nClear Recordings' : ''} onPress={clearRecordings} />
//     </View>
//   );
// }

// export default Expo_AV_Screen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 10,
//     marginRight: 40
//   },
//   fill: {
//     flex: 1,
//     margin: 15
//   }
// });
