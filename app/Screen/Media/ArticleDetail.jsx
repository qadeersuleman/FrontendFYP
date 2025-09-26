import React, { useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  Platform,
  StatusBar,
SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../assets/colors";

const { width } = Dimensions.get('window');

export default function ArticleDetail({route, navigation}) {

    const { article } = route.params; // get article from navigation


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Staggered animations on component mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleFollowPress = () => {
    // Simple scale animation on button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
     <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={Colors.neutrals.background} 
      />
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Article Detail</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="bookmark-outline" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Animated Tags */}
        <Animated.View 
          style={[
            styles.tagsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.tags}>
            <View style={[styles.tag, { backgroundColor: Colors.features.mindfulness + '20' }]}>
              <Text style={[styles.tagText, { color: Colors.features.mindfulness }]}>Article</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: Colors.features.meditation + '20' }]}>
              <Text style={[styles.tagText, { color: Colors.features.meditation }]}>Philosophy</Text>
            </View>
          </View>
        </Animated.View>

        {/* Animated Title */}
        <Animated.Text 
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          {article.title}
        </Animated.Text>

        {/* Animated Stats */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color={Colors.accent.coral} />
              <Text style={styles.statText}>4.5</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={16} color={Colors.accent.teal} />
              <Text style={styles.statText}>200K</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={16} color={Colors.accent.lavender} />
              <Text style={styles.statText}>23</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={Colors.text.tertiary} />
              <Text style={styles.statText}>5 min read</Text>
            </View>
          </View>
        </Animated.View>

        {/* Animated Author Section */}
        <Animated.View 
          style={[
            styles.authorCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.authorRow}>
            <Image
              source={{ uri: article.author.profile_picture }}
              style={styles.authorImage}
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{article.author.full_name}</Text>
              <Text style={styles.authorRole}>Philosophy Writer</Text>
            </View>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity 
                style={styles.followBtn}
                onPress={handleFollowPress}
              >
                <Text style={styles.followText}>Follow +</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Animated Content Sections */}
        <Animated.View 
          style={[
            styles.contentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: Colors.features.mindfulness + '20' }]}>
              <Text style={[styles.sectionIconText, { color: Colors.features.mindfulness }]}>🧘</Text>
            </View>
            <Text style={styles.sectionTitle}>Introduction</Text>
          </View>
          <Text style={styles.paragraph}>
           {article.content}
          </Text>
        </Animated.View>

        {/* Animated Image */}
        <Animated.View 
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <Image
            source={{ uri: article.image }}
            style={styles.articleImage}
          />
          <View style={styles.imageOverlay} />
        </Animated.View>

        {/* Additional Content Sections */}
        <Animated.View 
          style={[
            styles.contentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: Colors.features.journal + '20' }]}>
              <Text style={[styles.sectionIconText, { color: Colors.features.journal }]}>📖</Text>
            </View>
            <Text style={styles.sectionTitle}>Deep Dive</Text>
          </View>
          <Text style={styles.paragraph}>
            In this philosophical exploration, we delve into the various dimensions of
            life, seeking to unravel its deeper meaning and significance. From ancient Greek
            philosophers to modern existentialists, the quest continues.
          </Text>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.actionButtons,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]}>
            <Ionicons name="heart-outline" size={20} color={Colors.accent.coral} />
            <Text style={[styles.actionBtnText, { color: Colors.accent.coral }]}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.shareBtn]}>
            <Ionicons name="share-social-outline" size={20} color={Colors.brand.primary} />
            <Text style={[styles.actionBtnText, { color: Colors.brand.primary }]}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.commentBtn]}>
            <Ionicons name="chatbubble-outline" size={20} color={Colors.accent.teal} />
            <Text style={[styles.actionBtnText, { color: Colors.accent.teal }]}>Comment</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: Colors.neutrals.background,

  },
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.neutrals.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutrals.border,
    shadowColor: Colors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  iconButton: {
    padding: 5,
  },
  tagsContainer: {
    marginVertical: 10,
  },
  tags: {
    flexDirection: "row",
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: Colors.text.primary,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    marginVertical: 15,
    letterSpacing: -0.5,
  },
  statsContainer: {
    marginVertical: 10,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  statText: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  authorCard: {
    backgroundColor: Colors.neutrals.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 15,
    shadowColor: Colors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.neutrals.border,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.brand.primaryPastel,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  authorRole: {
    color: Colors.text.secondary,
    fontSize: 13,
    marginTop: 2,
  },
  followBtn: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  followText: {
    color: Colors.neutrals.white,
    fontWeight: "600",
    fontSize: 13,
  },
  contentSection: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  sectionIconText: {
    fontSize: 16,
  },
  sectionTitle: {
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  paragraph: {
    color: Colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  imageContainer: {
    position: "relative",
    marginVertical: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: Colors.ui.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  articleImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 25,
    paddingHorizontal: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: Colors.neutrals.surface,
    borderWidth: 1,
    borderColor: Colors.neutrals.border,
    shadowColor: Colors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: {
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
});