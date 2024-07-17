import { Alert, Button, Image, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Audio } from "expo-av";
import { Icon } from "react-native-paper";

const RecordingScreen = () => {
  const [recording, setRecording] = useState<any>(null);
  const [recordings, setRecordings] = useState<any>([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF6347');

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [counterInterval, setCounterInterval] = useState<any>(null); // Store interval ID

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      console.log('Recording started');

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
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);

    // Clear counter interval
    if (counterInterval) {
      clearInterval(counterInterval);
      setCounterInterval(null);
    }

    // Reset timer
    setHours(0);
    setMinutes(0);
    setSeconds(0);

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    console.log('URI: ' + uri);

    const { sound, status } = await recording.createNewLoadedSoundAsync();

    let allRecordings = [...recordings];
    allRecordings.push({
      sound: sound,
      duration: await getDuratuionFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    setRecordings(allRecordings);
    console.log('Recording stopped and stored at', recordings);

    // setModalVisible(true);

  }

  async function getDuratuionFormatted(milliseconds: any) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine: any, index: any) => (
      <View key={index} style={{ marginVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <Text>
          Recording #{index + 1} | {recordingLine.duration}
          {/* {recordingLine.name} | Recording #{index + 1} | {recordingLine.duration} */}
        </Text>
        <Button
          onPress={() => {
            recordingLine.sound.replayAsync();
          }}
          title="Play"
        />
      </View>
    ));
  }

  function clearRecordings() {
    setRecordings([]);
  }

  const handleSaveRecording = async () => {
    if (!recording) {
      console.error('No recording to save');
      return;
    }

    try {
      const status = await recording.getStatusAsync(); // Ensure to use getStatusAsync() to await for the status
      const savedRecording = {
        sound: recording,
        duration: getDuratuionFormatted(status.durationMillis),
        file: recording.getURI(),
        name: recordingName,
        color: selectedColor,
      };

      let allRecordings = [...recordings];
      allRecordings.push(savedRecording);
      setRecordings(allRecordings);

      // setModalVisible(false);
      // setRecordingName('');
    } catch (error) {
      console.error('Failed to save recording:', error);
    }
  };

  const Card = ({ color }: any) => (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.cardText}>{color}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      <Image
        source={require("../assets/images/Recording.png")}
        style={{ marginBottom: 6 }}
      />

      {/* <Text>recording - {JSON.stringify(recording)}</Text> */}
      {/* <Text>recordings - {JSON.stringify(recordings)}</Text> */}

      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontSize: 60, fontWeight: 'bold', color: "#AAAAAA" }}>
          {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
        </Text>
      </View>

      {/* <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      /> */}
      {(recordings?.length > 0 &&
        <Button
          title={"Clear Recordings"}
          onPress={clearRecordings}
        />
      )}
      <View style={{ marginVertical: 10 }}>
        {recordings.length > 0 ? (
          getRecordingLines("recordingName")
        ) : (
          <Text>No recordings yet.</Text>
        )}
      </View>

      <Button
        title={"PopUp"}
        onPress={() => { setModalVisible(true) }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: "rgba(0,0,0,.2)", justifyContent: "center", alignItems: "center" }}>
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
                <Text style={{ color: "#333333", fontWeight: "600", marginBottom: 10 }}>Select Card Color</Text>
                <View style={styles.cardContainer}>
                  {['#FF6347', '#6A5ACD', '#20B2AA', '#FFD700', '#9370DB', '#32CD32'].map((color, index) => (
                    <Pressable
                      key={index}
                      style={[styles.card, { backgroundColor: color }]}
                      onPress={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && <Icon source="check" size={20} color="#FFFFFF" />}
                    </Pressable>
                  ))}
                </View>
              </View>
              <Pressable
                style={{ paddingHorizontal: 18, paddingVertical: 10, backgroundColor: "#113C6D" }}
                onPress={() => {
                  // handleSaveRecording()
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={{ color: "#fff", fontWeight: 600 }}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={{ position: 'absolute', bottom: 30, flexDirection: "row", alignItems: "center", alignSelf: "center", width: "70%", justifyContent: 'space-evenly' }}>
        <Icon source={"close"} size={34} color={recording ? "grey" : "green"} />
        <Pressable onPress={recording ? stopRecording : startRecording}>
          <Icon source={recording ? "square-rounded" : "checkbox-blank-circle"} size={74} color="red" />
        </Pressable>
        <Icon source={"check"} size={34} color={recording ? "grey" : "red"} />
      </View>
    </View>
  );
};

export default RecordingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 40
  },
  fill: {
    flex: 1,
    margin: 15
  },
  modalContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
    padding: 20,
  },
  input: {
    height: 40,
    width: 300,
    borderColor: '#DDDDDD',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: "80%",
    backgroundColor: '#fff',
    // borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
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
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
