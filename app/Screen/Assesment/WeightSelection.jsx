import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Colors from '../../assets/colors';
import Headers from '../../components/Assesment/Header';
import AppButton from '../../components/AppButton';
import Title from '../../components/Assesment/Title';

const { width } = Dimensions.get('window');
const WEIGHTS = Array.from({ length: 121 }, (_, i) => (40 + i).toString()); // 40 to 160 kg
const ITEM_WIDTH = 60;

const WeightSelection = ({ navigation }) => {
  const [unit, setUnit] = useState('kg');
  const [selectedWeight, setSelectedWeight] = useState('128');
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    const weight = WEIGHTS[Math.min(Math.max(index, 0), WEIGHTS.length - 1)];
    setSelectedWeight(weight);
  };

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // center the selected item
    });
  };

  const renderWeightItem = ({ item, index }) => {
    const isSelected = selectedWeight === item;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedWeight(item);
          scrollToIndex(index);
        }}
        style={[styles.item, isSelected && styles.selectedItem]}
      >
        <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.neutrals.background }]}>
      <Headers onBack={() => navigation.goBack()} currentStep="3" />

      <Title>What's your weight?</Title>

      {/* Unit Switcher */}
      <View style={styles.unitSwitcher}>
        <TouchableOpacity onPress={() => setUnit('kg')} style={[styles.unitButton, unit === 'kg' && styles.unitActive]}>
          <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>kg</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setUnit('lbs')} style={[styles.unitButton, unit === 'lbs' && styles.unitActive]}>
          <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>lbs</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.selectedWeightText}>
        {selectedWeight} <Text style={styles.unitLabel}>{unit}</Text>
      </Text>

      {/* Weight Picker */}
      <View style={styles.sliderWrapper}>
        <View style={styles.centerIndicator} />
        <FlatList
          ref={flatListRef}
          data={WEIGHTS}
          renderItem={renderWeightItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <View style={styles.buttonContainer}>
        <AppButton onPress={() => navigation.navigate('NextScreen')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  unitSwitcher: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: -40,
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    padding: 5,
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  unitActive: {
    backgroundColor: Colors.brand.primaryLight,
  },
  unitText: {
    fontSize: 16,
    color: '#555',
  },
  unitTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedWeightText: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: Colors.text.primary,
  },
  unitLabel: {
    fontSize: 20,
    fontWeight: '400',
    color: '#999',
  },
  sliderWrapper: {
    alignItems: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  listContent: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: Colors.brand.primary,
    borderRadius: ITEM_WIDTH / 2,
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#aaa',
  },
  selectedItemText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 120,
  },
});

export default WeightSelection;
