import React, { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';

// GiftedChat.
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

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
  const [uid, setUid] = useState(null);

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

  useEffect(() => {
    // First check if the user is signed in. If not, create a new user.
    const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }

      setUid(user.uid);
      setMessages([]);
    });

    // Stop receiving updates about a collection.
    const unsubscribe = referenceChatMessages
      .orderBy('createdAt', 'desc')
      .onSnapshot(onCollectionUpdate);

    // Unmount.
    return () => {
      unsubscribe();
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
      GiftedChat.append(previousMessages, messages),
    );

    // Each new message written by the user is sent in the first index of the array.
    addMessage(messages[0]);
  };

  // Save the message of the user in Firestore.
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

  return (
    <KeyboardAvoidingView
      style={styles.container(bgcolor)}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      {/* GiftedChat component. */}
      <GiftedChat
        renderBubble={renderBubble}
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
