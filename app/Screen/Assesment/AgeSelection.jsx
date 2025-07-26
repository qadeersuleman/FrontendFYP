import React, { useState, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Colors from '../../assets/colors';
import AppButton from '../../components/AppButton';
import Headers from '../../components/Assesment/Header';
import Title from '../../components/Assesment/Title';

const { height } = Dimensions.get('window');
const AGES = Array.from({ length: 83 }, (_, i) => (i + 18).toString()); // Ages 18-100
const ITEM_HEIGHT = 60;
const SELECTED_ITEM_HEIGHT = 150;
const SELECTED_ITEM_WIDTH = 250;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS + (SELECTED_ITEM_HEIGHT - ITEM_HEIGHT);

const AgeSelection = ({ navigation }) => {
  const [selectedAge, setSelectedAge] = useState('18');
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const age = AGES[Math.min(Math.max(index, 0), AGES.length - 1)];
    setSelectedAge(age);
  };

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewOffset: (PICKER_HEIGHT / 2) - (SELECTED_ITEM_HEIGHT / 2),
    });
  };

  const renderAgeItem = ({ item, index }) => {
    const isSelected = selectedAge === item;
    const prevAge = AGES[AGES.indexOf(item) - 1] || '';
    const nextAge = AGES[AGES.indexOf(item) + 1] || '';
    
    let fontSize = 30;
    let opacity = 0.5;
    if (isSelected) {
      fontSize = 32;
      opacity = 1;
    } else if (item === prevAge || item === nextAge) {
      fontSize = 18;
      opacity = 0.8;
    }

    return (
      <TouchableOpacity
        style={[
          styles.ageItem,
          isSelected && styles.selectedAgeItem,
          { height: isSelected ? SELECTED_ITEM_HEIGHT : ITEM_HEIGHT }
        ]}
        onPress={() => {
          setSelectedAge(item);
          scrollToIndex(index);
        }}
      >
        <Text style={[
          styles.ageText,
          { fontSize, opacity },
          isSelected && styles.selectedAgeText
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.neutrals.background }]}>
      <Headers onBack={() => navigation.goBack()} currentStep="2" />
      
      {/* Adjusted spacing here - reduced marginBottom */}
      {/* <Animated.Text
        style={[styles.title, { color: Colors.brand.primary }]}
        entering={FadeInUp.duration(1000).springify()}
      >
        What's your age?
      </Animated.Text> */}
       
      <Title>
        What's your age?

      </Title>

      {/* Wrapped picker in a View with flex:1 for better spacing */}
      <View style={styles.pickerWrapper}>
        <View style={styles.pickerContainer}>
          <View style={styles.centerHighlight} />
          <FlatList
            ref={flatListRef}
            data={AGES}
            renderItem={renderAgeItem}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            initialScrollIndex={AGES.indexOf('18')}
            getItemLayout={(data, index) => (
              { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
            )}
            contentContainerStyle={styles.listContent}
            style={styles.list}
          />
        </View>
      </View>

      {/* Added spacing wrapper for the button */}
      <View style={styles.buttonContainer}>
        <AppButton onPress={() => navigation.navigate('WeightSelection')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, // Changed from padding to paddingHorizontal
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    flex: 1, // Added to take available space
    justifyContent: 'center',
    marginVertical: 10, // Reduced vertical margin
  },
  pickerContainer: {
    height: PICKER_HEIGHT,
    width: SELECTED_ITEM_WIDTH + 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center', // Center the picker horizontally
  },
  centerHighlight: {
    position: 'absolute',
    height: SELECTED_ITEM_HEIGHT,
    width: SELECTED_ITEM_WIDTH,
    borderRadius: SELECTED_ITEM_HEIGHT / 2,
    borderWidth: 2,
    borderColor: Colors.brand.primaryLight,
    backgroundColor: 'transparent',
    zIndex: -1,
  },
  list: {
    width: '100%',
  },
  listContent: {
    paddingTop: (PICKER_HEIGHT / 2) - (SELECTED_ITEM_HEIGHT / 2),
    paddingBottom: (PICKER_HEIGHT / 2) - (SELECTED_ITEM_HEIGHT / 2),
  },
  ageItem: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedAgeItem: {
    backgroundColor: Colors.brand.primaryLight,
    borderRadius: SELECTED_ITEM_HEIGHT / 2,
    width: SELECTED_ITEM_WIDTH,
    marginVertical: 10, // Changed from marginBlock for consistency
    marginLeft : 30
  },
  ageText: {
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  selectedAgeText: {
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(249, 249, 249, 0.9)',
    fontSize : 80
  },
  buttonContainer: {
    // paddingBottom: 20, // Added bottom padding
    marginBottom: 80, // Added some top padding
  },
});

export default AgeSelection;