import React from 'react';
import { StyleSheet } from 'react-native';
// GiftedChat.
import { Actions } from 'react-native-gifted-chat';
// Firebase + Firestore.
import firebase from 'firebase';
import 'firebase/firestore';
// Allow to select images and videos from the phone library or take a picture with the camera.
import * as ImagePicker from 'expo-image-picker';
// Allow reading geolocation information from the device.
import * as Location from 'expo-location';

export default function CustomActions(props) {
  // Select an image or video from device storage to send.
  const sendImage = async () => {
    // Asks the user to grant permissions for accessing user's photo.
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    try {
      if (status === 'granted') {
        // Display the system UI for choosing an image or a video from the phone's library.
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        }).catch((error) => {
          console.error(error);
        });

        if (!result.cancelled) {
          const imageUrl = await uploadImage(result.uri);
          props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Take an image or video to send from the camera.
  const takeImage = async () => {
    // Asks the user to grant permissions for accessing user's camera.
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    try {
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        }).catch((error) => {
          console.error(error);
        });

        if (!result.cancelled) {
          const imageUrl = await uploadImage(result.uri);
          props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Poll the current geolocation or subscribe to geolocation update events.
  const sendLocation = async () => {
    // Asks the user to grant permissions for geolocation while the app is in the foreground.
    const { status } = await Location.requestForegroundPermissionsAsync({});

    try {
      if (status === 'granted') {
        // Requests for one-time delivery of the user's current geolocation.
        const location = await Location.getCurrentPositionAsync({
          // Balanced: Accurate to within one hundred meters.
          accuracy: Location.Accuracy.Balanced,
        }).catch((error) => {
          console.error(error);
        });

        // Send latitude and longitude to locate the position on the map.
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        if (location) {
          props.onSend({ location: { latitude, longitude } });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Convert media file to Blob for Firebase storage.
  const uploadImage = async (uri) => {
    // create a new XMLHttpRequest and set the responseType to type blob.
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    // Create a reference to the storage and put the content retrieved from the Ajax request.
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    const snapshot = await ref.put(blob);

    // Close the connection and return the download URL.
    blob.close();
    return await snapshot.ref.getDownloadURL();
  };

  return (
    // Render Actions.
    <Actions
      {...props}
      containerStyle={styles.container}
      // Display a menu to select actions.
      options={{
        'Send picture from library': sendImage,
        'Take picture': takeImage,
        'Share location': sendLocation,
        // Close menu and return to chat.
        Return: () => {},
      }}
      optionTintColor='#000000'
      accessible={true}
      accessibilityLabel='Actions menu'
      accessibilityHint='Display menu to send a picture, take a picture or send location'
      accessibilityRole='menu'
    />
  );
}

const styles = StyleSheet.create({
  // Actions menu container.
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
});
