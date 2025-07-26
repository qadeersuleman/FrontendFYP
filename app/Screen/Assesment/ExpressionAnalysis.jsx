import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Headers from '../../components/Assesment/Header';
import Title from '../../components/Assesment/Title';
import AppButton from '../../components/AppButton';
import Colors from '../../assets/colors';

const ExpressionAnalysis = ({ navigation }) => {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxCharLimit = 250;

  const handleTextChange = (input) => {
    setText(input);
    setCharCount(input.length);
  };

  return (
    <View style={styles.container}>
      <Headers onBack={() => navigation.goBack()} currentStep="6" />
      
      <View style={styles.titleContainer}>
        <Title>Expression Analysis</Title>
        <Text style={styles.subtitle}>
          Freely write down anything that's on your mind.
        </Text>
        <Text style={styles.centeredText}>Dr Freud.ai is here to listen...</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.textBox}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Start typing here..."
              placeholderTextColor={Colors.text.tertiary}
              onChangeText={handleTextChange}
              value={text}
              maxLength={maxCharLimit}
              autoFocus
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {charCount}/{maxCharLimit}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppButton
        title="Continue"
        style={styles.appButton}
        onPress={() => navigation.navigate('SoundAnalysis')}
      />
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  titleContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 4,
  },
  centeredText: {
    textAlign: 'center',
    color: Colors.text.secondary,
    fontSize: 14,
  },
  textBox: {
    flex: 1,
    backgroundColor: Colors.neutrals.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: Colors.ui.shadowDark,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
    minHeight: 300, // Give it a fixed minimum height
  },
  textInput: {
    color: Colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    minHeight: 200, // Minimum height for the input area
  },
  charCount: {
    color: Colors.text.tertiary,
    textAlign: 'right',
    fontSize: 12,
    marginTop: 10,
  },
  appButton: {
    marginBottom: 20,
    backgroundColor: Colors.brand.primary,
    borderRadius: 30,
  },
});

export default ExpressionAnalysis;