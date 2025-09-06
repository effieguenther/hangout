import Contact from '@/types/hangoutData/Contact';
import React from 'react';
import { Alert, Linking, Platform, StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

interface SMSButtonProps {
  recipients: Contact[];
  message: string;
}

const SMSButton: React.FC<SMSButtonProps> = ({ recipients = [], message = '' }) => {
  const theme = useTheme();
  const handleSendSMS = async () => {
    const recipientString = recipients.join(',');
    const encodedMessage = encodeURIComponent(message);
    const smsUrl = (Platform.OS === 'android') 
      ? `sms:${recipientString}?body=${encodedMessage}`
      : `sms:/open?addresses=${recipientString}&body=${message}`

    try {
      const canOpen = await Linking.canOpenURL(smsUrl);
      
      if (canOpen) {
        await Linking.openURL(smsUrl);
      } else {
        Alert.alert(
          'Cannot Open Messaging App',
          'Your device does not support sending SMS this way or the app is not available.'
        );
      }
    } catch (error) {
      console.error('An error occurred while trying to send an SMS:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <IconButton
        mode='contained'
        icon='message'
        onPress={handleSendSMS}
        size={20}
        style={{borderColor: theme.colors.primary, borderWidth: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 10
  }
});

export default SMSButton;
