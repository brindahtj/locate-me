import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { addCity, removeCity } from "../reducers/user";

export default function PlacesScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [city, setCity] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePressAdd = () => {
    const regex = /^[0-9]/g;
    if (city.length === 0 || !city.trim() || city.match(regex)) {
      setErrorMsg("Please enter a city !");
      return;
    }
    {
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.features.length === 0) {
            setErrorMsg("Enter a valid city !");
            return;
          }

          const places = {
            nameCity: city,
            lat: data.features[0].geometry.coordinates[1],
            lon: data.features[0].geometry.coordinates[0],
          };
          dispatch(addCity(places));
          setCity("");
          setErrorMsg("");
        });
    }
  };
  const handlePressRemove = (name) => {
    dispatch(removeCity(name));
  };
  console.log(user.places);

  const placesData = user.places;

  const places = placesData.map((place, id) => {
    // On boucle sur le tableau des lieux stockÃ©s dans le store Redux pour les afficher dans une liste
    return (
      <View key={id} style={styles.placeCard}>
        <View>
          <Text style={styles.name}>{place.nameCity}</Text>
          <Text>
            LAT : {Number(place.lat).toFixed(3)} LON :{" "}
            {Number(place.lon).toFixed(3)}
          </Text>
        </View>
        <FontAwesome
          name="trash-o"
          style={styles.icon}
          onPress={() => handlePressRemove(place.nameCity)}
        />
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{user.userName}'s Places</Text>

      <View style={styles.inputBlock}>
        <TextInput
          placeholder="New city"
          style={styles.input}
          onChangeText={(value) => setCity(value)}
          value={city}
        />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => handlePressAdd()}
        >
          <Text style={styles.textButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {places}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 20,
    fontFamily: "Pacifico_400Regular",
  },
  name: {
    fontSize: 18,
  },
  inputBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    width: "80%",
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
  },
  input: {
    width: "65%",
    borderBottomWidth: 1,
    borderBottomColor: "#B733D0",
    fontSize: 17,
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#B733D0",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 7,
  },
  textButton: {
    color: "#fff",
  },
  scrollView: {
    alignItems: "center",
    marginTop: 20,
    maxWidth: "100%",
  },
  placeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  icon: {
    color: "#B733D0",
    fontSize: 23,
  },
});
