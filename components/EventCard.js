import React from "react";
import { Pressable, Text } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";

export default function EventCard({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={GlobalStyles.eventCard}>
      <Text style={GlobalStyles.eventCardTitle}>{item.title}</Text>
      <Text style={GlobalStyles.eventCardDescription} numberOfLines={1}>
        {item.description}
      </Text>
    </Pressable>
  );
}
