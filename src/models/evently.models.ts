export interface Event {
  id: string;
  name: string;
  description: string;
  date: string; // Using string for simplicity, can be Date object
  location: string;
  creator: string; // UID of the user who created the event
  attendees: string[]; // Array of UIDs of users attending
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  friends: string[];
  attendingEvents?: string[];
  savedEvents?: string[];
}

export interface Plan {
  id: string;
  eventId: string;
  createdBy: string;
  invitedFriends: number;
  status: 'active' | 'cancelled';
  invitedContacts?: string[];
}
