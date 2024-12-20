import { PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { check, checkMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';

const AudioRecorderPlayerScreen = () => {
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('');
  const [duration, setDuration] = useState('');

  const audioRecorderPlayer = new AudioRecorderPlayer();
  // console.log('audioRecorderPlayer:', audioRecorderPlayer);

  useEffect(() => {
    return () => {
      // Clean up listeners on component unmount
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  // checkMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.RECORD_AUDIO]).then((statuses) => {
  //   console.log('Read: ', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
  //   console.log('Write: ', statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);
  //   console.log('Audio: ', statuses[PERMISSIONS.ANDROID.RECORD_AUDIO]);
  // });

  const permission = async () => {
    if (Platform.OS === 'android') {
      console.log('Platform:: ', Platform.OS);
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external storage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  }

  const onStartRecord = async () => {
    try {
      await permission(); // Ensure permissions are granted
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordSecs(e.currentPosition);
        setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        return;
      });
      console.log("Result: ", result);
    } catch (error) {
      console.error('Error starting recorder:', error);
    }
  };


  // const onStartRecord = async () => {
  //   const result = await audioRecorderPlayer.startRecorder();
  //   audioRecorderPlayer.addRecordBackListener((e) => {
  //     setRecordSecs(e.currentPosition);
  //     setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
  //     return;
  //   });
  //   console.log(result);
  // };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);
  };

  const onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      setCurrentPositionSec(e.currentPosition);
      setCurrentDurationSec(e.duration);
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      return;
    });
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = async () => {
    console.log('onStopPlay');
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text onPress={() => onStartRecord()}>Start Recording</Text>
        <Text onPress={() => onStopRecord()}>Stop Recording</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text onPress={() => onStartPlay()}>{recordTime}</Text>
        <Text onPress={() => onStartPlay()}>{recordSecs}</Text>
        <Text onPress={() => onStartPlay()}>{currentPositionSec}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text onPress={() => onStartPlay()}>Start Playing</Text>
        <Text onPress={() => onPausePlay()}>Pause Playing</Text>
        <Text onPress={() => onStopPlay()}>Stop Playing</Text>
      </View>
    </View>
  );
}

export default AudioRecorderPlayerScreen;

const styles = StyleSheet.create({});


// import React, { Component } from 'react';
// import {
//   Dimensions,
//   PermissionsAndroid,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import AudioRecorderPlayer, {
//   AVEncoderAudioQualityIOSType,
//   AVEncodingOption,
//   AudioEncoderAndroidType,
//   AudioSourceAndroidType,
//   OutputFormatAndroidType,
// } from 'react-native-audio-recorder-player';
// import RNFetchBlob from 'rn-fetch-blob';
// import Button from './components/Button'; // Assuming you have a Button component

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#455A64',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   titleTxt: {
//     marginTop: 100,
//     color: 'white',
//     fontSize: 28,
//   },
//   txtRecordCounter: {
//     marginTop: 32,
//     color: 'white',
//     fontSize: 20,
//     textAlignVertical: 'center',
//     fontWeight: '200',
//     fontFamily: 'Helvetica Neue',
//     letterSpacing: 3,
//   },
//   txtCounter: {
//     marginTop: 12,
//     color: 'white',
//     fontSize: 20,
//     textAlignVertical: 'center',
//     fontWeight: '200',
//     fontFamily: 'Helvetica Neue',
//     letterSpacing: 3,
//   },
//   viewRecorder: {
//     marginTop: 40,
//     width: '100%',
//     alignItems: 'center',
//   },
//   recordBtnWrapper: {
//     flexDirection: 'row',
//   },
//   viewPlayer: {
//     marginTop: 60,
//     alignSelf: 'stretch',
//     alignItems: 'center',
//   },
//   viewBarWrapper: {
//     marginTop: 28,
//     marginHorizontal: 28,
//     alignSelf: 'stretch',
//   },
//   viewBar: {
//     backgroundColor: '#ccc',
//     height: 4,
//     alignSelf: 'stretch',
//   },
//   viewBarPlay: {
//     backgroundColor: 'white',
//     height: 4,
//     width: 0,
//   },
//   playStatusTxt: {
//     marginTop: 8,
//     color: '#ccc',
//   },
//   playBtnWrapper: {
//     flexDirection: 'row',
//     marginTop: 40,
//   },
//   btn: {
//     borderColor: 'white',
//     borderWidth: 1,
//   },
//   txt: {
//     color: 'white',
//     fontSize: 14,
//     marginHorizontal: 8,
//     marginVertical: 4,
//   },
// });

// const screenWidth = Dimensions.get('screen').width;

// class Page extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoggingIn: false,
//       recordSecs: 0,
//       recordTime: '00:00:00',
//       currentPositionSec: 0,
//       currentDurationSec: 0,
//       playTime: '00:00:00',
//       duration: '00:00:00',
//     };

//     this.audioRecorderPlayer = new AudioRecorderPlayer();
//     this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5

//     this.dirs = RNFetchBlob.fs.dirs;
//     this.path = Platform.select({
//       ios: `${this.dirs.DocumentDir}/hello.m4a`,
//       android: `${this.dirs.CacheDir}/hello.mp3`,
//     });
//   }

//   componentWillUnmount() {
//     this.audioRecorderPlayer.stopRecorder();
//     this.audioRecorderPlayer.stopPlayer();
//   }

//   onStatusPress = (e) => {
//     const touchX = e.nativeEvent.locationX;

//     let playWidth =
//       (this.state.currentDurationSec !== 0
//         ? (this.state.currentPositionSec / this.state.currentDurationSec) * (screenWidth - 56)
//         : 0);

//     const currentPosition = Math.round(this.state.currentPositionSec);

//     if (playWidth && playWidth < touchX) {
//       const addSecs = Math.round(currentPosition + 1000);
//       this.audioRecorderPlayer.seekToPlayer(addSecs);
//     } else {
//       const subSecs = Math.round(currentPosition - 1000);
//       this.audioRecorderPlayer.seekToPlayer(subSecs);
//     }
//   };

//   onStartRecord = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         ]);

//         if (
//           granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
//           granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
//           granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
//         ) {
//           console.log('Permissions granted');
//         } else {
//           console.log('All required permissions not granted');
//           return;
//         }
//       } catch (err) {
//         console.warn(err);
//         return;
//       }
//     }

//     const audioSet = {
//       AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
//       AudioSourceAndroid: AudioSourceAndroidType.MIC,
//       AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
//       AVNumberOfChannelsKeyIOS: 2,
//       AVFormatIDKeyIOS: AVEncodingOption.aac,
//       OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
//     };

//     const uri = await this.audioRecorderPlayer.startRecorder(this.path, audioSet);

//     this.audioRecorderPlayer.addRecordBackListener((e) => {
//       this.setState({
//         recordSecs: e.currentPosition,
//         recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
//       });
//     });
//   };

//   onPauseRecord = async () => {
//     try {
//       await this.audioRecorderPlayer.pauseRecorder();
//     } catch (err) {
//       console.log('pauseRecord', err);
//     }
//   };

//   onResumeRecord = async () => {
//     await this.audioRecorderPlayer.resumeRecorder();
//   };

//   onStopRecord = async () => {
//     await this.audioRecorderPlayer.stopRecorder();
//     this.audioRecorderPlayer.removeRecordBackListener();
//     this.setState({
//       recordSecs: 0,
//     });
//   };

//   onStartPlay = async () => {
//     try {
//       const msg = await this.audioRecorderPlayer.startPlayer(this.path);

//       this.audioRecorderPlayer.addPlayBackListener((e) => {
//         this.setState({
//           currentPositionSec: e.currentPosition,
//           currentDurationSec: e.duration,
//           playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
//           duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
//         });
//       });
//     } catch (err) {
//       console.log('startPlayer error', err);
//     }
//   };

//   onPausePlay = async () => {
//     await this.audioRecorderPlayer.pausePlayer();
//   };

//   onResumePlay = async () => {
//     await this.audioRecorderPlayer.resumePlayer();
//   };

//   onStopPlay = async () => {
//     this.audioRecorderPlayer.stopPlayer();
//     this.audioRecorderPlayer.removePlayBackListener();
//   };

//   render() {
//     let playWidth =
//       (this.state.currentDurationSec !== 0
//         ? (this.state.currentPositionSec / this.state.currentDurationSec) * (screenWidth - 56)
//         : 0);

//     if (!playWidth) {
//       playWidth = 0;
//     }

//     return (
//       <SafeAreaView style={styles.container}>
//         <Text style={styles.titleTxt}>Audio Recorder Player</Text>
//         <Text style={styles.txtRecordCounter}>{this.state.recordTime}</Text>
//         <View style={styles.viewRecorder}>
//           <View style={styles.recordBtnWrapper}>
//             <Button style={styles.btn} onPress={this.onStartRecord} textStyle={styles.txt}>
//               Record
//             </Button>
//             <Button
//               style={[styles.btn, { marginLeft: 12 }]}
//               onPress={this.onPauseRecord}
//               textStyle={styles.txt}
//             >
//               Pause
//             </Button>
//             <Button
//               style={[styles.btn, { marginLeft: 12 }]}
//               onPress={this.onResumeRecord}
//               textStyle={styles.txt}
//             >
//               Resume
//             </Button>
//             <Button
//               style={[styles.btn, { marginLeft: 12 }]}
//               onPress={this.onStopRecord}
//               textStyle={styles.txt}
//             >
//               Stop
//             </Button>
//           </View>
//         </View>
//         <View style={styles.viewPlayer}>
//           <TouchableOpacity style={styles.viewBarWrapper} onPress={this.onStatusPress}>
//             <View style={styles.viewBar}>
//               <View style={[styles.viewBarPlay, { width: playWidth }]} />
//             </View>
//           </TouchableOpacity>
//           <Text style={styles.txtCounter}>
//             {this.state.playTime} / {this.state.duration}
//           </Text>
//           <View style={styles.playBtnWrapper}>
//             <Button style={styles.btn} onPress={this.onStartPlay} textStyle={styles.txt}>
//               Play
//             </Button>
//             <Button
//               style={[styles.btn, { marginLeft: 12 }]}
//               onPress={this.onPausePlay}
//               textStyle={styles.txt}
//             >
//               Pause
//             </Button>
//             <Button
//               style={[styles.btn, { marginLeft: 12 }]}
//               onPress={this.onResumePlay}
//               textStyle={styles.txt}
//             >
//               Resume
//             </Button>
//             <Button
//               style={[styles.btn, { marginLeft: 12 }]}
//               onPress={this.onStopPlay}
//               textStyle={styles.txt}
//             >
//               Stop
//             </Button>
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

// export default Page;
