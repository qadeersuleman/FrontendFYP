import React, { useState, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions, Animated as RNAnimated } from 'react-native';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  ZoomIn,
  useAnimatedStyle
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../assets/colors';
import AppButton from '../../components/AppButton';
import Headers from '../../components/Assesment/Header';
import Title from '../../components/Assesment/Title';

const { width } = Dimensions.get('window');
const AGES = Array.from({ length: 83 }, (_, i) => (i + 18).toString());
const ITEM_HEIGHT = 70;
const SELECTED_ITEM_HEIGHT = 120;
const SELECTED_ITEM_WIDTH = width * 0.65;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const AgeSelection = ({route, navigation }) => {
  const [selectedAge, setSelectedAge] = useState('18');
  const flatListRef = useRef(null);
  const scrollY = useRef(new RNAnimated.Value(0)).current;


  // Get data of Health Goal
  const { health_goal } = route.params;

  const handleScroll = RNAnimated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const age = AGES[Math.min(Math.max(index, 0), AGES.length - 1)];
        setSelectedAge(age);
      }
    }
  );

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const renderAgeItem = ({ item, index }) => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.7, 0.85, 1.1, 0.85, 0.7],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.4, 0.7, 1, 0.7, 0.4],
      extrapolate: 'clamp',
    });

    const rotateX = scrollY.interpolate({
      inputRange,
      outputRange: ['-60deg', '-30deg', '0deg', '30deg', '60deg'],
      extrapolate: 'clamp',
    });

    const isSelected = selectedAge === item;

    return (
      <RNAnimated.View
        style={[
          styles.ageItem,
          {
            height: isSelected ? SELECTED_ITEM_HEIGHT : ITEM_HEIGHT,
            transform: [{ scale }, { rotateX }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.ageItemInner,
            isSelected && styles.selectedAgeItem,
          ]}
          onPress={() => {
            setSelectedAge(item);
            scrollToIndex(index);
          }}
          activeOpacity={0.7}
        >
          {isSelected && (
            <LinearGradient
              colors={[Colors.brand.primary, Colors.brand.primaryDark]}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}
          <Text style={[
            styles.ageText,
            isSelected && styles.selectedAgeText
          ]}>
            {item}
          </Text>
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <MaterialIcons name="favorite" size={16} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </RNAnimated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#f7f9fc', '#edf2f7']}
      style={styles.container}
    >
      <Headers onBack={() => navigation.goBack()} currentStep="2" />
      
      <Animated.View 
        entering={FadeInDown.duration(800).springify()}
        style={styles.titleContainer}
      >
        <Title>How old are you?</Title>
      </Animated.View>

      <View style={styles.pickerWrapper}>
        <Animated.View 
          entering={ZoomIn.duration(1000).springify()}
          style={styles.pickerContainer}
        >
          <LinearGradient
            colors={['transparent', 'rgba(143, 110, 255, 0.1)', 'transparent']}
            style={styles.centerHighlight}
          />
          <View style={styles.scrollIndicatorTop} />
          <View style={styles.scrollIndicatorBottom} />
          
          <RNAnimated.FlatList
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
        </Animated.View>
      </View>

      <Animated.View 
        style={styles.buttonContainer}
        entering={FadeInUp.duration(1000).springify()}
      >
        <AppButton 
          onPress={() => navigation.navigate('WeightSelection' ,{health_goal : health_goal, age : selectedAge})} 
          title="Continue"
          gradient={[Colors.brand.primary, Colors.brand.primaryDark]}
        />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '70%', // Limit the height of the picker
  },
  pickerContainer: {
    height: PICKER_HEIGHT,
    width: SELECTED_ITEM_WIDTH + 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  centerHighlight: {
    position: 'absolute',
    height: SELECTED_ITEM_HEIGHT - 20,
    width: SELECTED_ITEM_WIDTH,
    borderRadius: 20,
    zIndex: -1,
  },
  scrollIndicatorTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 1,
  },
  scrollIndicatorBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
  },
  list: {
    width: '100%',
  },
  listContent: {
    paddingVertical: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2,
  },
  ageItem: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    perspective: 800,
  },
  ageItemInner: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedAgeItem: {
    position: 'relative',
    overflow: 'hidden',
    width: SELECTED_ITEM_WIDTH,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  ageText: {
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    fontSize: 24,
    textAlign: 'center',
  },
  selectedAgeText: {
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    fontSize: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    padding: 4,
  },
  buttonContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
});

export default AgeSelection;