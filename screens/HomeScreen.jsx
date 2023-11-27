import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { addName, addCity } from "../reducers/user";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [fontsLoaded] = useFonts({ Pacifico_400Regular });

  if (!fontsLoaded) {
    return null;
  }
  const handleUsername = () => {
    if (name.length === 0 || !name.trim()) {
      setErrorMsg("Please enter a nickname !");
      return;
    }

    dispatch(addName(name));
    setErrorMsg("");

    navigation.navigate("TabNavigator", { screen: "Map" });
  };

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      enabled={true}
    >
      <Image source={require("../assets/home-image.png")} />
      <Text style={style.font}>Welcome to locate me</Text>
      <TextInput
        style={style.input}
        onChangeText={(value) => setName(value)}
        placeholder="Nickname"
        value={name}
      />
      <TouchableOpacity style={style.button} onPress={() => handleUsername()}>
        <Text style={style.text}>Go to map</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F2F1",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: "70%",
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: "#B733D0",
    borderRadius: 10,
    width: 300,
  },
  input: {
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderBottomColor: "#B733D0",
    borderBottomWidth: 1,
    borderRadius: 15,
    width: 300,
  },
  text: {
    color: "white",
  },
  font: {
    fontFamily: "Pacifico_400Regular",
    fontSize: 35,
  },
});
