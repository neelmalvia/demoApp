import { Alert, Button, Modal, Pressable, StyleSheet, Text, TextInput, Touchable, View } from "react-native";
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
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();

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
      <View key={index} style={[styles.row, { backgroundColor: recordingLine.color }]}>
        <Text style={styles.fill}>
          {/* {recordingLine.name} | Recording #{index + 1} | {recordingLine.duration} */}
          Recording #{index + 1} | {recordingLine.duration}
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

      setModalVisible(false);
      setRecordingName('');
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
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button
        title={recordings?.length > 0 ? "Clear Recordings" : ""}
        onPress={clearRecordings}
      />
      <View>
        {recordings.length > 0 ? (
          getRecordingLines("recordingName")
        ) : (
          <Text>No recordings yet.</Text>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Save Recording</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
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
              onPress={handleSaveRecording}
            >
              <Text style={{ color: "#fff", fontWeight: 600 }}>Submit</Text>
            </Pressable>
          </View>
        </View>
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
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
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
    width: '100%',
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
