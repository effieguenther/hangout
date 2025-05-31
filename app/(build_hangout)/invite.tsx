// app/(app)/preferences.js
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Text, 
  useTheme, 
  Avatar,
  Searchbar,
  Checkbox,
} from 'react-native-paper';
import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';

export default function InviteScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('')
  const frequentContacts = ['EG', 'JR', 'M', 'SW']
  const [contacts, setContacts] = useState([
    {firstName: 'Effie', lastName: 'Guenther', initials: 'EG', invited: false},
    {firstName: 'Jesselina', lastName: 'Rana', initials: 'JR', invited: false},
    {firstName: 'Mamu', lastName: '', initials: 'M', invited: false},
    {firstName: 'Sophie', lastName: 'Wasel', initials: 'SW', invited: false}
  ]);
  const toggleInviteContact = (index) => {
    const copy = [...contacts];
    copy[index].invited = !copy[index].invited;
    setContacts(copy);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BuildHangoutNavigator currentScreen="/(build_hangout)/invite" />
      <Text variant="headlineLarge" style={{ color: theme.colors.onBackground }}>
        INVITE
      </Text>
      <View style={styles.frequentContactsContainer}>
        {frequentContacts.map((contact, index) => (
          <Avatar.Text 
            key={`frequentContact_${index}`}
            size={50}
            label={contact} 
          />
        ))}
      </View>
      <Searchbar
        placeholder='Search'
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{width: '100%'}}
      />
      <View style={{width: '100%', padding: 10}}>
        {contacts.map((contact, index) => (
          <View style={styles.contactContainer} key={`contact_${index}`}>
            <Avatar.Text 
              size={24}
              label={contact.initials} 
            />
            <Text style={{flex: 1}}>
              {contact.firstName} {contact.lastName}
            </Text>
            <Checkbox.Android
              status={contact.invited ? 'checked' : 'unchecked'}
              onPress={() => toggleInviteContact(index)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  frequentContactsContainer: {
    flexDirection: 'row',
    gap: 20,
    padding: 20
  },
  contactContainer: {
    flexDirection: 'row',
    padding: 10,
    width: '100%',
    gap: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});