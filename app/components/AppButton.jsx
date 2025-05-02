import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Colors from "../config/Colors";
export default function AppButton({
  title="Button",
  onPress,
  style,
  textColor = "black",
  textSize = 14
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
    >
      <Text style={{fontSize : textSize, color : textColor, fontWeight : "bold"}}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  
  
});
