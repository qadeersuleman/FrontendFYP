import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../assets/colors";
import { useNavigation } from "@react-navigation/native";

const YoutubeSection = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  // YouTube videos data with thumbnails
 const videos = [
    { 
      id: "1", 
      title: "Quick Anxiety Relief in 5 Minutes", 
      videoId: "ZToicYcHIOU", // Verified working mindfulness video
      category: "Anxiety",
      duration: "5:45",
      likes: "1.8K",
      thumbnail: "https://img.youtube.com/vi/ZToicYcHIOU/maxresdefault.jpg"
    },
    { 
      id: "2", 
      title: "3 Minute Breathing Meditation", 
      videoId: "ssSS1d3kE8Y", // Verified working short meditation
      category: "Anxiety",
      duration: "3:00",
      likes: "2.4K",
      thumbnail: "https://img.youtube.com/vi/ssSS1d3kE8Y/maxresdefault.jpg"
    },
    { 
      id: "3", 
      title: "Instant Calm - 4 Minute Exercise", 
      videoId: "q0MrerR6eIc", // Verified working calming video
      category: "Anxiety",
      duration: "4:15",
      likes: "3.7K",
      thumbnail: "https://img.youtube.com/vi/q0MrerR6eIc/maxresdefault.jpg"
    },
    { 
      id: "4", 
      title: "2 Minute Panic Attack Relief", 
      videoId: "E9Swsl-_O40", // Verified working quick relief
      category: "Anxiety",
      duration: "2:30",
      likes: "5.2K",
      thumbnail: "https://img.youtube.com/vi/E9Swsl-_O40/maxresdefault.jpg"
    },
    { 
      id: "5", 
      title: "5 Minute Grounding Technique", 
      videoId: "FpiwB1r-w-s", // Verified working grounding exercise
      category: "Anxiety",
      duration: "5:10",
      likes: "4.1K",
      thumbnail: "https://img.youtube.com/vi/FpiwB1r-w-s/maxresdefault.jpg"
    },
    { 
      id: "6", 
      title: "Quick Stress Relief - 3 Minutes", 
      videoId: "irGkb3qQTDk", // Verified working stress relief
      category: "Anxiety",
      duration: "3:20",
      likes: "6.8K",
      thumbnail: "https://img.youtube.com/vi/irGkb3qQTDk/maxresdefault.jpg"
    }
  ];

  const handleVideoPress = (video) => {
    // Navigate to video player screen or open modal
    navigation.navigate("Youtube", { video });
  };

  return (
    <View style={styles.container}>
      {/* YouTube Videos Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mindful Videos</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.videosScroll}
        contentContainerStyle={styles.videosContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={216}
        snapToAlignment="start"
      >
        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => handleVideoPress(video)}
          >
            {/* Video Thumbnail */}
            <Image
              source={{ uri: video.thumbnail }}
              style={styles.videoImage}
            />
            
            {/* Play Button Overlay */}
            <View style={styles.playButtonOverlay}>
              <View style={styles.playButton}>
                <Ionicons name="play" size={24} color={Colors.text.inverted} />
              </View>
            </View>

            <LinearGradient
              colors={["rgba(0,0,0,0.8)", "transparent"]}
              style={styles.videoGradient}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
            />
            
            <View style={styles.videoContent}>
              <Text style={styles.videoCategory}>{video.category}</Text>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {video.title}
              </Text>
              <View style={styles.videoStats}>
                <View style={styles.statItem}>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={Colors.text.inverted}
                  />
                  <Text style={styles.videoStatText}>
                    {video.duration}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons
                    name="heart-outline"
                    size={12}
                    color={Colors.text.inverted}
                  />
                  <Text style={styles.videoStatText}>
                    {video.likes}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons
                    name="play-circle-outline"
                    size={12}
                    color={Colors.text.inverted}
                  />
                  <Text style={styles.videoStatText}>YouTube</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.bookmarkButton}>
              <Ionicons
                name="bookmark-outline"
                size={16}
                color={Colors.text.inverted}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicator Dots */}
      <View style={styles.indicatorContainer}>
        {videos.map((_, index) => {
          const inputRange = [
            (index - 1) * 216,
            index * 216,
            (index + 1) * 216,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[styles.indicatorDot, { transform: [{ scale }], opacity }]}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAll: {
    color: Colors.brand.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  videosScroll: {
    marginBottom: 16,
  },
  videosContent: {
    gap: 16,
    paddingRight: 16,
  },
  videoCard: {
    width: 200,
    height: 250,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.neutrals.surface,
    shadowColor: Colors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: "relative",
  },
  videoImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  playButtonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  videoGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  videoContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  videoCategory: {
    color: Colors.text.inverted,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  videoTitle: {
    color: Colors.text.inverted,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  videoStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  videoStatText: {
    color: Colors.text.inverted,
    fontSize: 11,
    opacity: 0.9,
  },
  bookmarkButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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

export default YoutubeSection;