export interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    creator: string;
    attendees: string[];
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
