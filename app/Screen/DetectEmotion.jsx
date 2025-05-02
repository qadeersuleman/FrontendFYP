import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as FaceDetector from "expo-face-detector";
import Slider from "@react-native-community/slider";

const screenHeight = Dimensions.get("window").height;

const Button = ({ icon, onPress, color = "white", size = 30, style }) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <Text style={{ color, fontSize: size }}>{icon}</Text>
  </TouchableOpacity>
);

// Updated emotion icons with more variety
const emotionIcons = {
    happy: "😊",
    neutral: "😐",
    angry: "😠",
    sad: "😢",
    surprised: "😲",
    disgusted: "🤢",
    fearful: "😨",
    sleepy: "😴",
  };

export default function DetectEmotion() {
  // Permissions state
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [mediaLibraryPermissions, requestMediaLibraryPermissions] =
    MediaLibrary.usePermissions();

  // Camera settings state
  const [cameraSettings, setCameraSettings] = useState({
    zoom: 0,
    facing: "front",
    flash: "on",
    animateShutter: false,
    enableTorch: false,
  });

  // Image state
  const [image, setImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [faceData, setFaceData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  // Load last saved image when permissions change
  useEffect(() => {
    if (
      cameraPermissions?.granted &&
      mediaLibraryPermissions?.status === "granted"
    ) {
      getLastSavedImage();
    }
  }, [cameraPermissions, mediaLibraryPermissions]);

  // Handle permissions
  if (!cameraPermissions || !mediaLibraryPermissions) {
    return <View />;
  }

  if (
    !cameraPermissions.granted ||
    mediaLibraryPermissions.status !== "granted"
  ) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need camera and gallery permissions to continue
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => {
            requestCameraPermissions();
            requestMediaLibraryPermissions();
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Toggle camera properties
  const toggleSetting = (setting, option1, option2) => {
    setCameraSettings((prev) => ({
      ...prev,
      [setting]: prev[setting] === option1 ? option2 : option1,
    }));
  };

  // Zoom controls
  const adjustZoom = (direction) => {
    setCameraSettings((prev) => ({
      ...prev,
      zoom: Math.min(Math.max(prev.zoom + direction * 0.1, 0), 1),
    }));
  };

  // Capture image
  const captureImage = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImage(photo.uri);
        detectFaceAndEmotions(photo.uri);
      } catch (error) {
        Alert.alert("Error", "Failed to capture image");
      }
    }
  };

 // Updated emotion detection function
const detectFaceAndEmotions = async (imageUri) => {
    setIsProcessing(true);
    try {
      const result = await FaceDetector.detectFacesAsync(imageUri, {
        mode: FaceDetector.FaceDetectorMode.accurate,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
      });
      
      if (result.faces.length > 0) {
        const detectedFaces = result.faces.map(face => {
          // Enhanced emotion detection
          let dominantEmotion = "neutral";
          let confidence = 0;
          
          // Calculate emotion probabilities
          const emotions = {
            happy: face.smilingProbability * 0.8,
            surprised: (1 - face.leftEyeOpenProbability) * (1 - face.rightEyeOpenProbability) * 0.7,
            angry: (face.leftEyebrowHeight + face.rightEyebrowHeight) * 0.5,
            sad: (1 - face.smilingProbability) * 0.6,
            neutral: 0.3 // Base neutral probability
          };
          
          // Find dominant emotion
          let maxProb = 0;
          for (const [emotion, prob] of Object.entries(emotions)) {
            if (prob > maxProb) {
              maxProb = prob;
              dominantEmotion = emotion;
              confidence = prob;
            }
          }
          
          // Special case for surprised when eyes are very open
          if (face.leftEyeOpenProbability > 0.9 && face.rightEyeOpenProbability > 0.9) {
            const surpriseProb = (face.leftEyeOpenProbability + face.rightEyeOpenProbability) / 2;
            if (surpriseProb > maxProb) {
              dominantEmotion = "surprised";
              confidence = surpriseProb;
            }
          }
          
          return {
            bounds: face.bounds,
            emotion: dominantEmotion,
            confidence: Math.round(confidence * 100),
          };
        });
        
        setFaceData(detectedFaces);
      } else {
        setFaceData(null);
      }
    } catch (error) {
      console.error("Face detection error:", error);
      setFaceData(null);
    } finally {
      setIsProcessing(false);
    }
  };
  

  // Save image to gallery
  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        Alert.alert("Success", "Photo saved to gallery");
        setImage(null);
        getLastSavedImage();
      } catch (error) {
        Alert.alert("Error", "Failed to save photo");
      }
    }
  };

  // Get last saved image from gallery
  const getLastSavedImage = async () => {
    try {
      const dcimAlbum = await MediaLibrary.getAlbumAsync("DCIM");
      if (dcimAlbum) {
        const { assets } = await MediaLibrary.getAssetsAsync({
          album: dcimAlbum,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          mediaType: MediaLibrary.MediaType.photo,
          first: 1,
        });

        if (assets.length > 0) {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(assets[0].id);
          setPreviousImage(assetInfo.localUri || assetInfo.uri);
        } else {
          setPreviousImage(null);
        }
      }
    } catch (error) {
      console.error("Error loading last image:", error);
    }
  };

  // Render camera view
  if (!image) {
    return (
      <View style={styles.container}>
        {/* Top controls */}
        <View style={styles.topControls}>
          <Button
            icon={cameraSettings.flash === "on" ? "⚡️" : "⚡️❌"}
            onPress={() => toggleSetting("flash", "on", "off")}
          />
          <Button
            icon="📸"
            color={cameraSettings.animateShutter ? "white" : "gray"}
            onPress={() => toggleSetting("animateShutter", true, false)}
          />
          <Button
            icon={cameraSettings.enableTorch ? "🔦" : "🔦❌"}
            onPress={() => toggleSetting("enableTorch", true, false)}
          />
        </View>

        {/* Camera view */}
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          zoom={cameraSettings.zoom}
          facing={cameraSettings.facing}
          flash={cameraSettings.flash}
          animateShutter={cameraSettings.animateShutter}
          enableTorch={cameraSettings.enableTorch}
        />

        {/* Zoom controls */}
        <View style={styles.zoomControls}>
          <Button icon="🔍-" onPress={() => adjustZoom(-1)} size={25} />
          <Slider
            style={styles.zoomSlider}
            minimumValue={0}
            maximumValue={1}
            value={cameraSettings.zoom}
            onValueChange={(value) =>
              setCameraSettings((prev) => ({ ...prev, zoom: value }))
            }
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
          <Button icon="🔍+" onPress={() => adjustZoom(1)} size={25} />
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={() => previousImage && setImage(previousImage)}>
            <Image
              source={{ uri: previousImage }}
              style={styles.thumbnail}
            />
          </TouchableOpacity>
          <Button icon="📷" size={60} onPress={captureImage} />
          <Button
            icon="🔄"
            size={40}
            onPress={() => toggleSetting("facing", "front", "back")}
          />
        </View>
      </View>
    );
  }

  // Render captured image preview
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.preview} />
      
      {/* Face detection result */}
      <View style={styles.faceDetectionLabel}>
        {isProcessing ? (
          <Text style={styles.labelText}>Analyzing image...</Text>
        ) : faceData ? (
          <View>
            <Text style={[styles.labelText, styles.faceFound]}>
              {faceData.length} face{faceData.length !== 1 ? 's' : ''} detected
            </Text>
            {faceData.map((face, index) => (
              <Text key={index} style={styles.emotionText}>
                Face {index + 1}: {emotionIcons[face.emotion] || '😐'} {face.emotion}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={[styles.labelText, styles.noFace]}>
            No faces detected
          </Text>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <Button
          icon="↩️"
          size={40}
          onPress={() => {
            setImage(null);
            setFaceData(null);
          }}
        />
        <Button
          icon="💾"
          size={40}
          onPress={saveImage}
          disabled={isProcessing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: "skyblue",
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    margin: 20,
    overflow: "hidden",
  },
  zoomControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  zoomSlider: {
    flex: 1,
    marginHorizontal: 10,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "gray",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
    backgroundColor: "black",
  },
  faceDetectionLabel: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  labelText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  emotionText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
  faceFound: {
    color: "green",
    fontWeight: "bold",
  },
  noFace: {
    color: "red",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});