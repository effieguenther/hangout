import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Modal,
  TextInput,
  useTheme
} from 'react-native-paper';
import SMSButton from './SMSButton';

const SendTextModal = ({ visible, setVisible, message = '', recipients = [] }) => {
  const theme = useTheme();

  const hideModal = () => setVisible(false);
  
  const [text, setText] = useState(message);
  
  useEffect(() => {
    setText(message);
  }, [message])

  return (
    <Modal 
      visible={visible} 
      onDismiss={hideModal} 
      contentContainerStyle={{
        ...styles.containerStyle,
        backgroundColor: theme.colors.background,
      }}
    >
      <TextInput
        label="Text Message"
        value={text}
        onChangeText={text => setText(text)}
        multiline={true}
        numberOfLines={8}
        style={{width: '100%'}}
        mode='outlined'
      />
      <SMSButton
        recipients={recipients}
        message={message}
      />
    </Modal>
  );
};

export default SendTextModal;

const styles = StyleSheet.create({
  containerStyle: {
    padding: 30,
    marginHorizontal: 20,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10
  }
})