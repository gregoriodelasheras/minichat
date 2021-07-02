import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';

// GiftedChat.
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default function Chat(props) {
  // Set chat messages.
  const [messages, setMessages] = useState([]);
  // Get color parameter from Start component to set background color.
  const bgcolor = props.route.params.bgcolor;
  const name = props.route.params.name;

  useEffect(() => {
    setMessages([
      // TestBot Message #2.
      {
        _id: 7,
        text: 'This native app is cool!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://herasdev.com/img/f-01.jpg',
        },
      },
      // User Message #2.
      {
        _id: 6,
        text: 'What do you think about this app?',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://herasdev.com/img/f-01.jpg',
        },
      },
      // User Message #1.
      {
        _id: 5,
        text: 'Hello to you, TestBot!',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://herasdev.com/img/f-01.jpg',
        },
      },
      // System Message #2: User chat entry message.
      {
        _id: 4,
        text: `${name} entered the chat`,
        createdAt: new Date(),
        system: true,
      },
      // TestBot Message #1.
      {
        _id: 3,
        text: `Hello ${name}!`,
        createdAt: new Date(Date.UTC(2021, 5, 30, 17, 21, 0)),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://herasdev.com/img/f-01.jpg',
        },
      },
      // System Message #2: TestBot chat entry message.
      {
        _id: 2,
        text: 'TestBot entered the chat',
        createdAt: new Date(Date.UTC(2021, 5, 30, 17, 20, 0)),
        system: true,
      },
      // System Message #1: end-to-end encryption.
      {
        _id: 1,
        text: 'This conversation is secured with end-to-end encryption.',
        createdAt: new Date(Date.UTC(1987, 4, 11, 0, 0, 0)),
        system: true,
      },
    ]);
  }, []); // No dependencies: only run once.

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

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
          _id: 1,
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
