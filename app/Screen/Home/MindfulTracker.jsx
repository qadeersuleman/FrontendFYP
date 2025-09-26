import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../assets/colors";
import { useNavigation } from '@react-navigation/native';

const MindfulTracker = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wellness Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="stats-chart" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Mindful Hours */}
      <LinearGradient
        colors={[Colors.features.mindfulness, Colors.features.meditation]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="time" size={24} color={Colors.text.inverted} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Mindful Hours</Text>
            <Text style={styles.stat}>2.5h/8h</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View style={[styles.progressFill, { width: "31.25%" }]} />
              </View>
              <Text style={styles.progressText}>31% completed</Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.text.inverted}
            style={{ opacity: 0.7 }}
          />
        </View>
      </LinearGradient>

      {/* Sleep Quality */}
      <LinearGradient
        colors={[Colors.accent.lavender, Colors.accent.lavenderDark]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="moon" size={24} color={Colors.text.inverted} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Sleep Quality</Text>
            <Text style={styles.stat}>Insomniac (~2h Avg)</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: "20%",
                      backgroundColor: Colors.accent.lavenderLight,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>Needs improvement</Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.text.inverted}
            style={{ opacity: 0.7 }}
          />
        </View>
      </LinearGradient>

      {/* Mindful Journal */}
      <LinearGradient
        colors={[Colors.features.journal, Colors.status.success]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.cardContent} onPress={() => navigation.navigate("MindfulJournal")}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={24} color={Colors.text.inverted} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Mindful Journal</Text>
            <View style={styles.streakContainer}>
              <Text style={styles.streakText}>64 Day Streak</Text>
              <View style={styles.fireIcon}>
                <Ionicons name="flame" size={16} color={Colors.accent.coral} />
              </View>
            </View>
            <Text style={styles.subText}>Keep up the good work!</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.text.inverted}
            style={{ opacity: 0.7 }}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Stress Level */}
      <LinearGradient
        colors={[Colors.features.mood, Colors.accent.coral]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.cardContent} onPress={() => navigation.navigate("stressLevel")}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="brain"
              size={24}
              color={Colors.text.inverted}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Stress Level</Text>
            <Text style={styles.stat}>Level 3 (Normal)</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: "60%", backgroundColor: Colors.accent.coralLight },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>Moderate stress</Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.text.inverted}
            style={{ opacity: 0.7 }}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Mood Tracker */}
      <LinearGradient
        colors={[Colors.dataViz.green, Colors.features.journal]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate("MoodTracker")}
        >
          <View style={styles.iconContainer}>
            <FontAwesome5 name="smile" size={24} color={Colors.text.inverted} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Mood Tracker</Text>
            <View style={styles.moodContainer}>
              <View style={styles.moodItem}>
                <View
                  style={[
                    styles.moodDot,
                    { backgroundColor: Colors.status.error },
                  ]}
                />
                <Text style={styles.moodText}>Sad</Text>
              </View>
              <View style={styles.moodItem}>
                <View
                  style={[
                    styles.moodDot,
                    { backgroundColor: Colors.features.ai },
                  ]}
                />
                <Text style={styles.moodText}>Happy</Text>
              </View>
              <View style={styles.moodItem}>
                <View
                  style={[
                    styles.moodDot,
                    { backgroundColor: Colors.dataViz.green },
                  ]}
                />
                <Text style={styles.moodText}>Neutral</Text>
              </View>
            </View>
            <Text style={styles.subText}>Today's mood: Happy</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.text.inverted}
            style={{ opacity: 0.7 }}
          />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.background,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: Colors.text.primary,
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: Colors.ui.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.text.inverted,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stat: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.text.inverted,
    borderRadius: 3,
  },
  progressText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  streakText: {
    color: Colors.text.inverted,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  fireIcon: {
    backgroundColor: Colors.text.inverted,
    borderRadius: 10,
    padding: 2,
  },
  subText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 4,
  },
  moodItem: {
    alignItems: "center",
    flex: 1,
  },
  moodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  moodText: {
    color: Colors.text.inverted,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default MindfulTracker;
