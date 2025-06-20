// app/(app)/preferences.js
import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import { useHangoutBuilder } from '@/context/BuildHangoutContext';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  Checkbox,
  Searchbar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
}

export default function InviteScreen() {
  const theme = useTheme();
  const { hangoutData, updateHangoutData } = useHangoutBuilder();
  const [searchQuery, setSearchQuery] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([
    {id: '0', firstName: 'Effie', lastName: 'Guenther', initials: 'EG'},
    {id: '1', firstName: 'Jesselina', lastName: 'Rana', initials: 'JR'},
    {id: '2', firstName: 'Mamu', lastName: '', initials: 'M'},
    {id: '3', firstName: 'Sophie', lastName: 'Wasel', initials: 'SW'}
  ]);
  const [invitedContacts, setInvitedContacts] = useState<Contact[]>(hangoutData.invitedContacts || []);
  
  const toggleInviteContact = (contact: Contact) => {
    const isAlreadyInvited = invitedContacts.some(
      (invited) => invited.id === contact.id
    );
    let updatedInvitedContacts: Contact[];

    if (isAlreadyInvited) {
      updatedInvitedContacts = invitedContacts.filter(
        (invited) => invited.id !== contact.id
      );
    } else {
      updatedInvitedContacts = [...invitedContacts, contact];
    }
    setInvitedContacts(updatedInvitedContacts);
  };

  const advance = () => {
    updateHangoutData({ invitedContacts });
    router.push('/(build_hangout)/date');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{...styles.container, padding: 20}}>
        <BuildHangoutNavigator currentScreen="/(build_hangout)/invite" />
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, marginVertical: 20 }}>
          INVITE
        </Text>
        <Searchbar
          placeholder='Search'
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{width: '100%'}}
        />
        <ScrollView style={{width: '100%', padding: 10}}>
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
                status={invitedContacts.some((invited) => invited.id === contact.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleInviteContact(contact)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      {
        invitedContacts.length > 0 && (
          <Surface
            style={styles.bottomBanner}
          >
            <Text>
              {invitedContacts.length} Selected
            </Text>
            <Button
              onPress={advance}
              mode='contained'
            >
              CONTINUE
            </Button>
          </Surface>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
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
  },
  bottomBanner: {
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 15,
    paddingBottom: 50,
  }
});