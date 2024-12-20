import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { RecordingPresets, useAudioPlayer, useAudioRecorder } from 'expo-audio';
// import { useAudioRecorder, RecordingOptions, AudioModule, RecordingPresets } from 'expo-audio';

const ExpoAudio = () => {

  // const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  // const record = () => audioRecorder.record();

  // const stopRecording = async () => {
  //   // The recording will be available on `audioRecorder.uri`.
  //   await audioRecorder.stop();
  // };

  // useEffect(() => {
  //   (async () => {
  //     const status = await AudioModule.requestRecordingPermissionsAsync();
  //     if (!status.granted) {
  //       Alert.alert('Permission to access microphone was denied');
  //     }
  //   })();
  // }, []);

  return (
    <View style={styles.container}>
      {/* <Button
        title={audioRecorder.isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={audioRecorder.isRecording ? stopRecording : record}
      /> */}
      <Text style={{ textAlign: "center" }}>ExpoAudio</Text>
    </View>
  );
}

export default ExpoAudio

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
})