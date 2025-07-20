import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  PanResponder,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const sleepLevels = [
  { 
    label: 'Excellent', 
    hours: '7-9 hours', 
    emoji: '😊', 
    color: '#6FCF97',
    description: 'Restful and refreshing sleep'
  },
  { 
    label: 'Good', 
    hours: '6-7 hours', 
    emoji: '🙂', 
    color: '#F2C94C',
    description: 'Mostly restful sleep'
  },
  { 
    label: 'Fair', 
    hours: '5 hours', 
    emoji: '😐', 
    color: '#BDBDBD',
    description: 'Somewhat restful sleep'
  },
  { 
    label: 'Poor', 
    hours: '3-4 hours', 
    emoji: '😟', 
    color: '#EB5757',
    description: 'Fragmented and light sleep'
  },
  { 
    label: 'Worst', 
    hours: '<3 hours', 
    emoji: '😵', 
    color: '#9B51E0',
    description: 'Very little or no sleep'
  },
];

const TRACK_HEIGHT = 300;
const THUMB_SIZE = 36;
const SEGMENT_HEIGHT = TRACK_HEIGHT / (sleepLevels.length - 1);

export default function SleepQualitySlider() {
  const middleIndex = Math.floor(sleepLevels.length / 2);
  const [selectedIndex, setSelectedIndex] = useState(middleIndex);
  const pan = useRef(new Animated.Value(selectedIndex * SEGMENT_HEIGHT)).current;
  const [isDragging, setIsDragging] = useState(false);
  
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fillScaleY = useRef(new Animated.Value(selectedIndex / (sleepLevels.length - 1))).current;

  const animateSelection = (index) => {
    const newYValue = index * SEGMENT_HEIGHT;
    const scaleYValue = index / (sleepLevels.length - 1);
    
    Animated.parallel([
      Animated.timing(pan, {
        toValue: newYValue,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(fillScaleY, {
        toValue: scaleYValue,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(descriptionOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setOffset(pan._value);
      },
      onPanResponderMove: (_, gestureState) => {
        let newY = gestureState.dy;
        let total = pan._offset + newY;

        // Clamp the value between 0 and TRACK_HEIGHT
        total = Math.max(0, Math.min(total, TRACK_HEIGHT));
        
        pan.setValue(newY);
        
        // Calculate the index based on position
        const index = Math.round(total / SEGMENT_HEIGHT);
        const clampedIndex = Math.max(0, Math.min(index, sleepLevels.length - 1));
        
        // Update fill and selected index
        fillScaleY.setValue(clampedIndex / (sleepLevels.length - 1));
        setSelectedIndex(clampedIndex);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        setIsDragging(false);
        animateSelection(selectedIndex);
      },
    }),
  ).current;

  const thumbY = pan.interpolate({
    inputRange: [0, TRACK_HEIGHT],
    outputRange: [0, TRACK_HEIGHT],
    extrapolate: 'clamp',
  });

  const handleSegmentPress = (index) => {
    setSelectedIndex(index);
    animateSelection(index);
  };

  const handleTrackPress = (event) => {
    const locationY = event.nativeEvent.locationY;
    const index = Math.round(locationY / SEGMENT_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, sleepLevels.length - 1));
    handleSegmentPress(clampedIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sleep Quality</Text>
        <View style={styles.stepBox}>
          <Text style={styles.stepText}>8 of 14</Text>
        </View>
      </View>

      <Text style={styles.question}>How would you rate your sleep quality?</Text>
      
      <Animated.View style={[styles.selectedCard, {
        backgroundColor: sleepLevels[selectedIndex].color + '40',
        borderColor: sleepLevels[selectedIndex].color,
        opacity: descriptionOpacity
      }]}>
        <Text style={styles.selectedEmoji}>{sleepLevels[selectedIndex].emoji}</Text>
        <Text style={styles.selectedLabel}>{sleepLevels[selectedIndex].label}</Text>
        <Text style={styles.selectedDescription}>{sleepLevels[selectedIndex].description}</Text>
      </Animated.View>

      <View style={styles.sliderContainer}>
        <View style={styles.labels}>
          {sleepLevels.map((level, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.labelRow, { height: SEGMENT_HEIGHT }]}
              onPress={() => handleSegmentPress(index)}
              activeOpacity={0.7}
            >
              <View>
                <Text style={[
                  styles.labelText,
                  index === selectedIndex && { 
                    fontWeight: 'bold', 
                    color: '#fff',
                    fontSize: 18
                  }
                ]}>
                  {level.label}
                </Text>
                <Text style={[
                  styles.hoursText,
                  index === selectedIndex && { color: '#fff' }
                ]}>
                  {level.hours}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.trackContainer}
          activeOpacity={1}
          onPress={handleTrackPress}
        >
          <View style={styles.trackShadow}>
            <View style={styles.track}>
              <Animated.View
                style={[
                  styles.trackFill,
                  {
                    backgroundColor: sleepLevels[selectedIndex].color,
                    transform: [{
                      scaleY: fillScaleY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.1, 1],
                        extrapolate: 'clamp',
                      })
                    }],
                  },
                ]}
              />
              {sleepLevels.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.trackNotch,
                    { bottom: (index * SEGMENT_HEIGHT) - 2 }
                  ]} 
                />
              ))}
            </View>
          </View>
          
          <Animated.View
  {...panResponder.panHandlers}
  style={[
    styles.thumb,
    {
      transform: [
        { translateY: thumbY },
        { scale: scaleAnim }
      ],
      backgroundColor: sleepLevels[selectedIndex].color + '30',
      borderWidth: 2,
      borderColor: sleepLevels[selectedIndex].color,
      shadowColor: sleepLevels[selectedIndex].color,
    },
  ]}
