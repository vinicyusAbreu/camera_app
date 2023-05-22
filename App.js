import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import MyCamera from "./src/camera";

export default function App() {
  return <MyCamera />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
