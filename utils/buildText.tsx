import { getReadableDate } from "./dateUtils";

export const buildText = (hangoutData, selectedResults) => {
  const message = ['Hey'];
  if (hangoutData.invitedContacts) {
    message.push(` ${hangoutData?.invitedContacts[0]?.firstName}`)
    const contactsLen = hangoutData?.invitedContacts?.length;
    if (contactsLen === 2) {
      message.push(` and ${hangoutData.invitedContacts[1].firstName}`)
    } else if (contactsLen > 1) {
      message.push(', ');
        for (let i = 1; i < contactsLen; i++) {
          if (i + 1 === contactsLen) {
            message.push(`and ${hangoutData?.invitedContacts[i]?.firstName}`)
          } else if (i + 1 < contactsLen) {
            message.push(`${hangoutData?.invitedContacts[i]?.firstName}, `)
          }
      }
    }
  }
  if (hangoutData.date) {
    message.push(", I'm free")
    message.push(` ${getReadableDate(hangoutData.date[0])}`)
    const dateLen = hangoutData.date.length;
    if (dateLen === 2) {
      message.push (` and ${getReadableDate(hangoutData.date[1])}`)
    } else if (dateLen > 1) {
      for (let i = 0; i < dateLen; i++) {
        if (i + 1 === dateLen ) {
          message.push(`and  ${getReadableDate(hangoutData.date[i])}`)
        } else if (i + 1 < dateLen) {
          message.push(`${getReadableDate(hangoutData.date[i])}, `)
        }
      }
    }
  }
  
  message.push(". Let's go to one of these places?\n\n")
  for (let i = 0; i < selectedResults.length; i++) {
    message.push(selectedResults[i]?.displayName?.text + '\n')
  }
  console.log(message);
  console.log(message.join(''));
  return message.join('');
}