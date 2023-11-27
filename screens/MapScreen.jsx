import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { addCity } from "../reducers/user";
import constants from "expo-constants";

export default function MapScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
    })();
  }, []);

  const handleLongPress = (value) => {
    setIsModalVisible(true);
    setTempLocation(value.nativeEvent.coordinate);
  };
  const addPlaceToStore = () => {
    dispatch(
      addCity({
        nameCity: newPlace,
        lat: tempLocation.latitude,
        lon: tempLocation.longitude,
      })
    );
    setIsModalVisible(false);
    setNewPlace("");
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const marker = user.places.map((place, id) => {
    return (
      <Marker
        key={id}
        title={place.nameCity}
        coordinate={{ latitude: place.lat, longitude: place.lon }}
      />
    );
  });

  return (
    <View style={style.container}>
      <Modal visible={isModalVisible} transparent>
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <TextInput
              placeholder="New place"
              style={style.input}
              onChangeText={(value) => setNewPlace(value)}
              value={newPlace}
            />
            <TouchableOpacity
              style={style.button}
              activeOpacity={0.8}
              onPress={() => addPlaceToStore()}
            >
              <Text style={style.textButton}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.button}
              activeOpacity={0.8}
              onPress={() => handleClose()}
            >
              <Text style={style.textButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {currentPosition && (
        <MapView
          mapType="hybrid"
          region={{
            latitude: 48.8399999,
            longitude: 2.3537766,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          style={style.map}
          onLongPress={(value) => handleLongPress(value)}
          showsUserLocation={true}
        >
          <Marker
            title="My Position"
            coordinate={currentPosition}
            pinColor="#fecb2d"
          />
          {marker}
        </MapView>
      )}
    </View>
  );
}
const style = StyleSheet.create({
  img: {
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
  },
  marker: {
    backgroundColor: "#fecb2d",
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 0 : constants.statusBarHeight,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 150,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#ec6e5b",
    borderRadius: 10,
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
});
