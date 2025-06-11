// app/(app)/preferences.js
import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
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
  invited: boolean;
}

export default function InviteScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([
    {id: '0', firstName: 'Effie', lastName: 'Guenther', initials: 'EG', invited: false},
    {id: '1', firstName: 'Jesselina', lastName: 'Rana', initials: 'JR', invited: false},
    {id: '2', firstName: 'Mamu', lastName: '', initials: 'M', invited: false},
    {id: '3', firstName: 'Sophie', lastName: 'Wasel', initials: 'SW', invited: false}
  ]);
  const [invitedContacts, setInvitedContacts] = useState<Contact[]>([]);

  const toggleInviteContact = (index: number) => {
    const copyContacts = [...contacts];
    const toggledContact = { ...copyContacts[index] }
    copyContacts[index].invited = !toggledContact.invited;
    
    if (copyContacts[index].invited) {
      const copyInvitedContacts = [...invitedContacts];
      copyInvitedContacts.push(copyContacts[index]);
      setInvitedContacts(copyInvitedContacts);
    } else {
      const copyInvitedContacts = invitedContacts.filter(
        (contact) => contact.id !== toggledContact.id
      );
      setInvitedContacts(copyInvitedContacts);
    }

    setContacts(copyContacts);
  }

  const advance = () => {
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
                status={contact.invited ? 'checked' : 'unchecked'}
                onPress={() => toggleInviteContact(index)}
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