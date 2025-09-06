import { useHangoutBuilder } from '@/context/BuildHangoutContext';
import useContacts from '@/hooks/useContacts';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
  const [displayedContacts, setDisplayedContacts] = useState<Contact[]>([]);
  const [invitedContacts, setInvitedContacts] = useState<Contact[]>(hangoutData.invitedContacts || []);
  const { allContacts, loading: contactsLoading, error: contactsError } = useContacts();

  // manage displayed contacts state
  useEffect(() => {
    if (contactsLoading || contactsError) {
      setDisplayedContacts([]);
      return;
    }

    let filteredAndSortedContacts: Contact[];

    if (searchQuery) {
      const filtered = allContacts.filter(contact => {
        const fullName = `${contact.firstName} ${contact.lastName}`.trim().toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
      filteredAndSortedContacts = filtered.slice(0, 30);
    } else {
      filteredAndSortedContacts = allContacts.slice(0, 30);
    }
    setDisplayedContacts(filteredAndSortedContacts);
  }, [searchQuery, allContacts, contactsLoading, contactsError]);


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
    updateHangoutData({ invitedContacts: updatedInvitedContacts });
  };

  const onNext = () => {
    router.push('/(build_hangout)/date');
  }

  return (
    <View style={styles.container}>
      <View style={{...styles.container, paddingHorizontal: 20, backgroundColor: theme.colors.background}}>
        <Text variant="titleLarge" style={{ color: theme.colors.onBackground, marginVertical: 20 }}>
          INVITE
        </Text>
        <Searchbar
          placeholder='Search'
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{width: '100%', borderRadius: 10}}
          iconColor={theme.colors.tertiary}
          elevation={1}
        />
        <ScrollView style={{width: '100%', padding: 10}}>
          {contactsLoading ? (
            <Text style={{textAlign: 'center', marginTop: 20}}>Loading contacts...</Text>
          ) : contactsError ? (
            <Text style={{textAlign: 'center', marginTop: 20, color: theme.colors.error}}>
              Error: {contactsError}
            </Text>
          ) : displayedContacts.length > 0 ? (
            displayedContacts.map((contact) => (
              <View style={styles.contactContainer} key={`contact_${contact.id}`}>
                <Avatar.Text
                  size={34}
                  label={contact.initials}
                  style={{backgroundColor: theme.colors.tertiary}}
                  color={theme.colors.onTertiary}
                />
                <Text style={{flex: 1}}>
                  {contact.firstName} {contact.lastName}
                </Text>
                <Checkbox.Android
                  status={invitedContacts.some((invited) => invited.id === contact.id) ? 'checked' : 'unchecked'}
                  onPress={() => toggleInviteContact(contact)}
                />
              </View>
            ))
          ) : (
            <Text style={{textAlign: 'center', marginTop: 20}}>
              {searchQuery ? `No contacts found for "${searchQuery}".` : 'No contacts available.'}
            </Text>
          )}
        </ScrollView>
      </View>
      {
        invitedContacts.length > 0 && (
          <Surface
            style={styles.bottomBanner}
          >
            <Text style={{flex: 1, marginRight: 18}}>
              {
                invitedContacts.map((contact, idx) => (
                  <Text key={contact.id} style={{flexWrap: 'wrap'}}>
                    {contact.firstName + ' ' + (contact.lastName && contact.lastName[0])}
                    {idx < invitedContacts.length - 1 && ', '}
                  </Text>
                ))
              }
            </Text>
            <Button
              onPress={onNext}
              mode='contained'
              buttonColor={theme.colors.secondary}
              textColor={theme.colors.onSecondary}
              style={{borderRadius: 10}}
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
    paddingBottom: 50
  }
});