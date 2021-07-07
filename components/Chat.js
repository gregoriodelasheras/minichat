import React, { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';

// React Native async-storage.
import AsyncStorage from '@react-native-async-storage/async-storage';

// React Native Network Info (NetInfo).
import NetInfo from '@react-native-community/netinfo';

// GiftedChat.
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

// Firebase + Firestore.
const firebase = require('firebase');
require('firebase/firestore');

export default function Chat(props) {
  // Get color parameter from Start component to set background color.
  const bgcolor = props.route.params.bgcolor;
  // Get user name from Start component.
  const name = props.route.params.name;
  // Set chat messages.
  const [messages, setMessages] = useState([]);
  // Set user ID (authentication).
  const [uid, setUid] = useState('');
  // Set user connection status
  const [isConnected, setIsConnected] = useState(false);

  // Add Firebase SDK.
  const firebaseConfig = {
    apiKey: 'AIzaSyDnmUSVDxoqmX3Vh8Vwb-0fdSgBj04w0pk',
    authDomain: 'minichat2-b3fdf.firebaseapp.com',
    projectId: 'minichat2-b3fdf',
    storageBucket: 'minichat2-b3fdf.appspot.com',
    messagingSenderId: '841797473504',
    appId: '1:841797473504:web:7d98f08ea0e9d2dbd1ac85',
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Listen for updates in Firestore messages collection.
  const referenceChatMessages = firebase.firestore().collection('messages');

  // Asynchronous function to get messages from asyncStorage.
  const getMessages = async () => {
    let messages = '';
    let uid = '';
    try {
      // Get data from asyncStorage.
      messages = (await AsyncStorage.getItem('messages')) || [];
      uid = await AsyncStorage.getItem('uid');
      // Set user ID from asyncStorage.
      setUid(JSON.parse(uid));
      // Set messages from asyncStorage.
      setMessages(JSON.parse(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Asynchronous function to save messages in asyncStorage.
  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Asynchronous function to delete user messages stored in asyncStorage.
  // ! This function is only used in the development environment.
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // Void functions to unmount when the app is offline.
    let authUnsubscribe = () => {};
    let unsubscribe = () => {};

    // Check if the user is online or offline.
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        // User is online
        console.log('App is online');
        setIsConnected(true);

        // Authenticate via Firebase.
        authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          // First check if the user is signed in. If not, create a new user.
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          // Assign an ID to the user.
          setUid(user.uid);
          // Store the user ID in asyncStorage.
          AsyncStorage.setItem('uid', JSON.stringify(user.uid));

          setMessages([]);
        });

        unsubscribe = referenceChatMessages
          .orderBy('createdAt', 'desc')
          .onSnapshot(onCollectionUpdate);
      } else {
        // User is offline
        console.log('App is offline');
        setIsConnected(false);

        // Load and display the messages from asyncStorage.
        getMessages();

        // send alert to the user about connection status.
        Alert.alert(
          'Please check your internet connection.',
          'The app is not connected to Internet. You will need access to receive and send new messages. For now you can use the app in read mode.',
        );
      }
    });

    // Unmount.
    return () => {
      // Stop receiving updates about a collection.
      unsubscribe();
      // Stop authentication request.
      authUnsubscribe();
    };
  }, []);

  // Render the real-time changes of the collection with querySnapshot.
  const onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through all the documents in the collection.
    querySnapshot.forEach((doc) => {
      // Save the fields of each document.
      const data = doc.data();

      // Add the data extracted from the collection to the array.
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    // Set the message array with the updated data from Firestore.
    setMessages(messages);
  };

  // Get the new message written by the user.
  const onSend = (messages = []) => {
    // Append the new message to the chat screen.
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages.messages, messages),
    );

    // Each new message written by the user is sent in the first index of the array.
    addMessage(messages[0]);
    // Save messages in asyncStorage.
    saveMessages();
  };

  // Store new message in Firestore.
  const addMessage = (message) => {
    referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  // Edit chat conversation bubbles.
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        // Background color.
        wrapperStyle={{
          left: {
            backgroundColor: '#F5F5F5',
          },
          right: {
            backgroundColor: '#73BA9B',
          },
        }}
        // Text color.
        textStyle={{
          left: {
            color: '#000000',
          },
          right: {
            color: '#000000',
          },
        }}
      />
    );
  };

  // Render InputToolbar if the user is online.
  const renderInputToolbar = (props) => {
    if (isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container(bgcolor)}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}>
      {/* GiftedChat component. */}
      <GiftedChat
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          /* Authenticated ID of the signed user. */
          _id: uid,
          /* Name of the user typed in the Start component. */
          name: name,
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // App container.
  container: (bgcolor) => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: bgcolor,
    justifyContent: 'space-evenly',
  }),
});
