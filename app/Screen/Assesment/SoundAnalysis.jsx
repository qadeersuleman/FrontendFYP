import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import Headers from '../../components/Assesment/Header';
import Title from '../../components/Assesment/Title';
import AppButton from '../../components/AppButton';
import Colors from '../../assets/colors';

const SoundAnalysis = ({ navigation }) => {
  // State management
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Refs
  const lottieRef = useRef(null);

  // Initialize audio permissions
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
    })();
  }, []);

  // Clean up recording on unmount
  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      if (!permissionGranted) {
        Alert.alert('Permission required', 'Please grant microphone access in settings');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      setIsRecording(true);
      lottieRef.current?.play();

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);
      lottieRef.current?.pause();

      await recording.stopAndUnloadAsync();
      setRecording(null);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send to a speech-to-text API here
      const dummyTranscript = "This is a simulated transcript. In a real app, this would be your actual voice analysis.";
      setTranscript(dummyTranscript);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Processing Error', 'Failed to process recording.');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyTranscript = () => {
    // In a real implementation, you would use the transcript here
    setShowVoiceModal(false);
    setTranscript('');
    navigation.navigate('NextScreen');
  };

  return (
    <View style={styles.container}>
      <Headers onBack={() => navigation.goBack()} currentStep="7" />

      <View style={styles.titleContainer}>
        <Title>Voice Pattern Analysis</Title>
        <Text style={styles.subtitle}>
          Share your thoughts through voice recording
        </Text>
        <Text style={styles.centeredText}>
          Dr Freud.ai will analyze your voice patterns and emotions
        </Text>
      </View>

      <View style={styles.animationContainer}>
        <LottieView
          source={require('../../assets/json/wave.json')}
          autoPlay 
          loop
          style={styles.mainAnimation}
        />
        <Text style={styles.animationCaption}>
          {isRecording ? "Listening carefully..." : "Ready to analyze your voice"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.recordButton}
        activeOpacity={0.8}
        onPress={() => setShowVoiceModal(true)}
      >
        <Ionicons name="mic" size={24} color={Colors.text.primary} />
        <Text style={styles.recordButtonText}>Start Voice Analysis</Text>
      </TouchableOpacity>



      {/* Voice Recording Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showVoiceModal}
        onRequestClose={() => {
          if (isRecording) {
            Alert.alert(
              'Recording in progress',
              'Are you sure you want to cancel?',
              [
                { text: 'Continue Recording', style: 'cancel' },
                { 
                  text: 'Discard', 
                  onPress: () => {
                    if (recording) recording.stopAndUnloadAsync();
                    setShowVoiceModal(false);
                  }
                }
              ]
            );
          } else {
            setShowVoiceModal(false);
          }
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voice Analysis</Text>
            
            {!isRecording && !isProcessing && !transcript ? (
              <>
                <LottieView
                  source={require('../../assets/json/loading animation.json')}
                  autoPlay
                  loop
                  style={styles.lottieMic}
                />
                <Text style={styles.modalText}>
                  {permissionGranted 
                    ? 'Press start to begin voice analysis'
                    : 'Microphone access required'}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.modalActionButton,
                    !permissionGranted && styles.disabledButton
                  ]}
                  onPress={startRecording}
                  disabled={!permissionGranted}
                >
                  <Ionicons name="mic" size={24} color="white" />
                  <Text style={styles.modalActionButtonText}>
                    {permissionGranted ? 'Start Analysis' : 'Permission Needed'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : isRecording ? (
              <>
                <LottieView
                  ref={lottieRef}
                  source={require('../../assets/json/sound waves.json')}
                  autoPlay
                  loop
                  style={styles.lottieSoundWave}
                />
                <Text style={styles.recordingText}>Analyzing Voice Patterns...</Text>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.stopButton]}
                  onPress={stopRecording}
                >
                  <Ionicons name="square" size={24} color="white" />
                  <Text style={styles.modalActionButtonText}>Complete Analysis</Text>
                </TouchableOpacity>
              </>
            ) : isProcessing ? (
              <>
                <LottieView
                  source={require('../../assets/json/Enable mic.json')}
                  autoPlay
                  loop
                  style={styles.lottieProcessing}
                />
                <Text style={styles.modalText}>Processing your voice patterns...</Text>
                <ActivityIndicator size="large" color={Colors.brand.primary} />
              </>
            ) : (
              <>
                <Text style={styles.transcriptTitle}>Analysis Complete</Text>
                <View style={styles.transcriptBox}>
                  <Text style={styles.transcriptText}>{transcript}</Text>
                </View>
                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setTranscript('');
                      setShowVoiceModal(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Redo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.applyButton]}
                    onPress={applyTranscript}
                  >
                    <Text style={styles.modalButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.background,
    padding: 20,
    paddingTop: 0,
  },
  titleContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 4,
  },
  centeredText: {
    textAlign: 'center',
    color: Colors.text.secondary,
    fontSize: 14,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  mainAnimation: {
    width: 300,
    height: 200,
  },
  animationCaption: {
    marginTop: 20,
    color: Colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
  },
  recordButton: {
    flexDirection: 'row',
    backgroundColor: Colors.brand.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    shadowColor: Colors.ui.shadow,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  recordButtonText: {
    color: 'white',
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  appButton: {
    marginBottom: 20,
    backgroundColor: Colors.brand.primary,
    borderRadius: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text.primary,
  },
  modalText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginVertical: 15,
    lineHeight: 24,
  },
  lottieMic: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  lottieSoundWave: {
    width: 280,
    height: 160,
    marginBottom: 20,
  },
  lottieProcessing: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  modalActionButton: {
    flexDirection: 'row',
    backgroundColor: Colors.brand.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.text.tertiary,
  },
  modalActionButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: Colors.accent.coral,
  },
  recordingText: {
    fontSize: 18,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  transcriptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  transcriptBox: {
    width: '100%',
    minHeight: 120,
    backgroundColor: Colors.neutrals.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
  },
  transcriptText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text.secondary,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.neutrals.surface,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  applyButton: {
    backgroundColor: Colors.brand.primary,
    marginLeft: 15,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});

export default SoundAnalysis;