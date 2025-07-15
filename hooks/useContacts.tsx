import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
}

const transformContact = (rawContact: Contacts.Contact): Contact => {
  const firstName = rawContact.firstName || '';
  const lastName = rawContact.lastName || '';
  const name = rawContact.name || '';
  let initials = '';

  // Generate initials: first letter of first name + first letter of last name
  if (firstName && lastName) {
    initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  } else if (firstName) {
    initials = firstName.charAt(0);
  } else if (lastName) {
    initials = lastName.charAt(0);
  } else if (name) {
    initials = name.charAt(0);
  }

  return {
    id: rawContact.id,
    firstName: firstName || name,
    lastName: lastName,
    initials: initials.toUpperCase(),
  };
};

const sortContacts = (a: Contact, b: Contact) => {
  const nameA = `${a.firstName} ${a.lastName}`.trim().toLowerCase();
  const nameB = `${b.firstName} ${b.lastName}`.trim().toLowerCase();
  return nameA.localeCompare(nameB);
};

const useContacts = () => {
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch attempt
      try {
        const { status } = await Contacts.requestPermissionsAsync();

        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name],
          });

          if (data.length > 0) {
            const processedContacts = data
              .map(transformContact)
              .sort(sortContacts);
            setAllContacts(processedContacts);
          } else {
            setAllContacts([]);
          }
        } else {
          const errorMessage = 'Contacts permission denied. Please grant permission in settings.';
          console.log(errorMessage);
          setError(errorMessage);
          setAllContacts([]);
        }
      } catch (e) {
        const errorMessage = `Failed to load contacts: ${e instanceof Error ? e.message : String(e)}`;
        console.error(errorMessage);
        setError(errorMessage);
        setAllContacts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { allContacts, loading, error };
};

export default useContacts;