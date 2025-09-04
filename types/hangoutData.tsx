export interface MarkedDay {
  dateString: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  dotColor?: string;
  selectedDotColor?: string;
}

export interface Contact {
  id: string | undefined;
  firstName: string;
  lastName: string;
  initials: string;
  phoneNumber: string | undefined;
}

export interface Filters {
  activity: string[];
  distance: string;
  budget: string[];
}

export interface HangoutData {
  date?: MarkedDay[];
  invitedContacts?: Contact[];
  filters?: Filters;
}