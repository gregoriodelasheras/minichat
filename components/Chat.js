import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function Chat(props) {
  // Get color parameter from Start component to set background color.
  const bgcolor = props.route.params.bgcolor;

  return (
    <KeyboardAvoidingView
      style={styles.container(bgcolor)}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      {/* Box 1: Return Button. */}
      <View style={styles.box1}>
        <TouchableOpacity
          style={[styles.elementShadow, styles.buttonReturn]}
          activeOpacity={0.6}
          onPress={() => props.navigation.navigate('miniChat')}>
          <Text style={styles.buttonText}>Go to Start</Text>
        </TouchableOpacity>
      </View>
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

  // Box 1: Return Button.
  box1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  buttonReturn: {
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
