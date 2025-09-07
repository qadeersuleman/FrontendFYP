import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../assets/colors';

const ArticlesSection = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Sample articles data
  const articles = [
    {
      id: 1,
      category: "Mental Health",
      title: "Will meditation help you get out from the rat race?",
      readTime: "5:24",
      likes: 987,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      category: "Anxiety Relief",
      title: "5 techniques to reduce anxiety in minutes",
      readTime: "3:45",
      likes: 542,
      image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc5d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      category: "Sleep Better",
      title: "The science behind sleep and mental health",
      readTime: "7:12",
      likes: 1230,
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 4,
      category: "Mindfulness",
      title: "Daily mindfulness practices for busy people",
      readTime: "4:30",
      likes: 876,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ];

  // Handle scroll event to update active index
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / 216); // 200 (card width) + 16 (margin)
  };

  return (
    <View style={styles.container}>
      {/* Popular Articles */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mindful Articles</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.articlesScroll}
        contentContainerStyle={styles.articlesContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={216}
        snapToAlignment="start"
      >
        {articles.map((article, index) => (
          <View key={article.id} style={styles.articleCard}>
            <Image
              source={{ uri: article.image }}
              style={styles.articleImage}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'transparent']}
              style={styles.articleGradient}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
            />
            <View style={styles.articleContent}>
              <Text style={styles.articleCategory}>{article.category}</Text>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <View style={styles.articleStats}>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={12} color={Colors.text.inverted} />
                  <Text style={styles.articleStatText}>{article.readTime}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="heart-outline" size={12} color={Colors.text.inverted} />
                  <Text style={styles.articleStatText}>{article.likes}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.bookmarkButton}>
              <Ionicons name="bookmark-outline" size={16} color={Colors.text.inverted} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Indicator Dots */}
      <View style={styles.indicatorContainer}>
        {articles.map((_, index) => {
          const inputRange = [
            (index - 1) * 216,
            index * 216,
            (index + 1) * 216,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.indicatorDot,
                {
                  transform: [{ scale }],
                  opacity,
                }
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutrals.background,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    color: Colors.brand.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  articlesScroll: {
    marginBottom: 16,
  },
  articlesContent: {
    gap: 16,
    paddingRight: 16,
  },
  articleCard: {
    width: 200,
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.neutrals.surface,
    shadowColor: Colors.ui.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  articleImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  articleGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  articleContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  articleCategory: {
    color: Colors.text.inverted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  articleTitle: {
    color: Colors.text.inverted,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  articleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleStatText: {
    color: Colors.text.inverted,
    fontSize: 11,
    opacity: 0.9,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brand.primary,
    marginHorizontal: 4,
  },
});

export default ArticlesSection;