>
  <Text style={[
    styles.thumbEmoji,
    { color: sleepLevels[selectedIndex].color }
  ]}>
    {sleepLevels[selectedIndex].emoji}
  </Text>
</Animated.View>

        </TouchableOpacity>


        {/* Right side emojis Views */}
        <View style={styles.emojis}>
          {sleepLevels.map((level, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.emojiRow, { height: SEGMENT_HEIGHT }]}
              onPress={() => handleSegmentPress(index)}
              activeOpacity={0.7}
            >
              <Animated.View style={[
                styles.emojiContainer,
                index === selectedIndex && {
                  transform: [{ scale: scaleAnim }],
                  backgroundColor: level.color + '30',
                  borderColor: level.color,
                }
              ]}>
                <Text style={[
                  styles.emoji,
                  index === selectedIndex && { fontSize: 24 },
                ]}>
                  {level.emoji}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

      </View>
      
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0A04',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 15,
    flex: 1,
  },
  stepBox: {
    backgroundColor: '#5E3C1F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  question: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    lineHeight: 32,
  },
  selectedCard: {
    backgroundColor: '#ffffff20',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    alignItems: 'center',
  },
  selectedEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  selectedLabel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedDescription: {
    color: '#ffffffcc',
    fontSize: 14,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  labels: {
    flex: 1,
    marginRight: 10,
  },
  emojis: {
    marginLeft: 10,
    width: 50,
    alignItems: 'center',
  },
  labelRow: {
    justifyContent: 'center',
    paddingVertical: 10,
  },
  emojiRow: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  labelText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '500',
  },
  hoursText: {
    color: '#777',
    fontSize: 12,
    marginTop: 2,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  emoji: {
    fontSize: 20,
  },
  trackContainer: {
    height: TRACK_HEIGHT,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: 50,
  },
  trackShadow: {
    width: 16,
    height: TRACK_HEIGHT,
    borderRadius: 6,
    backgroundColor: '#00000060',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  track: {
    width: 12,
    height: TRACK_HEIGHT,
    backgroundColor: '#3A2018',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  trackFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    transformOrigin: 'bottom center',
  },
  trackNotch: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#ffffff60',
    left: -2,
  },
  thumb: {
    position: 'absolute',
    left: 7,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  thumbEmoji: {
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#F2C94C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  continueButtonText: {
    color: '#1A0A04',
    fontSize: 16,
    fontWeight: 'bold',
  },
});