import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
      console.log('User logged in!');
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  if (!confirm) {
    return (
        <View style={styles.container}>
            <Text>Enter your phone number:</Text>
            <TextInput
                style={styles.input}
                placeholder="+1 555-555-5555"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <Button
                title="Send Verification Code"
                onPress={() => signInWithPhoneNumber(phoneNumber)}
            />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Text>Enter the verification code:</Text>
        <TextInput
            style={styles.input}
            placeholder="123456"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
        />
        <Button title="Verify Code and Login" onPress={() => confirmCode()} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    input: {
      width: '100%',
      padding: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
  });

export default LoginScreen;
