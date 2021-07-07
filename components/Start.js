import React, { useState } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

// Set image background.
const appImageBackground = require('../assets/appbackground.png');
// Set background colors: 'Blue Yonder', 'Mulberry', 'Light Salmon', 'Lavender Web'.
const colorPalette = ['#4A6FA5', '#B95F89', '#F7A278', '#D9DBF1'];

export default function Start(props) {
  const [name, setName] = useState('');
  const [bgcolor, setbgcolor] = useState('');

  const handleOnPressChat = (name, bgcolor) => {
    // Sends alert to user if not entered name or chosen color.
    name === '' && bgcolor === ''
      ? Alert.alert(
          'Houston, we have a problem!',
          'Please enter your name and select a color for the chat background before continuing.',
        )
      : name === ''
      ? Alert.alert(
          'Houston, we have a problem!',
          'Please enter your name before continuing.',
        )
      : bgcolor === ''
      ? Alert.alert(
          'Houston, we have a problem!',
          'Please select a color for the chat background before continuing.',
        )
      : props.navigation.navigate('Chat', {
          name,
          bgcolor,
        });
  };

  return (
    <ImageBackground
      source={appImageBackground}
      style={styles.appImageBackground}
      /* Accessibility */
      accessible={true}
      accessibilityLabel='App image background'
      accessibilityHint='Shows an illustration of a woman and a man talking.'
      accessibilityRole='image'>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={50}>
        {/* Box 1: Logo */}
        <View style={styles.box1}>
          <Image
            style={styles.logoApp}
            source={require('../assets/logo.png')}
            /* Accessibility */
            accessible={true}
            accessibilityLabel='App logo'
            accessibilityHint='Shows the word miniChat, and to the left two chat bubbles.'
            accessibilityRole='image'
          />
        </View>

        {/* Box 2: User menu. */}
        <View style={[styles.elementShadow, styles.box2]}>
          {/* Box 2 / Area 1: Set name of user. */}
          <TextInput
            style={styles.nameInputText}
            onChangeText={(name) => setName(name)}
            value={name}
            autoCompleteType='name' // Only Android
            placeholder='Enter your name here...'
            /* Accessibility */
            accessible={true}
            accessibilityLabel='Name input'
            accessibilityHint='Enter here your name that will appear for your contacts in the chat.'
          />

          {/* Box 2 / Area 2: Set background color chat. */}
          <Text style={styles.chooseText}>Choose Background Color:</Text>
          <View
            style={styles.menuSetColor}
            /* Accessibility */
            accessible={true}
            accessibilityLabel='Background color menu'
            accessibilityHint='Menu to select the background color that will appear in the chat.'
            accessibilityRole='menu'>
            {colorPalette.map((icolor) => (
              <TouchableOpacity
                key={icolor}
                style={[
                  styles.elementShadow,
                  styles.selectColor(icolor),
                  bgcolor === icolor ? styles.border : null,
                ]}
                activeOpacity={0.6}
                onPress={() => setbgcolor(icolor)}
                /* Accessibility */
                accessible={true}
                accessibilityLabel='Background color selector'
                accessibilityHint={`Select as background the hexadecimal color ${icolor}.`}
                accessibilityRole='menuitem'
              />
            ))}
          </View>

          {/* Box 2 / Area 3: Send data and render chat component. */}
          <TouchableOpacity
            style={[styles.elementShadow, styles.buttonInput]}
            activeOpacity={0.6}
            onPress={() => handleOnPressChat(name, bgcolor)}
            /* Accessibility */
            accessible={true}
            accessibilityLabel='Start Chatting'
            accessibilityHint='Go to chat screen'
            accessibilityRole='button'>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Background image.
  appImageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  // App container.
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  // Box 1: Logo / Title.
  box1: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logoApp: {
    width: 300,
    height: 100,
  },

  // Box 2: User Menu.
  box2: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 2,
    backgroundColor: '#F5F5F5',
    maxHeight: '50%',
    minHeight: 300,
  },

  // Box 2 / Area 1: Set name of user.
  nameInputText: {
    height: 50,
    width: '90%',
    padding: 10,
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 2,
    fontSize: 16,
    fontFamily: 'Regular',
  },

  // Box 2 / Area 2: Set background color chat.
  chooseText: {
    fontSize: 16,
    fontFamily: 'Regular',
    color: '#757083',
    opacity: 100,
  },
  menuSetColor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectColor: (icolor) => ({
    width: 40,
    height: 40,
    marginHorizontal: 10,
    backgroundColor: icolor,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: icolor,
  }),
  border: {
    borderWidth: 2,
    borderColor: '#595463',
  },

  // Box 2 / Area 3: Send data and render chat component.
  buttonInput: {
    height: 50,
    width: '90%',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#858585',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#73BA9B',
    opacity: 0.8,
  },
  buttonText: {
    fontFamily: 'SemiBold',
    fontSize: 16,
    color: '#0A0A0A',
  },

  // Utilities.
  elementShadow: {
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
});
