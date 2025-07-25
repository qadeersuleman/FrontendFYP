import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Modal,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Audio from 'expo-av';
import LottieView from 'lottie-react-native';
import Headers from '../../components/Assesment/Header';
import Title from '../../components/Assesment/Title';
import AppButton from '../../components/AppButton';
import Colors from '../../assets/colors';

const { width, height } = Dimensions.get('window');

const SoundAnalysis = ({ navigation }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Voice meter animation
  const meterAnim = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef(null);

  // Text input states
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxCharLimit = 250;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Request audio permissions
    (async () => {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    })();

    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setTranscript('');
      lottieRef.current?.play();
      
      // Start voice meter animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(meterAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(meterAnim, {
            toValue: 0.3,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);
      lottieRef.current?.pause();
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedAudio(uri);
      
      // Simulate processing (in a real app, you'd send to a speech-to-text API)
      setTimeout(() => {
        const dummyTranscript = "I don't want to be alive anymore. Just kill me, doc.";
        setTranscript(dummyTranscript);
        setIsProcessing(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsProcessing(false);
    }
  };

  const applyTranscript = () => {
    setText(transcript);
    setCharCount(transcript.length);
    setShowVoiceModal(false);
  };

  const handleTextChange = (input) => {
    setText(input);
    setCharCount(input.length);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Header */}
      <Headers onBack={() => navigation.goBack()} currentStep="4" />

      {/* Title */}
      <View style={styles.titleContainer}>
        <Title>Sound Analysis</Title>
        <Text style={styles.subtitle}>
          Freely write down anything that's on your mind. 
        </Text>
        <Text style={{textAlign: "center"}}>Dr Freud.ai is here to listen...</Text>
      </View>

      {/* Text Input Box */}
      <View style={styles.textBox}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Start typing here..."
          placeholderTextColor={Colors.text.tertiary}
          onChangeText={handleTextChange}
          value={text}
          autoFocus
        />
        <Text style={styles.charCount}>
          {charCount}/{maxCharLimit}
        </Text>
      </View>

      {/* Use voice button */}
      <TouchableOpacity 
        style={styles.voiceButton} 
        activeOpacity={0.8}
        onPress={() => setShowVoiceModal(true)}
      >
        <Ionicons name="mic" size={20} color={Colors.text.primary} />
        <Text style={styles.voiceText}>Use voice Instead</Text>
      </TouchableOpacity>

      {/* Continue button */}
      <AppButton 
        title="Continue" 
        style={styles.appButton} 
        onPress={() => navigation.navigate('NextScreen')}
      />

      {/* Voice Recording Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showVoiceModal}
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voice Recording</Text>
            
            {!isRecording && !isProcessing && !transcript ? (
              <>
                <LottieView
                  source={require('../../assets/json/Enable mic.json')}
                  autoPlay
                  loop
                  style={styles.lottieMic}
                />
                <Text style={styles.modalText}>Tap the button below to start recording</Text>
                <TouchableOpacity 
                  style={styles.recordButton} 
                  onPress={startRecording}
                >
                  <Ionicons name="mic" size={24} color="white" />
                  <Text style={styles.recordButtonText}>Start Recording</Text>
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
                
                <Animated.View style={[
                  styles.voiceMeter,
                  {
                    transform: [{
                      scaleY: meterAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.5]
                      })
                    }]
                  }
                ]} />
                
                <Text style={styles.recordingText}>Recording...</Text>
                <TouchableOpacity 
                  style={styles.stopButton} 
                  onPress={stopRecording}
                >
                  <Ionicons name="square" size={24} color="white" />
                  <Text style={styles.stopButtonText}>Stop Recording</Text>
                </TouchableOpacity>
              </>
            ) : isProcessing ? (
              <>
                <LottieView
                  source={require('../../assets/json/loading animation.json')}
                  autoPlay
                  loop
                  style={styles.lottieProcessing}
                />
                <Text style={styles.modalText}>Processing your voice...</Text>
              </>
            ) : (
              <>
                <Text style={styles.transcriptTitle}>Transcript:</Text>
                <View style={styles.transcriptBox}>
                  <Text style={styles.transcriptText}>{transcript}</Text>
                </View>
                <View style={styles.modalButtonRow}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowVoiceModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.applyButton]}
                    onPress={applyTranscript}
                  >
                    <Text style={styles.modalButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </Animated.View>
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
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  textBox: {
    backgroundColor: Colors.neutrals.surface,
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    minHeight: 200,
    justifyContent: 'space-between',
    shadowColor: Colors.ui.shadowDark,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  textInput: {
    color: Colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
    flex: 1,
  },
  charCount: {
    color: Colors.text.tertiary,
    textAlign: 'right',
    fontSize: 12,
    marginTop: 10,
  },
  voiceButton: {
    width: '70%',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.accent.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 40,
    shadowColor: Colors.ui.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  voiceText: {
    color: Colors.text.primary,
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 15,
  },
  appButton: {
    marginTop: 30,
    backgroundColor: Colors.brand.primary,
    borderRadius: 30,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
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
  },
  lottieMic: {
    width: 150,
    height: 150,
  },
  lottieSoundWave: {
    width: 250,
    height: 150,
  },
  lottieProcessing: {
    width: 120,
    height: 120,
  },
  recordButton: {
    flexDirection: 'row',
    backgroundColor: Colors.brand.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  recordButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  stopButton: {
    flexDirection: 'row',
    backgroundColor: Colors.accent.coral,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  stopButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  voiceMeter: {
    width: '80%',
    height: 30,
    backgroundColor: Colors.accent.tealLight,
    borderRadius: 15,
    marginVertical: 20,
  },
  recordingText: {
    fontSize: 18,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: 10,
  },
  transcriptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  transcriptBox: {
    width: '100%',
    minHeight: 100,
    backgroundColor: Colors.neutrals.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 25,
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
  },
});

export default SoundAnalysis;